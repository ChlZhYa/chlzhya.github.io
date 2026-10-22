import { seedEntries, categories } from "./data.js";

const storageKey = "flow-journal-v1";
const allowedKinds = new Set(["log", "essay"]);
const allowedCategories = new Set([
  "AI / Agent",
  "开发",
  "阅读",
  "生活",
  "其他",
]);
const app = document.querySelector("#app");
const status = document.querySelector("#site-status");
const searchDialog = document.querySelector("#search-dialog");
const writeDialog = document.querySelector("#write-dialog");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const form = document.querySelector("#entry-form");
const formMessage = document.querySelector("#form-message");
let filter = "全部";
let userEntries = [];
let storageError = "";
let statusTimer;

function node(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (name === "class") element.className = value;
    else if (name === "text") element.textContent = value;
    else if (name === "dataset") Object.assign(element.dataset, value);
    else element.setAttribute(name, value);
  }
  for (const child of children) element.append(child);
  return element;
}

function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

function validEntry(entry) {
  return (
    entry &&
    typeof entry === "object" &&
    !Array.isArray(entry) &&
    typeof entry.id === "string" &&
    /^local-[0-9a-f-]{36}$/.test(entry.id) &&
    allowedKinds.has(entry.kind) &&
    typeof entry.title === "string" &&
    entry.title.trim().length > 0 &&
    entry.title.length <= 100 &&
    validDate(entry.date) &&
    allowedCategories.has(entry.category) &&
    Array.isArray(entry.tags) &&
    entry.tags.length <= 8 &&
    entry.tags.every(
      (tag) =>
        typeof tag === "string" &&
        tag.trim() === tag &&
        tag.length > 0 &&
        tag.length <= 24,
    ) &&
    typeof entry.body === "string" &&
    entry.body.trim().length > 0 &&
    entry.body.length <= 30000 &&
    typeof entry.updatedAt === "string" &&
    Number.isFinite(Date.parse(entry.updatedAt))
  );
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw === null) {
      storageError = "";
      return [];
    }
    const snapshot = JSON.parse(raw);
    if (
      !snapshot ||
      snapshot.version !== 1 ||
      !Array.isArray(snapshot.entries) ||
      snapshot.entries.length > 10000 ||
      !snapshot.entries.every(validEntry) ||
      new Set(snapshot.entries.map((entry) => entry.id)).size !==
        snapshot.entries.length
    )
      throw new Error("Invalid snapshot");
    storageError = "";
    return snapshot.entries;
  } catch {
    storageError =
      "当前浏览器中的记录无法读取。为避免覆盖原数据，暂时无法保存新记录。请先检查浏览器站点数据。";
    return [];
  }
}

userEntries = loadEntries();

function allEntries() {
  return [...userEntries, ...seedEntries].sort(
    (a, b) =>
      b.date.localeCompare(a.date) || b.updatedAt.localeCompare(a.updatedAt),
  );
}

function isDemo(entry) {
  return entry.id.startsWith("demo-");
}
function entryHref(entry) {
  return `#/entry/${encodeURIComponent(entry.id)}`;
}
function shortDate(date) {
  return date.replaceAll("-", ".");
}
function weekday(date) {
  return new Intl.DateTimeFormat("zh-CN", {
    weekday: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T12:00:00Z`));
}
function currentLocalDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function excerpt(entry) {
  return entry.body.replace(/\s+/g, " ").slice(0, 138);
}
function announce(message) {
  status.textContent = message;
  clearTimeout(statusTimer);
  statusTimer = setTimeout(() => {
    status.textContent = "";
  }, 6000);
}
function storageAlert() {
  return storageError
    ? node("p", { class: "storage-alert", text: storageError })
    : null;
}

function tagsFor(entry) {
  const list = node("div", { class: "tag-list" });
  const labels = [
    entry.category,
    ...entry.tags.filter((tag) => tag !== entry.category),
  ];
  for (const label of labels)
    list.append(node("span", { class: "tag", text: label }));
  if (isDemo(entry))
    list.append(node("span", { class: "tag sample", text: "示例" }));
  return list;
}

function hero() {
  return node("section", { class: "hero" }, [
    node("div", { class: "hero-copy" }, [
      node("h1", {}, [
        document.createTextNode("在学习中生长，"),
        node("span", { text: "在记录中看见自己。" }),
      ]),
      node("p", { text: "一些每天积累的知识，和偶尔停下来想的事情。" }),
    ]),
    node("div", { class: "hero-art", "aria-hidden": "true" }, [
      node("img", { src: "/assets/flow-ribbon.png", alt: "" }),
      node("span", { class: "hero-script", text: "a little,\nevery day." }),
    ]),
  ]);
}

function timelineRow(entry) {
  const date = node("div", { class: "timeline-date" }, [
    node("span", { class: "day-number", text: entry.date.slice(8) }),
    node("span", {
      class: "month-year",
      text: `${new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" }).format(new Date(`${entry.date}T12:00:00Z`)).toUpperCase()} ${entry.date.slice(0, 4)}`,
    }),
    node("span", { class: "weekday", text: weekday(entry.date) }),
  ]);
  return node("article", { class: "timeline-row" }, [
    date,
    node("div", { class: "timeline-track", "aria-hidden": "true" }),
    node("div", { class: "timeline-content" }, [
      node("h3", { class: "entry-title" }, [
        node("a", { href: entryHref(entry), text: entry.title }),
      ]),
      tagsFor(entry),
      node("p", { class: "excerpt", text: excerpt(entry) }),
      node("a", {
        class: "read-link",
        href: entryHref(entry),
        text: "继续阅读 ↗",
        "aria-label": `继续阅读：${entry.title}`,
      }),
    ]),
  ]);
}

function emptyState(title, detail, actionText, action) {
  const section = node("div", { class: "empty-state" }, [
    node("strong", { text: title }),
    node("span", { text: detail }),
  ]);
  if (actionText) {
    const button = node("button", {
      class: "outline-button",
      type: "button",
      text: actionText,
    });
    button.addEventListener("click", action);
    section.append(button);
  }
  return section;
}

function calendar(entries) {
  const today = currentLocalDate();
  const [year, month] = today.split("-").map(Number);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const days = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const offset = (firstDay.getUTCDay() + 6) % 7;
  const logDates = new Map();
  for (const entry of entries.filter(
    (item) => item.kind === "log" && item.date.startsWith(today.slice(0, 7)),
  )) {
    if (!logDates.has(entry.date)) logDates.set(entry.date, []);
    logDates.get(entry.date).push(entry);
  }
  const section = node("section", { class: "sidebar-calendar" });
  section.append(
    node("h3", {
      text: `${new Intl.DateTimeFormat("zh-CN", { month: "long" }).format(firstDay)}，留下了一些足迹`,
    }),
  );
  const grid = node("div", {
    class: "calendar calendar-grid",
    "aria-label": `${year}年${month}月学习记录日历`,
  });
  for (const label of ["周一", "周二", "周三", "周四", "周五", "周六", "周日"])
    grid.append(node("span", { class: "calendar-head", text: label }));
  for (let i = 0; i < offset; i++)
    grid.append(
      node("span", { class: "calendar-day empty", "aria-hidden": "true" }),
    );
  for (let day = 1; day <= days; day++) {
    const date = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const active = logDates.get(date) ?? [];
    const cell = node("span", {
      class: `calendar-day${active.length ? " has-entry" : ""}${active.length > 1 ? " intense" : ""}${date === today ? " today" : ""}`,
    });
    if (active.length)
      cell.append(
        node("a", {
          href: entryHref(active[0]),
          text: String(day),
          "aria-label": `${date}，${active.length}条学习记录，查看${active[0].title}`,
        }),
      );
    else cell.textContent = String(day);
    grid.append(cell);
  }
  section.append(grid);
  return section;
}

function sidebar(entries) {
  const aside = node("aside", {
    class: "sidebar",
    "aria-label": "日历与感悟文章",
  });
  aside.append(calendar(entries));
  const preview = node("section", { class: "sidebar-essays" }, [
    node("h3", { text: "偶尔，写得长一点" }),
    node("p", { text: "那些没有标准答案的想法。" }),
  ]);
  for (const entry of entries
    .filter((item) => item.kind === "essay")
    .slice(0, 2)) {
    preview.append(
      node("a", { class: "essay-preview", href: entryHref(entry) }, [
        node("span", {}, [
          node("strong", { text: entry.title }),
          node("small", {
            text: `${shortDate(entry.date)} · ${isDemo(entry) ? "示例文章" : entry.category}`,
          }),
        ]),
        node("span", { text: "→", "aria-hidden": "true" }),
      ]),
    );
  }
  aside.append(preview);
  return aside;
}

function journal() {
  document.title = "学习流水 · Flow 浮流";
  const root = node("div", { class: "page-enter" }, [hero()]);
  const grid = node("div", { class: "home-grid" });
  const main = node("section", { "aria-labelledby": "journal-heading" });
  const writeButton = node("button", {
    class: "outline-button write-trigger",
    type: "button",
    text: "写一条 ↗",
  });
  main.append(
    node("div", { class: "section-top" }, [
      node("div", {}, [
        node("h2", {
          id: "journal-heading",
          class: "section-title",
          text: "学习流水",
        }),
        node("p", {
          class: "section-subtitle",
          text: "日复一日，慢慢有迹可循。",
        }),
      ]),
      writeButton,
    ]),
  );
  if (storageError) main.append(storageAlert());
  const filters = node("div", {
    class: "filters",
    role: "group",
    "aria-label": "按分类筛选学习记录",
  });
  for (const category of categories) {
    const button = node("button", {
      class: "filter-button",
      type: "button",
      text: category,
      "aria-pressed": String(filter === category),
    });
    button.addEventListener("click", () => {
      filter = category;
      render();
    });
    filters.append(button);
  }
  main.append(filters);
  const entries = allEntries();
  const visible = entries.filter(
    (entry) =>
      entry.kind === "log" &&
      (filter === "全部" ||
        entry.category === filter ||
        entry.tags.includes(filter)),
  );
  const list = node("div", { class: "timeline" });
  if (visible.length)
    for (const entry of visible) list.append(timelineRow(entry));
  else
    list.append(
      emptyState(
        "这里暂时没有记录",
        `“${filter}”分类中还没有学习流水。`,
        "查看全部",
        () => {
          filter = "全部";
          render();
        },
      ),
    );
  main.append(list);
  main.append(
    node("p", {
      class: "sample-note",
      text: "标有“示例”的内容仅用于展示。自己写的记录保存在当前浏览器中。",
    }),
  );
  grid.append(main, sidebar(entries));
  root.append(grid);
  return root;
}

function pageIntro(kicker, title, subtitle) {
  return node("header", { class: "page-intro" }, [
    node("p", { class: "eyebrow", text: kicker }),
    node("h1", { text: title }),
    node("p", { text: subtitle }),
  ]);
}

function essays() {
  document.title = "感悟文章 · Flow 浮流";
  const root = node("div", { class: "page-enter" }, [
    pageIntro(
      "REFLECTIONS",
      "偶尔，写得长一点。",
      "那些没有标准答案的想法，值得给它们一些时间。",
    ),
  ]);
  root.append(
    node("div", { class: "essay-actions" }, [
      node("button", {
        class: "outline-button write-trigger",
        type: "button",
        text: "写一篇 ↗",
      }),
    ]),
  );
  if (storageError) root.append(storageAlert());
  const list = node("section", {
    class: "essay-index",
    "aria-label": "感悟文章列表",
  });
  const entries = allEntries().filter((entry) => entry.kind === "essay");
  for (const entry of entries) {
    list.append(
      node("article", { class: "essay-index-row" }, [
        node("div", { class: "essay-index-date", text: shortDate(entry.date) }),
        node("div", {}, [
          node("h2", {}, [
            node("a", { href: entryHref(entry), text: entry.title }),
          ]),
          tagsFor(entry),
          node("p", { class: "excerpt", text: excerpt(entry) }),
          node("a", {
            class: "read-link",
            href: entryHref(entry),
            text: "阅读全文 ↗",
          }),
        ]),
        node("span", {
          class: "essay-arrow",
          text: "→",
          "aria-hidden": "true",
        }),
      ]),
    );
  }
  root.append(list);
  return root;
}

function reader(entry) {
  document.title = `${entry.title} · Flow 浮流`;
  const kindName = entry.kind === "log" ? "学习流水" : "感悟文章";
  const back = entry.kind === "log" ? "#/journal" : "#/essays";
  const article = node("article", { class: "reader page-enter" });
  article.append(
    node("a", { class: "back-link", href: back, text: `← 返回${kindName}` }),
  );
  article.append(
    node("header", { class: "article-header" }, [
      node("p", {
        class: "eyebrow",
        text: entry.kind === "log" ? "LEARNING JOURNAL" : "REFLECTIONS",
      }),
      node("h1", { text: entry.title }),
      node("div", { class: "article-meta" }, [
        node("span", { text: shortDate(entry.date) }),
        node("span", { text: kindName }),
        ...(isDemo(entry) ? [node("span", { text: "示例内容" })] : []),
      ]),
      tagsFor(entry),
    ]),
  );
  const body = node("div", { class: "prose" });
  for (const paragraph of entry.body.trim().split(/\n\s*\n/))
    body.append(node("p", { text: paragraph }));
  article.append(body);
  article.append(
    node("div", { class: "reader-footer" }, [
      node("a", { class: "back-link", href: back, text: `← 回到${kindName}` }),
    ]),
  );
  return article;
}

function about() {
  document.title = "关于 · Flow 浮流";
  const root = node("div", { class: "page-enter" }, [
    pageIntro(
      "ABOUT FLOW",
      "给思考留一处地方。",
      "每天积累一点知识，偶尔把想法写得长一点。",
    ),
  ]);
  if (storageError) root.append(storageAlert());
  const writeButton = node("button", {
    class: "outline-button write-trigger",
    type: "button",
    text: "写下新记录 ↗",
  });
  const exportButton = node("button", {
    class: "outline-button export-trigger",
    type: "button",
    text: "导出我的记录 ↗",
  });
  root.append(
    node("div", { class: "about-content" }, [
      node("section", {}, [
        node("h2", { text: "两种记录的节奏" }),
        node("p", {
          text: "“学习流水”收下每天弄懂的一件事；“感悟文章”留给需要更长篇幅的思考。页面中的示例仅展示这个空间可以如何使用，不代表真实个人经历。",
        }),
        writeButton,
      ]),
      node("section", {}, [
        node("h2", { text: "关于保存" }),
        node("p", {
          text: "你写下的内容只存在当前浏览器的本地存储中。这里没有账户、跨设备同步或公开发布。清除浏览器站点数据、使用无痕窗口或更换设备，都可能让记录无法找回。",
        }),
        node("p", {
          text: "可以随时导出 JSON 文件备份。导出只包含你自己保存的记录，不包含页面示例。当前版本尚不支持导入备份。",
        }),
        exportButton,
      ]),
    ]),
  );
  return root;
}

function route() {
  const hash = location.hash || "#/journal";
  if (hash === "#/journal") return { name: "journal" };
  if (hash === "#/essays") return { name: "essays" };
  if (hash === "#/about") return { name: "about" };
  if (hash.startsWith("#/entry/")) {
    try {
      return { name: "entry", id: decodeURIComponent(hash.slice(8)) };
    } catch {
      return { name: "missing" };
    }
  }
  return { name: "missing" };
}

function render() {
  const current = route();
  const nav =
    current.name === "entry"
      ? allEntries().find((entry) => entry.id === current.id)?.kind === "essay"
        ? "essays"
        : "journal"
      : current.name;
  for (const link of document.querySelectorAll("[data-nav]")) {
    if (link.dataset.nav === nav) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  app.replaceChildren();
  if (current.name === "journal") app.append(journal());
  else if (current.name === "essays") app.append(essays());
  else if (current.name === "about") app.append(about());
  else if (current.name === "entry") {
    const entry = allEntries().find((item) => item.id === current.id);
    if (entry) app.append(reader(entry));
    else app.append(notFound());
  } else app.append(notFound());
  for (const button of app.querySelectorAll(".write-trigger"))
    button.addEventListener("click", openWriter);
  for (const button of app.querySelectorAll(".export-trigger"))
    button.addEventListener("click", exportEntries);
}

function notFound() {
  document.title = "找不到记录 · Flow 浮流";
  return node("div", { class: "reader" }, [
    emptyState(
      "没有找到这段记录",
      "它可能不在当前浏览器里，或者链接已失效。",
      "返回学习流水",
      () => {
        location.hash = "#/journal";
      },
    ),
  ]);
}

function navigate() {
  render();
  window.scrollTo(0, 0);
  requestAnimationFrame(() => {
    const heading = app.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      heading.focus({ preventScroll: true });
    }
  });
}

function search() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  searchResults.replaceChildren();
  if (!query) {
    searchResults.append(
      node("p", {
        class: "empty-state",
        text: "输入关键词，寻找之前留下的片段。",
      }),
    );
    return;
  }
  const matches = allEntries().filter((entry) =>
    [entry.title, entry.body, entry.category, ...entry.tags].some((value) =>
      value.toLocaleLowerCase().includes(query),
    ),
  );
  if (!matches.length) {
    searchResults.append(
      emptyState(
        "没有找到相关记录",
        "换一个词试试，或清空搜索重新开始。",
        "清空搜索",
        () => {
          searchInput.value = "";
          searchInput.focus();
          search();
        },
      ),
    );
    return;
  }
  searchResults.append(
    node("p", { class: "search-hint", text: `找到 ${matches.length} 条记录` }),
  );
  for (const entry of matches) {
    const link = node("a", { class: "search-result", href: entryHref(entry) }, [
      node("strong", { text: entry.title }),
      node("small", {
        text: `${shortDate(entry.date)} · ${entry.kind === "log" ? "学习流水" : "感悟文章"}${isDemo(entry) ? " · 示例" : ""}`,
      }),
    ]);
    link.addEventListener("click", () => searchDialog.close());
    searchResults.append(link);
  }
}

function openWriter() {
  formMessage.textContent = "";
  const hasDraft = ["title", "tags", "body"].some((field) =>
    form.elements[field].value.trim(),
  );
  if (!hasDraft)
    form.elements.kind.value = route().name === "essays" ? "essay" : "log";
  if (!form.elements.date.value) form.elements.date.value = currentLocalDate();
  writeDialog.showModal();
  form.elements.title.focus();
}

function saveEntry(event) {
  event.preventDefault();
  formMessage.textContent = "";
  if (storageError) {
    formMessage.textContent = storageError;
    return;
  }
  const data = new FormData(form);
  const tags = String(data.get("tags") ?? "")
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
  const entry = {
    id: `local-${crypto.randomUUID()}`,
    kind: String(data.get("kind") ?? ""),
    title: String(data.get("title") ?? "").trim(),
    date: String(data.get("date") ?? ""),
    category: String(data.get("category") ?? ""),
    tags: [...new Set(tags)],
    body: String(data.get("body") ?? "").trim(),
    updatedAt: new Date().toISOString(),
  };
  if (!validEntry(entry)) {
    formMessage.textContent =
      "请检查标题、有效日期和正文。标签最多 8 个，每个不超过 24 字。";
    return;
  }
  const latest = loadEntries();
  if (storageError) {
    formMessage.textContent = storageError;
    return;
  }
  const next = [entry, ...latest];
  try {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, entries: next }),
    );
  } catch {
    formMessage.textContent =
      "保存失败。当前浏览器可能禁用了本地存储或空间已满。内容仍留在表单中，可复制后重试。";
    return;
  }
  userEntries = next;
  form.reset();
  writeDialog.close();
  announce("已保存到当前浏览器。建议定期导出备份。");
  location.hash = entryHref(entry);
}

function exportEntries() {
  if (storageError) {
    announce("本地记录无法读取，暂时不能生成可靠的备份。");
    return;
  }
  const snapshot = { version: 1, entries: userEntries };
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = node("a", {
    href: url,
    download: `flow-records-${currentLocalDate()}.json`,
  });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  announce(
    userEntries.length
      ? `已导出 ${userEntries.length} 条自己的记录。`
      : "已导出空备份；示例内容不会包含在文件中。",
  );
}

document.querySelector(".search-trigger").addEventListener("click", () => {
  searchDialog.showModal();
  searchInput.focus();
  search();
});
document
  .querySelectorAll(".dialog-close")
  .forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()),
  );
document
  .querySelector(".cancel-write")
  .addEventListener("click", () => writeDialog.close());
document
  .querySelector(".site-footer .export-trigger")
  .addEventListener("click", exportEntries);
searchInput.addEventListener("input", search);
form.addEventListener("submit", saveEntry);
window.addEventListener("hashchange", navigate);
window.addEventListener("storage", (event) => {
  if (event.key !== storageKey) return;
  userEntries = loadEntries();
  render();
  announce(
    storageError
      ? "另一个标签页修改了本地记录，但数据无法读取。"
      : "本地记录已在另一个标签页更新。",
  );
});
render();
