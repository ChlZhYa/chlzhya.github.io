# Architecture B: feature-owned journal modules

## Product shape

A quiet Chinese learning journal with two equally visible doors: **学习记录** for a dated, short daily log and **思考随笔** for a longer argument or reflection. The home page shows today's prompt and recent items from both streams without merging their indexes. Labels in the demo say “示例内容” and never imply the entries belong to the visitor.

Use warm paper, ink, and one lively vermilion accent; give logs a compact ruled-card rhythm and essays a wider reading column with generous line spacing. A subtle paper grain can come from CSS gradients, with no image dependency. Keep controls and text contrast strong, and let the page breathe on a narrow screen.

## Module map

```text
index.html                 semantic shell, skip link, nav, live status region
styles.css                 tokens, responsive layout, focus and reduced-motion rules
js/main.js                 bootstrap, shared state, route dispatch, persistence wiring
js/router.js               parse/render hash routes; subscribe to hashchange
js/storage.js              versioned snapshot read/write, export/import helpers
js/logs.js                 log validation, list/detail/editor DOM and actions
js/essays.js               essay validation, list/detail/editor DOM and actions
js/ui.js                   DOM constructors, safe text, date formatting, focus helpers
```

This is feature separation around two different writing jobs, not a general plugin system. `main.js` owns the one application snapshot and passes a small context (`state`, `save`, `navigate`) to feature renderers. `logs.js` and `essays.js` own their forms and content rules; they do not reach into each other's DOM or storage. Keep `ui.js` limited to helpers used by both. Native ES modules need an HTTP origin, so run a static local server (for example `python -m http.server`); this is a static site with no server-side app, account, sync, or backend.

## Domain snapshot

```js
{
  schemaVersion: 1,
  logs: [{
    id: "log_<uuid>", date: "2026-10-22", title: "今天学了什么",
    body: "纯文本，换行保留", topics: ["RAG"],
    createdAt: "ISO-8601", updatedAt: "ISO-8601"
  }],
  essays: [{
    id: "essay_<uuid>", title: "一个问题的边界", body: "纯文本，换行保留",
    summary: "可选摘要", tags: ["复盘"], status: "draft" | "published",
    createdAt: "ISO-8601", updatedAt: "ISO-8601"
  }]
}
```

IDs are stable across edits; a log is unique per date (editing that date updates its record), while essays are independently created and may be drafts. Validate imported snapshots at the storage boundary: require schema version, arrays, unique non-empty IDs, valid dates/statuses, and bounded strings; reject invalid files with a readable error rather than partially applying them.

## Routes and interactions

Use ordinary anchors and hash routes: `#/` home, `#/logs`, `#/logs/:id`, `#/logs/new`, `#/essays`, `#/essays/:id`, `#/essays/new`, `#/archive`. The router parses a small explicit route table and falls back to home for an unknown path. Save a draft or entry, then navigate to its detail page; Cancel returns to its index. The archive offers separate date-sorted log and essay sections. Browser back/forward works through `hashchange`.

Every route has a visible page heading. After navigation, focus that heading (`tabindex="-1"`) and update `document.title`; provide a skip-to-content link, semantic `nav`/`main`, visible `:focus-visible`, and buttons/links usable by keyboard. Do not trap focus. Label every field, associate validation text with it, and announce save/error status through `aria-live="polite"`.

## Persistence and safety

Persist one JSON snapshot at `learning-journal:v1`. On startup, catch storage access and JSON parse errors; show an inline “本次仅保存在当前页面” warning and keep an in-memory snapshot if storage is blocked or malformed. On write/quota failure, retain the edited in-memory value, show “保存失败，请导出备份”, and mark the page unsaved until a later successful save. Never claim a durable save until `setItem` succeeds.

Export the full snapshot as UTF-8 JSON (`学习日志-YYYY-MM-DD.json`) via Blob download; import a validated JSON file only after explicit user selection and confirmation that it replaces the current local snapshot. Provide an export action in the archive. Render all authored/imported strings with `textContent` and text nodes; preserve line breaks with CSS `white-space: pre-wrap`. Do not insert user text as HTML or interpret Markdown/HTML. Revoke Blob object URLs after download.

## First-version boundary

Ship the local shell, two separate indexes, detail and editor routes, seeded examples labeled “示例内容”, date ordering, local persistence, and JSON backup/restore. No network calls, account, multi-device sync, search engine, rich-text parser, or claim of cloud backup. The split keeps each feature's edit/read flow understandable while one small storage boundary owns durability and recovery.
