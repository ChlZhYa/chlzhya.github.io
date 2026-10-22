import { seedEntries } from "./data.js";
import {
  categoryGroup,
  flowCategories,
  monthDays,
  readingBody,
  selectFlow,
  shiftMonth,
} from "./flow-model.js";
import {
  createEntry,
  parseSnapshot,
  parseWriterSession,
  updateEntry,
} from "./entry-model.js";

const storageKey = "flow-journal-v1";
const draftKey = "flow-writer-draft-v1";
const writeLock = "flow-journal-v1-write";
const app = document.querySelector("#app");
const status = document.querySelector("#site-status");
const searchDialog = document.querySelector("#search-dialog");
const writeDialog = document.querySelector("#write-dialog");
const searchInput = document.querySelector("#search-input");
const searchResults = document.querySelector("#search-results");
const form = document.querySelector("#entry-form");
const formMessage = document.querySelector("#form-message");
const saveAsNewButton = document.querySelector("#save-as-new");
const discardDraftButton = document.querySelector("#discard-draft");
const flowState = {
  month: currentLocalDate().slice(0, 7),
  selectedDate: null,
  category: "全部",
  visibleCount: 24,
  allTime: false,
};
let userEntries = [];
let storageError = "";
let statusTimer;
let writerSession = null;
let draftProblem = "";
let draftIssue = "";
let saving = false;

function node(tag, attributes = {}, children = []) {
  const element = ["svg", "path", "circle"].includes(tag)
    ? document.createElementNS("http://www.w3.org/2000/svg", tag)
    : document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (name === "class") element.setAttribute("class", value);
    else if (name === "text") element.textContent = value;
    else if (name === "dataset") Object.assign(element.dataset, value);
    else element.setAttribute(name, value);
  }
  for (const child of children) element.append(child);
  return element;
}

function loadEntries() {
  try {
    const snapshot = parseSnapshot(localStorage.getItem(storageKey));
    storageError = "";
    return snapshot.entries;
  } catch {
    storageError =
      "当前浏览器中的记录无法读取。为避免覆盖原数据，暂时无法保存新记录。请先检查浏览器站点数据。";
    return [];
  }
}

userEntries = loadEntries();
let storedDraft;
try {
  storedDraft = sessionStorage.getItem(draftKey);
} catch {
  draftIssue = "unavailable";
  draftProblem = "浏览器拒绝访问此标签页的草稿存储。表单在页面打开期间可继续填写并保存记录，但刷新后无法恢复草稿。";
}
if (!draftIssue) {
  try {
    writerSession = parseWriterSession(storedDraft);
  } catch {
    draftIssue = "corrupt";
    draftProblem = "此标签页的草稿无法读取。原草稿未被覆盖；可先检查站点数据，或明确舍弃它后重新开始。";
  }
}

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
function currentLocalDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function excerpt(entry) {
  return readingBody(entry).replace(/\s+/g, " ").slice(0, 138);
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

function updateFlow(focusSelector, message) {
  render();
  if (focusSelector)
    app.querySelector(focusSelector)?.focus({ preventScroll: true });
  if (message) announce(message);
}

function ringCalendar(activity) {
  const [year, month] = flowState.month.split("-").map(Number);
  const ring = node("section", {
    class: "ring-calendar",
    "aria-label": year + "年" + month + "月 Flow 日历",
  });
  const days = monthDays(flowState.month);
  for (let day = 1; day <= days; day++) {
    const date = flowState.month + "-" + String(day).padStart(2, "0");
    const count = activity.get(date) ?? 0;
    const angle = ((day - 1) / days) * Math.PI * 2 - Math.PI / 2;
    const button = node("button", {
      class:
        "ring-day" +
        (count ? " active" : "") +
        (date === currentLocalDate() ? " today" : "") +
        (date === flowState.selectedDate ? " selected" : ""),
      type: "button",
      text: String(day),
      "data-day": date,
      "aria-label":
        date +
        "，" +
        count +
        "条 Flow" +
        (date === currentLocalDate() ? "，今天" : ""),
      "aria-pressed": String(date === flowState.selectedDate),
      style:
        "--x:" +
        (50 + Math.cos(angle) * 44).toFixed(3) +
        "%;--y:" +
        (50 + Math.sin(angle) * 44).toFixed(3) +
        "%",
    });
    button.addEventListener("click", () => {
      flowState.selectedDate = flowState.selectedDate === date ? null : date;
      flowState.allTime = false;
      flowState.visibleCount = 24;
      updateFlow(
        '[data-day="' + date + '"]',
        flowState.selectedDate ? "已筛选 " + date + "。" : "已显示整个月。",
      );
    });
    ring.append(button);
  }
  const center = node("div", { class: "ring-center" }, [
    node("span", { class: "ring-month", text: month + " 月" }),
    node("span", { class: "ring-year", text: String(year) }),
  ]);
  for (const [offset, label] of [
    [-1, "上个月"],
    [1, "下个月"],
  ]) {
    const button = node("button", {
      class: "ring-arrow " + (offset < 0 ? "previous" : "next"),
      type: "button",
      text: offset < 0 ? "‹" : "›",
      "aria-label": label,
      "data-month-arrow": String(offset),
    });
    button.addEventListener("click", () => {
      flowState.month = shiftMonth(flowState.month, offset);
      flowState.selectedDate = null;
      flowState.allTime = false;
      flowState.visibleCount = 24;
      updateFlow(
        '[data-month-arrow="' + offset + '"]',
        "已切换到 " + flowState.month + "。",
      );
    });
    center.append(button);
  }
  ring.append(center);
  return ring;
}

function thoughtCard(entry, index) {
  return node("article", { class: "thought-card card-" + (index + 1) }, [
    node("div", { class: "thought-meta" }, [
      node("span", { class: "thought-dot", "aria-hidden": "true" }),
      node("time", { datetime: entry.date, text: shortDate(entry.date) }),
      ...(isDemo(entry)
        ? [node("span", { class: "demo-mark", text: "示例" })]
        : []),
    ]),
    node("h2", {}, [node("a", { href: entryHref(entry), text: entry.title })]),
    ...(excerpt(entry)
      ? [node("p", { class: "thought-preview", text: excerpt(entry) })]
      : []),
    node("span", {
      class: "category-pill " + categoryGroup(entry.category),
      text: categoryGroup(entry.category),
    }),
  ]);
}

function flowRow(entry) {
  return node("article", { class: "flow-row" }, [
    node("div", { class: "flow-row-meta" }, [
      node("span", { class: "thought-dot", "aria-hidden": "true" }),
      node("time", { datetime: entry.date, text: shortDate(entry.date) }),
      ...(isDemo(entry) ? [node("span", { text: "示例" })] : []),
    ]),
    node("h3", {}, [node("a", { href: entryHref(entry), text: entry.title })]),
    node("p", { text: excerpt(entry) }),
    node("span", {
      class: "category-pill " + categoryGroup(entry.category),
      text: categoryGroup(entry.category),
    }),
  ]);
}

function articleBand(entries) {
  const band = node(
    "section",
    { class: "article-band", "aria-labelledby": "article-band-title" },
    [
      node("div", { class: "article-band-head" }, [
        node("div", {}, [
          node("h2", { id: "article-band-title", text: "文章" }),
        ]),
        node("a", {
          href: "#/essays",
          class: "text-link",
          text: "查看全部 ↗",
        }),
      ]),
    ],
  );
  const list = node("div", { class: "article-band-list" });
  for (const entry of entries
    .filter((item) => item.kind === "essay")
    .slice(0, 2)) {
    list.append(
      node("a", { class: "article-preview", href: entryHref(entry) }, [
        node("time", { datetime: entry.date, text: shortDate(entry.date) }),
        node("strong", { text: entry.title }),
        node("span", { text: excerpt(entry) }),
        ...(isDemo(entry) ? [node("small", { text: "示例文章" })] : []),
      ]),
    );
  }
  band.append(list);
  return band;
}

function journal() {
  document.title = "Flow · 浮流";
  const entries = allEntries();
  const selected = selectFlow(entries, flowState);
  const root = node("div", { class: "flow-page page-enter" });
  if (storageError) root.append(storageAlert());
  const scene = node("section", {
    class: "canvas-scene",
    "aria-labelledby": "flow-title",
  });
  scene.append(
    node("div", { class: "canvas-intro" }, [
      node("div", {
        class: "outline-flow",
        text: "flow",
        "aria-hidden": "true",
      }),
      node("h1", { id: "flow-title", text: "念头流过，就留在这里。" }),
      node("p", { text: "小想法、偶然发现，还有那些突然想通的瞬间。" }),
    ]),
    ringCalendar(selected.activity),
    node("p", {
      class: "canvas-scribble",
      "aria-hidden": "true",
      text: "Some little thoughts,\nmake a brighter day.",
    }),
  );
  const controls = node("div", { class: "flow-controls" });
  const filters = node("div", {
    class: "filters",
    role: "group",
    "aria-label": "按分类筛选 Flow",
  });
  for (const category of flowCategories) {
    const button = node("button", {
      class: "filter-button",
      type: "button",
      text: category,
      "aria-pressed": String(flowState.category === category),
      "data-category": category,
    });
    button.addEventListener("click", () => {
      flowState.category = category;
      flowState.visibleCount = 24;
      updateFlow(
        '[data-category="' + category + '"]',
        "已筛选" +
          category +
          "，共 " +
          selectFlow(allEntries(), flowState).total +
          " 条。",
      );
    });
    filters.append(button);
  }
  controls.append(filters);
  const scope = node("div", { class: "date-scope" }, [
    node("span", {
      text: flowState.allTime
        ? "全部日期"
        : flowState.selectedDate
          ? shortDate(flowState.selectedDate)
          : flowState.month.replace("-", " 年 ") + " 月",
    }),
  ]);
  const scopeButton = node("button", {
    class: "scope-button",
    type: "button",
    text: flowState.allTime ? "回到本月 ↗" : "全部日期 ↗",
    "data-scope": "true",
  });
  scopeButton.addEventListener("click", () => {
    flowState.allTime = !flowState.allTime;
    flowState.selectedDate = null;
    flowState.month = currentLocalDate().slice(0, 7);
    flowState.visibleCount = 24;
    updateFlow(
      "[data-scope]",
      flowState.allTime ? "已显示全部日期。" : "已回到本月。",
    );
  });
  scope.append(scopeButton);
  controls.append(scope);
  const stage = node("div", { class: "thought-stage" });
  stage.append(
    node(
      "svg",
      {
        class: "connector",
        viewBox: "0 0 1200 410",
        preserveAspectRatio: "none",
        "aria-hidden": "true",
        focusable: "false",
      },
      [
        node("path", {
          d: "M 94 120 C 155 290, 310 8, 495 177 S 830 369, 1050 165",
        }),
        node("circle", { cx: "495", cy: "177", r: "6" }),
        node("circle", { cx: "1050", cy: "165", r: "6" }),
      ],
    ),
  );
  for (const [index, entry] of selected.featured.entries())
    stage.append(thoughtCard(entry, index));
  if (!selected.total)
    stage.append(
      emptyState(
        "这里还没有留下念头",
        flowState.selectedDate
          ? `这一天在「${flowState.category}」分类下还没有 Flow。可以换个分类或查看全部日期。`
          : "当前范围没有 Flow，试试其他月份或全部日期。",
        "查看全部日期",
        () => {
          flowState.allTime = true;
          flowState.selectedDate = null;
          flowState.category = "全部";
          updateFlow("[data-scope]", "已显示全部日期。");
        },
      ),
    );
  scene.append(controls, stage);
  root.append(scene);
  if (selected.remaining.length) {
    const more = node(
      "section",
      { class: "more-thoughts", "aria-label": "更多 Flow" },
      [],
    );
    const list = node("div", { class: "flow-list" });
    for (const entry of selected.remaining) list.append(flowRow(entry));
    more.append(list);
    root.append(more);
  }
  if (selected.hasMore) {
    const button = node("button", {
      class: "outline-button load-more",
      type: "button",
      text: "继续看更多 ↗",
    });
    button.addEventListener("click", () => {
      flowState.visibleCount += 24;
      updateFlow(".load-more", "已显示更多 Flow。");
    });
    root.append(button);
  }
  root.append(
    node("p", {
      class: "sample-note",
      text: "标有“示例”的内容仅用于展示。自己写的记录保存在当前浏览器中。",
    }),
    articleBand(entries),
  );
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
  const kindName = entry.kind === "log" ? "Flow" : "文章";
  const back = entry.kind === "log" ? "#/flow" : "#/essays";
  const article = node("article", { class: "reader page-enter" });
  article.append(
    node("a", { class: "back-link", href: back, text: `← 返回${kindName}` }),
  );
  article.append(
    node("header", { class: "article-header" }, [
      node("p", {
        class: "eyebrow",
        text: entry.kind === "log" ? "FLOW MOMENT" : "REFLECTIONS",
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
  if (!isDemo(entry)) {
    const edit = node("button", {
      class: "outline-button reader-edit",
      type: "button",
      text: "修改这条记录 ↗",
    });
    edit.addEventListener("click", () => openEdit(entry));
    article.append(edit);
  }
  const body = node("div", { class: "prose" });
  const text = readingBody(entry);
  if (text)
    for (const paragraph of text.split(/\n\s*\n/))
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
          text: "“Flow”收下小想法、观察和突然想通的瞬间；“文章”留给需要更长篇幅的思考。页面中的示例仅展示这个空间可以如何使用，不代表真实个人经历。",
        }),
        writeButton,
      ]),
      node("section", {}, [
        node("h2", { text: "关于保存" }),
        node("p", {
          text: "已保存的记录留在当前浏览器。未完成的草稿只在这个标签页保留，刷新后可以继续；关闭标签页、清除站点数据或更换设备可能失去内容。这里没有账户、跨设备同步或公开发布。",
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
  const hash = location.hash || "#/flow";
  if (hash === "#/flow" || hash === "#/journal") return { name: "journal" };
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
      "返回 Flow",
      () => {
        location.hash = "#/flow";
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
        text: `${shortDate(entry.date)} · ${entry.kind === "log" ? "Flow" : "文章"}${isDemo(entry) ? " · 示例" : ""}`,
      }),
    ]);
    link.addEventListener("click", () => searchDialog.close());
    searchResults.append(link);
  }
}

const draftFields = ["kind", "title", "date", "category", "tags", "body"];

function readDraft() {
  return Object.fromEntries(draftFields.map((field) => [field, form.elements[field].value]));
}

function storeWriterSession() {
  if (!writerSession || draftIssue) return;
  try {
    sessionStorage.setItem(draftKey, JSON.stringify({ version: 1, session: writerSession }));
  } catch {
    draftIssue = "unavailable";
    draftProblem = "无法保留刷新后的草稿。请保持此页面打开，或先复制表单内容；正式记录仍可尝试保存。";
    formMessage.textContent = draftProblem;
  }
}

function persistDraft() {
  if (!writerSession) return;
  writerSession.draft = readDraft();
  writerSession.touched = true;
  storeWriterSession();
}

function showWriter(message = "") {
  for (const field of draftFields)
    form.elements[field].value = writerSession.draft[field];
  syncWriter();
  saveAsNewButton.hidden = true;
  discardDraftButton.hidden = !writerSession && !draftProblem;
  formMessage.textContent = draftProblem || message;
  if (!writeDialog.open) writeDialog.showModal();
  (form.elements.kind.value === "log" ? form.elements.body : form.elements.title).focus();
}

function openWriter() {
  if (!writerSession && draftIssue !== "corrupt") {
    writerSession = { mode: "create", touched: false, draft: {
      kind: route().name === "essays" ? "essay" : "log",
      title: "", date: currentLocalDate(), category: "灵感", tags: "", body: "",
    } };
  }
  if (writerSession?.mode === "create" && !writerSession.touched)
    writerSession.draft.kind = route().name === "essays" ? "essay" : "log";
  if (writerSession) showWriter();
  else {
    form.reset();
    syncWriter();
    discardDraftButton.hidden = false;
    formMessage.textContent = draftProblem;
    if (!writeDialog.open) writeDialog.showModal();
  }
}

function openEdit(entry) {
  if (writerSession?.mode === "create" && !writerSession.touched)
    writerSession = null;
  if (writerSession || draftIssue === "corrupt") {
    openWriter();
    if (!draftProblem && (writerSession.mode !== "edit" || writerSession.id !== entry.id))
      formMessage.textContent = "此标签页还有未完成的草稿。保存或舍弃后，再修改这条记录。";
    return;
  }
  writerSession = {
    mode: "edit", touched: false, id: entry.id, baseline: structuredClone(entry),
    draft: { kind: entry.kind, title: entry.title, date: entry.date,
      category: entry.category, tags: entry.tags.join("，"), body: entry.body },
  };
  storeWriterSession();
  showWriter();
}

function syncWriter() {
  const essay = form.elements.kind.value === "essay";
  form.elements.title.required = essay;
  form.elements.title.placeholder = essay
    ? "文章标题"
    : "选填，留空将用正文第一行";
  document.querySelector("#write-title").textContent = writerSession?.mode === "edit"
    ? (essay ? "修改文章" : "修改 Flow")
    : (essay ? "写一篇文章" : "记下一个念头");
  form.querySelector(".title-label .optional").textContent = essay
    ? "必填"
    : "选填";
  form.querySelector(".save-entry").firstChild.textContent =
    writerSession?.mode === "edit" ? "保存修改 " : "保存到此浏览器 ";
}

function saveError(error) {
  if (error?.code === "conflict") {
    saveAsNewButton.hidden = false;
    return "这条记录已在别处修改或不再存在。输入仍保留；可复制内容，或明确另存为新记录。";
  }
  saveAsNewButton.hidden = true;
  if (error?.code === "capacity") return "记录已达到 10,000 条，无法继续新增。请先导出备份。";
  if (error?.code === "duplicate") return "新记录编号发生冲突，请重试。";
  if (error?.code === "entry") return "请检查正文、日期和标题。文章需要标题；标签最多 8 个，每个不超过 24 字。";
  if (error?.code === "snapshot") {
    storageError = "当前浏览器中的记录无法读取。为避免覆盖原数据，暂时无法保存。请先检查浏览器站点数据。";
    return storageError;
  }
  return "保存失败。当前浏览器可能禁用了本地存储或空间已满。内容仍留在表单中，可复制后重试。";
}

async function saveEntry(event, asNew = false) {
  event.preventDefault();
  if (saving) return;
  formMessage.textContent = "";
  if (!writerSession || draftIssue === "corrupt") {
    formMessage.textContent = draftProblem || "请重新打开写作窗口。";
    return;
  }
  persistDraft();
  if (!navigator.locks?.request) {
    formMessage.textContent = [draftProblem, "当前浏览器不支持安全的多标签页写入。输入仍保留；请复制内容后在支持 Web Locks 的浏览器中保存。"].filter(Boolean).join(" ");
    return;
  }
  let result;
  const submit = form.querySelector(".save-entry");
  saving = true;
  submit.disabled = true;
  saveAsNewButton.disabled = true;
  try {
    await navigator.locks.request(writeLock, () => {
      const latest = parseSnapshot(localStorage.getItem(storageKey));
      const draft = readDraft();
      const timestamp = new Date().toISOString();
      result = writerSession.mode === "edit" && !asNew
        ? updateEntry(latest, draft, writerSession.id, writerSession.baseline, timestamp)
        : createEntry(latest, draft, `local-${crypto.randomUUID()}`, timestamp);
      localStorage.setItem(storageKey, JSON.stringify(result.snapshot));
    });
  } catch (error) {
    formMessage.textContent = [draftProblem, saveError(error)].filter(Boolean).join(" ");
    return;
  } finally {
    saving = false;
    submit.disabled = false;
    saveAsNewButton.disabled = false;
  }
  storageError = "";
  userEntries = result.snapshot.entries;
  let draftCleared = true;
  try {
    sessionStorage.removeItem(draftKey);
  } catch {
    draftCleared = false;
  }
  writerSession = null;
  if (draftCleared) {
    draftProblem = "";
    draftIssue = "";
  }
  form.reset();
  syncWriter();
  writeDialog.close();
  announce(draftCleared
    ? "已保存到当前浏览器。建议定期导出备份。"
    : "记录已保存，但无法清除旧草稿。刷新后若看到旧内容，请勿重复保存。");
  const href = entryHref(result.entry);
  if (location.hash === href) render();
  else location.hash = href;
}

function exportEntries() {
  let snapshot;
  try {
    snapshot = parseSnapshot(localStorage.getItem(storageKey));
    userEntries = snapshot.entries;
    storageError = "";
  } catch {
    announce("本地记录无法读取，暂时不能生成可靠的备份。");
    return;
  }
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
  .querySelector(".site-header .write-trigger")
  .addEventListener("click", openWriter);
form.addEventListener("input", persistDraft);
form.addEventListener("change", () => {
  syncWriter();
  persistDraft();
});
document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  app.focus();
  app.scrollIntoView({ behavior: "instant", block: "start" });
});
document
  .querySelectorAll(".dialog-close")
  .forEach((button) =>
    button.addEventListener("click", () => button.closest("dialog").close()),
  );
document
  .querySelector(".cancel-write")
  .addEventListener("click", () => writeDialog.close());
discardDraftButton.addEventListener("click", () => {
  if (draftIssue !== "unavailable") {
    try {
      sessionStorage.removeItem(draftKey);
    } catch {
      formMessage.textContent = "无法舍弃草稿。请先检查浏览器的站点存储权限。";
      return;
    }
  }
  writerSession = null;
  if (draftIssue !== "unavailable") {
    draftProblem = "";
    draftIssue = "";
  }
  form.reset();
  writeDialog.close();
  announce("已舍弃此标签页的草稿。");
});
saveAsNewButton.addEventListener("click", (event) => saveEntry(event, true));
document
  .querySelector(".site-footer .export-trigger")
  .addEventListener("click", exportEntries);
searchInput.addEventListener("input", search);
form.addEventListener("submit", saveEntry);
window.addEventListener("hashchange", navigate);
window.addEventListener("storage", (event) => {
  if (event.key !== storageKey && event.key !== null) return;
  userEntries = loadEntries();
  render();
  announce(
    storageError
      ? "另一个标签页修改了本地记录，但数据无法读取。"
      : "本地记录已在另一个标签页更新。",
  );
});
render();
if (writerSession) openWriter();
