# Flow v2 active design B

The user corrected an accidental selection and explicitly chose the SECOND image, concept-b.png, on 2026-10-23. This supersedes concept A and its implementation. User's unchanged palette choice is cool white plus blue-violet. The primary goal is a more lively original composition for little thoughts and aha moments, distinct from a standard blog. Name the short content section Flow. Long reflective articles remain separate.

## Visual contract

- Reference concept-b.png is the active user-selected spec. No glass asterisk hero, horizontal date dock, serif headings, paper grain, green ribbon, timeline rail or right blog sidebar.
- Colors: cool white #f6f7fb, white, ink #20212e, violet #6554e8, pale lilac #eeebff, a restrained pale lime #dfefb0 and blue tag accents. Modern Chinese sans, strong lowercase flow wordmark. Header is compact, left wordmark and Flow/文章/关于 navigation, right 记一笔 + action and quiet search.
- The first screen is an airy thought canvas. Its center-top has a very large outlined lowercase flow word, then the heading 念头流过，就留在这里。 and supporting sentence 小想法、偶然发现，还有那些突然想通的瞬间。
- A calendar formed by a complete ring of numbered date dots occupies the upper-right of the canvas. Center has actual month and year with previous/next arrows. Recorded days filled violet; today an outline, selected date another clear ring/filled treatment. Every day is accessible, no fabricated activity. Concept's incorrect today/date numbers must be corrected from the actual clock and date model.
- Around the center, real short thoughts appear as separate fragments: upper-left light-lilac note, central violet aha note, lower-left white note, lower-middle pale-lime note, lower-right white note. They have date and small category label, variable readable lengths, subtle corner shapes and restrained shadows. The DOM remains newest-first. A thin violet curving connector and small dots sit behind the fragments as pure decoration. Tiny handwritten side annotations can be code-native. Do not rotate text; a background shape may tilt slightly.
- Use grid areas/rows and natural content sizing for note positions. Never absolutely position variable user text over each other. It must remain usable with any number/length of records. Only geometric calendar day buttons and background paths may use absolute coordinates.
- First five matching records occupy the canvas exactly once; additional records continue in a quiet two-column field below. No repeated display of the same note in both scene and feed. Filtering/date selection changes the real notes. With fewer than five, do not add fake filler notes. Keep the introduction and calendar stable and show an explicit recoverable empty state when none match.
- Category controls 全部/灵感/学习/生活 belong near the intro or upper canvas edge, so they clearly filter the whole displayed set. This is a usability refinement to the reference's lower filter row. A small scope label and 全部日期/回到本月 controls expose date filtering.
- A separate shallow article band appears after thoughts. Keep actual existing two essay examples and text. Do not adopt the concept's invented stock photos, contact link, moon toggle, or new article titles. Text-only article previews are appropriate until actual covers exist. Footer with export remains quiet.
- All pages, native dialogs, reader, search, buttons, focus states and footer use this same modern visual system.

## Circular calendar implementation

A single square ring container uses aspect-ratio1, diameter approximately320px desktop and min(100%,320px) mobile. Place days clockwise using percentage circle coordinates with a radius near44% of the container. Day buttons have visible numbers and are at least24px, ideally28px desktop; responsive geometry must avoid overlaps even for31days at320px page width. Month/year/arrows sit inside the ring. Day labels include full date and actual record count for screen readers. Today is actual local date, distinct from selected day. Preserve focus after rerender and announce selection/month changes.

On mobile, put the intro first, then the circular calendar and notes in logical single-column reading order. Preserve the ring at ordinary390px phone width. At very narrow widths reduce ring/buttons while respecting24px target spacing or use a compact clearly related calendar fallback. No horizontal page overflow. At tablet widths reflow the canvas before it crowds the ring. Do not show a shrunken overlapping desktop collage.

Motion should make the fragments feel responsive: brief staggered entrance, a small hover lift/tilt of background, and subtle connector/dot motion. No endless moving text or scroll hijacking. Disable movement under prefers-reduced-motion. Pointer effects must not be required to read or navigate.

## Data, routes and writing

Keep key flow-journal-v1, snapshot version1, Entry {id,kind:'log'|'essay',title,date,category,tags,body,updatedAt} and all existing record fields/IDs unchanged on load/export. Show log as Flow. Canonical #/flow, with #/journal still rendering the same page. Existing entry/essay/about links stay valid. Old categories AI / Agent, 开发, 阅读 still validate and map to 学习 for filters. Add 灵感/学习 category values while retaining old values.

UI-only state is {month:'YYYY-MM', selectedDate:null|string, category:'全部'|'灵感'|'学习'|'生活', visibleCount:24}. Default scope is selected month. Month arrows clear day and reset pagination. Day click filters; clicking selected day clears it. 全部日期 explicitly enables all-time browse; 回到本月 resets month. Derive actual activity counts before paging. Categories/date intersection must have reversible zero-result feedback. Keep activated date/filter focus and announce changes.

Flow writing is body-first with optional title. Derive a bounded plain-text title from the first nonempty line if omitted. Essays still require title. Date/category/tag controls are secondary. Safe DOM text rendering, search across both kinds, native dialogs, saved data, cross-tab handling, explicit persistence failure and user-only export must survive. No cloud claims, backend, deletion or import scope.

## Architecture and implementation handoff

Original architecture A's domain/state logic remains suitable. The active visual structure is now B. The independently reviewed state/persistence invariants and body-first capture remain. One small flow-model.js may hold pure month/category/date selection rules with meaningful behavior tests. Do not create a generic canvas/editor framework or independent note stores.

The first implementation owner for concept A was explicitly interrupted and confirmed interrupted before starting B. Partial A work is isolated in R:/Coding/Flow-v2-implementation on codex/flow-moments, not merged into main. It has a useful provisional pure model but no finished UI. The fresh B owner should implement from the active spec in a new worktree. The main preview remains the old stable version until B is integrated.

## Validation

Compare actual first screen to concept-b.png at its native size. Verify outlined wordmark, spatial rhythm, ring calendar geometry, color, type, note treatment, connector and copy. Inspect desktop, tablet,390px and320px widths. Exercise all date/category controls, empty states, old route and existing local entries, body-only save, essay validation, search, export and keyboard. Use localhost for synthetic tests; deliver clean127.0.0.1 preview. Independent review required before handoff.
