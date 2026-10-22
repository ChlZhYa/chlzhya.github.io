# Flow canvas redesign verification

Completed 2026-10-23, Asia/Shanghai. The user corrected an accidental selection and chose concept B, the spatial thought canvas with circular calendar. A was stopped before integration, and its partial implementation is checkpointed separately.

## Visual reference and evidence

Active reference is `design/v2/concept-b.png`, generated with built-in ImageGen and selected by the user. Screenshots are `design/v2/preview-desktop.png`, `preview-viewport.png` and `preview-mobile.png`. CUA/IAB was available and used directly. No Playwright fallback or browser installation was needed. Both reference and latest screenshots were inspected with view_image in the same QA pass. Native1435x1096 reference size was checked. The viewport override was reset for handoff.

| Comparison | Result |
| --- | --- |
| Palette | Cool white #f6f7fb, violet #6554e8, lilac, small lime and blue accents replace paper/moss. |
| Composition | Large outlined flow, spatial fragments, thin connector, circular calendar. Old timeline/sidebar count0. |
| Type | Modern sans throughout, strong thought titles, quiet dates. Font metrics approximate generated raster text. |
| Fragments | Lilac/violet/lime/white surfaces with steady text and restrained hover lift. Natural rows handle long content. |
| Calendar | Complete real month clockwise, record-derived activity, actual today23October2026, separate selected state. |
| Motion | Brief entrance, hover feedback and positive-opacity breathing dots. Full line stays visible. Reduced motion disables animations. |
| Mobile | Intro, circular calendar, controls and single-column fragments reflow without shrinking the desktop collage. |

Intentional refinements are controls before affected notes, each Flow appearing once, actual calendar values, concise card previews opening full content, text-only existing essay previews, and local-storage disclosure/export. The concept's invented photos, contact link and moon toggle were not added. Main headline and subtitle match the selected spec; sample labels and explicit date scope are functional additions. Decorative annotations are simplified. The implementation follows the selected design direction faithfully with these refinements; it is not a pixel-identical reproduction of raster font metrics.

## Browser checks

| Check | Evidence |
| --- | --- |
| Identity and console | Correct Flow title and meaningful content, no overlay. Final error/warning query empty. |
| Original data | Before/after exported JSON deepEqual. Both old user records and every field unchanged. |
| Legacy route and keyboard | #/journal renders Flow; skip link keeps route and focuses app. |
| Date and category |21October selects one card, preserves date focus and aria-pressed. 学习 intersection gives recoverable empty state. |
| Months | Previous shows September with no Flow; next restores October. Empty-state and all-time controls recover results. |
| Body-only writing | Empty title derives bounded first-line title, opens reader and survives reload. |
| Essay writing | Empty title refused. Adding title saves and survives reload. |
| Text safety | HTML-like text remains literal;0injected em nodes. Duplicate exact first line omitted only in reader presentation, stored body untouched. |
| Search and export | Old essay searchable. Final actual backup has4user records,0demos, original2records unchanged. |
| Deduplication | Clean preview contains6Flow cards/rows and6unique entry links. |

Synthetic writing used localhost:4173. Delivered127.0.0.1is a separate origin with no synthetic additions. Temporary downloads and JSON comparison fixtures were removed after verification. The existing user preview tab was reloaded to new code; the redundant agent-created test tab was closed.

## Geometry

DOM rectangles were measured on a populated page with long legacy titles. Numbers are rounded to two decimals.

| Viewport width | Document width | Day target | Adjacent spacing | Overlapping note rectangles |
| --- | --- | --- | --- | --- |
|320|305|24|24.32|0|
|390|375|24|28.49|0|
|768|753|28|28.49|0|
|1100|1085|28|28.49|0|
|1200|1185|28|28.49|0|
|1435|1420|28|28.49|0|

Before repair,1100px had28px date targets at23.77px spacing. Earlier reflow preserves a320px ring and28.49px spacing. A90character ASCII title previously expanded a390px page to1516px; restored wrapping reduces document width to375px. Both failures were reproduced before repair.

## Checks and review

`npm run check`, `npm test`, `npm run smoke` pass. Four model tests cover month/year transitions and leap months, legacy categories, date/category intersection with activity before pagination, and body-derived title bounds. Smoke checks actual assets/model loads, missing files, HTTP methods and directory boundaries.

Independent review found three P2 defects: calendar target overlap, long-title overflow, and controls after filtered records. Repairs independently passed at9c73558. Final decorative opacity/reduced-motion change independently passed at577eab1. No-comments review found no comments, suppressions or reshape flags.

One implementation owner used an isolated worktree; integration, UI repairs and review followed sequentially. Selected spec, implementation and fixes are separate commits. No remote was supplied, so no PR or deployment was created. The local server continues on4173.

Storage denial/quota/corrupt-data recovery and reduced-motion emulation were inspected in source, not forcibly exercised. Other engines and physical phones were not tested. Browser-local scope remains; no account, cloud sync, import, edit/delete or publishing was added.
