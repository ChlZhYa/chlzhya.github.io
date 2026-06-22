// CDP 几何探针：读取每张卡片的实际 3D 屏幕投影位置，判断是否重叠/分散
// 用法: node scripts/probe.cjs [url] [scrollY]
const { spawn } = require("child_process");
const http = require("http");
const fs = require("fs");

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = 9260 + Math.floor(Math.random() * 30);

async function main() {
  const url = process.argv[2] || "http://127.0.0.1:5173/#/travel";
  const scrollY = parseInt(process.argv[3] || "400", 10);

  const chrome = spawn(CHROME, ["--headless=new","--disable-gpu","--window-size=1280,1600",`--remote-debugging-port=${PORT}`,url], { stdio: "ignore" });
  try {
    const tab = await waitForTab();
    const ws = await openWs(tab.webSocketDebuggerUrl);
    let id = 0; const pending = new Map();
    ws.addEventListener("message", (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
    const send = (method, params = {}) => new Promise(res => { const mid=++id; pending.set(mid,res); ws.send(JSON.stringify({id:mid,method,params})); });

    await send("Runtime.enable");
    await sleep(1500);
    await send("Runtime.evaluate", { expression: `window.scrollTo({top:${scrollY},behavior:'instant'})` });
    await sleep(1200);

    // 取每张卡片的屏幕矩形 + 中点
    const { result } = await send("Runtime.evaluate", {
      expression: `JSON.stringify(Array.from(document.querySelectorAll('.cyl-card')).map((c,i)=>{
        const r=c.getBoundingClientRect();
        const cs=getComputedStyle(c);
        return { i, left:r.left.toFixed(0), top:r.top.toFixed(0), w:r.width.toFixed(0), h:r.height.toFixed(0), cx:(r.left+r.width/2).toFixed(0), cy:(r.top+r.height/2).toFixed(0), transform:cs.transform, opacity:cs.opacity, visible: r.bottom>0 && r.top<innerHeight };
      }))`,
      returnByValue: true,
    });
    const cards = JSON.parse(result.value);
    console.log("scrollY=" + scrollY + "  cards=" + cards.length);
    cards.forEach(c => console.log(JSON.stringify(c)));
    ws.close();
  } finally { chrome.kill(); }
}

const sleep = ms => new Promise(r=>setTimeout(r,ms));
function getJson(url){return new Promise((res,rej)=>{http.get(url,r=>{let b="";r.on("data",d=>b+=d);r.on("end",()=>{try{res(JSON.parse(b));}catch(e){rej(e);}});}).on("error",rej);});}
function waitForTab(tries=80){return new Promise((res,rej)=>{const t=()=>getJson(`http://127.0.0.1:${PORT}/json`).then(tabs=>{const p=Array.isArray(tabs)&&tabs.find(x=>x.type==="page"&&x.webSocketDebuggerUrl);if(p)res(p);else if(--tries)setTimeout(t,200);else rej(new Error("no tab"));}).catch(()=>(--tries?setTimeout(t,200):rej(new Error("timeout"))));t();});}
function openWs(url){return new Promise((res,rej)=>{const ws=new WebSocket(url);ws.addEventListener("open",()=>res(ws));ws.addEventListener("error",e=>rej(new Error("ws err "+(e.message||""))));setTimeout(()=>rej(new Error("ws timeout")),5000);});}
main().catch(e=>{console.error(e);process.exit(1);});
