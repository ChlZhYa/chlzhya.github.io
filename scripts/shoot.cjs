// 自包含 CDP 截图助手（无外部依赖，使用 Node22 全局 WebSocket）
// 用法: node scripts/shoot.cjs [url] [outPath] [scrollY] [waitMs] [extraScrollY]
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9250 + Math.floor(Math.random() * 40);

async function main() {
  const url = process.argv[2] || "http://127.0.0.1:5173/#/travel";
  const out = process.argv[3] || "shot.png";
  const scrollY = parseInt(process.argv[4] || "600", 10);
  const wait = parseInt(process.argv[5] || "1200", 10);

  const chrome = spawn(
    CHROME,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--window-size=1280,1600",
      `--remote-debugging-port=${PORT}`,
      url,
    ],
    { stdio: "ignore" }
  );

  try {
    const tab = await waitForTab();
    const ws = await openWs(tab.webSocketDebuggerUrl);

    let id = 0;
    const pending = new Map();
    ws.addEventListener("message", (ev) => {
      const m = JSON.parse(ev.data);
      if (m.id && pending.has(m.id)) {
        pending.get(m.id)(m.result);
        pending.delete(m.id);
      }
    });
    const send = (method, params = {}) =>
      new Promise((res) => {
        const mid = ++id;
        pending.set(mid, res);
        ws.send(JSON.stringify({ id: mid, method, params }));
      });

    await send("Page.enable");
    await send("Runtime.enable");
    await sleep(wait);
    await send("Runtime.evaluate", { expression: `window.scrollTo({top:${scrollY},behavior:'instant'})` });
    await sleep(wait);
    const { data } = await send("Page.captureScreenshot", { format: "png" });
    fs.writeFileSync(out, Buffer.from(data, "base64"));
    console.log("saved", out, "scrollY=" + scrollY, "port=" + PORT);
    ws.close();
  } finally {
    chrome.kill();
  }
}

// 用 EventTarget API 打开 ws（Node 全局 WebSocket 是 EventTarget，不是 EventEmitter）
function openWs(url) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(url);
    ws.addEventListener("open", () => res(ws));
    ws.addEventListener("error", (e) => rej(new Error("ws error: " + (e.message || "unknown"))));
    setTimeout(() => rej(new Error("ws open timeout")), 5000);
  });
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function getJson(url) {
  return new Promise((res, rej) => {
    http.get(url, (r) => {
      let b = "";
      r.on("data", (d) => (b += d));
      r.on("end", () => {
        try {
          res(JSON.parse(b));
        } catch (e) {
          rej(e);
        }
      });
    }).on("error", rej);
  });
}
// 一直重试，直到拿到一个带 ws 地址的 page tab
function waitForTab(tries = 80) {
  return new Promise((res, rej) => {
    const t = () =>
      getJson(`http://127.0.0.1:${PORT}/json`)
        .then((tabs) => {
          const page = Array.isArray(tabs) && tabs.find((x) => x.type === "page" && x.webSocketDebuggerUrl);
          if (page) res(page);
          else if (--tries) setTimeout(t, 200);
          else rej(new Error("no page tab"));
        })
        .catch(() => (--tries ? setTimeout(t, 200) : rej(new Error("chrome timeout"))));
    t();
  });
}
const once = (em, ev) => new Promise((res) => em.addEventListener(ev, res, { once: true }));
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
