# Design A: a small field notebook

## Usage first
The reader lands on a calm Chinese notebook cover with today's date, a short introduction, and two clear entrances: `每日学习` and `随笔`. Logs answer “what did I learn today?” in a compact dated timeline. Essays invite slower reading in a separate index and focused article view. `写一篇` opens an editor with kind selection; save gives visible local confirmation, export downloads the whole collection.

## Chosen structure
Three static files: `index.html` owns semantic landmarks and templates; `style.css` owns tokens, responsive layout, print and reduced-motion rules; `app.js` owns a single entry registry, hash navigation, rendering, filtering, persistence, import/export. No build step, dependencies, framework, remote font, or service. Keep a small `SEED_ENTRIES` array in `app.js` for first visit and examples; local additions live in browser storage.

Visual direction: warm paper ground, charcoal ink, one muted vermilion accent, hairline rules, a narrow serif display face with system Chinese fallbacks, generous reading measure. A small vertical date rail and subtle page markers give it a tactile field-notebook identity. Motion is limited to a brief page reveal and button feedback, disabled under `prefers-reduced-motion`. Logs use dense modular cards; essays use spacious titles and continuous text.

## Data and contracts
```js
// One collection, explicit variants. Dates are local YYYY-MM-DD strings.
Entry = {
  id: string, kind: 'log' | 'essay', title: string,
  date: string, tags: string[], body: string,
  updatedAt: string // ISO timestamp; useful for editing/export ordering
};
Store = { version: 1, entries: Entry[] };
View = { page: 'home' | 'logs' | 'essays' | 'entry' | 'editor', id?: string };
Filter = { query: string, tag: string | null };
```
`kind` determines presentation and the appropriate collection; no parallel log/essay arrays to reconcile. IDs are opaque and stable (`crypto.randomUUID` with a small fallback); editing replaces by ID, saving a new entry adds once. Validate imported records and storage reads at the boundary: valid kind, nonempty bounded title/body, valid date, bounded tags, unique IDs, supported version. Reject bad imports with a clear message and preserve current data. UI-internal entries are then trusted.

## Navigation and state
Use `#/`, `#/logs`, `#/essays`, `#/entry/<id>`, `#/write` and `#/edit/<id>`; one `parseRoute()` and one `render(view)` dispatch. A missing entry shows a friendly return link. Log and essay lists search title/body/tags, with a tag chip filter and count/empty state; avoid a second filter state machine. Search input state stays in memory while moving between list and detail during the session. The article URL is shareable as a shape, though locally authored entries exist only in that browser.

## Authoring and portability
`localStorage` key `field-notebook:v1` holds only user entries and edits, merged over seeds by ID. Save explicitly from a labeled form after validation; draft fields autosave to a separate key while typing and restore on return, then clear on successful save. Native `date` input defaults to local today; kind defaults to log, remains editable. Confirm before deleting an entry. Export a versioned JSON file with both seed and user entries. Import validates fully, previews incoming count and duplicate-ID replacement count, then applies on confirmation. Label the UI honestly: “仅保存在此浏览器”; export is the portability path. `localStorage` failure surfaces an error and does not claim a save.

## Alternative considered
Separate `logs` and `essays` stores with a dedicated page for each would make the two surfaces easy to style, but doubles editing, search, import, and ID rules. A single discriminated registry keeps those rules in one place while `kind` still preserves the reader's mental separation. A full Markdown parser would add rendering and injection risk without serving the first version's core loop; body is plain text and rendered as paragraphs via `textContent`.

## Minimal checks
Open directly as a static file, switch all routes with keyboard, create/edit/delete each kind, reload to confirm persistence, export/import and inspect duplicate handling, search and clear filters, resize to mobile, and test storage unavailable. Check headings, landmarks, focus visibility, labels, empty states, reduced motion, and that typed HTML displays literally rather than executing.
