# Flow verification

Date: 2026-10-22, Asia/Shanghai. Local first version. No deployment.

## Result and environment

The built-in browser was available through CUA/IAB. No Playwright fallback or browser dependency installation was needed. The primary preview is http://127.0.0.1:4173. Synthetic authoring tests used the separate origin http://localhost:4173, so the delivered preview has no test records.

The generated reference is `design/concept.png`. The implementation screenshots are `design/preview-desktop.png`, `design/preview-mobile.png`, and `design/preview-essays.png`. Screenshots came from the built-in browser screenshot API. Both the reference and the latest implementation screenshots were opened with `view_image` in the same QA pass. Desktop testing used the reference's 1402 by 1122 viewport. Responsive testing covered 390 by 844 and 320 by 800, plus the initial 426px browser viewport.

## Checks and observed evidence

| Check | Result | Evidence |
| --- | --- | --- |
| Identity and meaningful render | Pass | Correct Flow title, hero, timeline, calendar, essay links in browser DOM. |
| Framework overlay | Pass | Buildless site renders real content, no overlay. |
| Console | Pass | Final IAB error and warning query returned an empty array. |
| Categories | Pass | Selecting 开发 displays the matching log. Enter retains focus on the selected replacement button with aria-pressed true. |
| Separate article area | Pass | 感悟文章 opens its own index; entry opens four complete paragraphs; Browser Back returns to the index. |
| Search | Pass | Unmatched term produces a resettable empty state. RAG returns one entry and opens its complete three-paragraph body. |
| Authoring | Pass | Essays default to essay, journal to log. Empty submit gives validation feedback. Both kinds save and open their reader. |
| Persistence | Pass | Reload retains both authored kinds and their full body text. |
| Text safety | Pass | HTML-like title and script-like body appear literally. Reader contains zero injected script or em elements. |
| Backup | Pass | Actual downloaded JSON parsed as version 1, two user records of kinds log and essay, zero demo records. Synthetic download was removed after inspection. |
| Keyboard skip | Pass | Activation keeps #/journal and focuses main with id app. |
| Narrow layout | Pass | At 320px and 390px, document width stays within viewport. A 90-character ASCII title wraps inside the reader. |
| Static resources | Pass | npm run smoke loads HTML, CSS, JS, data, and PNG with correct MIME and nonempty bodies. Missing resources, write methods, and outside-directory paths are rejected. |
| Syntax | Pass | npm run check. |
| Independent review | Pass | Three reported defects fixed and independently rechecked at ba0cc0d. No residual actionable issues in the recheck. |

## Fidelity ledger

| Point | Reference | Implementation and judgment |
| --- | --- | --- |
| Palette | Light paper, charcoal, moss, tiny terracotta accent | Same locked tokens, no added color overlay on ribbon. |
| Typography | Chinese serif headings, quiet body text, monospaced dates | Same family roles with local system fallback. Exact generated glyph metrics are approximate, because raster concept text is not a font specification. |
| Composition | Open editorial layout, date rail left, calendar and essays right | Same hierarchy and column relationship. On mobile the sidebar continues after timeline. |
| Art | Matte looping green ribbon with circle and one dot | Matching standalone asset generated from reference. Duplicate CSS dot removed. |
| Structure | Header, two-line hero, timeline, sidebar, footer | Preserved. No generic card grid or extra marketing sections. |
| Copy | Same brand, hero, section headings, navigation and three log titles | Above-fold copy reviewed against spec. Full demo bodies produce different excerpts. Sample labels are intentional disclosure. |
| Calendar | Concept has decorative activity blocks | Deliberately replaced with an actual dated calendar driven by records. Only 20, 21, 22 are active for the three sample logs. |
| Footer | Quiet sign-off and copyright | Added a working export control. Sample/storage disclosure adds vertical height below timeline. |
| Motion | Subtle liveliness requested by user | Gentle ribbon float and short page appearance. Reduced motion is implemented in CSS. |

The implementation faithfully follows the selected visual direction with the intentional functional and disclosure changes listed above. It is not a pixel-identical copy of generated text metrics. No known clipping, broken primary interaction, missing asset, or unresolved material layout mismatch remains in the checked viewports.

## Limits

Storage denial, quota exhaustion, corrupted existing data, multiple-tab race handling, and reduced-motion emulation were inspected in source but not forced in the browser. Other browsers and a physical phone were not tested. There is no account, server database, import, edit, deletion, cross-device sync, or public publishing in this version. Existing saved entries therefore have no in-site correction flow yet. The local server must remain running for this preview.

## Workflow checkpoint

The empty workspace and visual spec were the blocking steps. Architecture proposals were independent read-only artifacts. One implementation owner used an isolated worktree, then the parent integrated and verified it. This kept shared source writes sequential. The implementation and the keyboard/wrapping fixes are separate commits. The design review was not contested. No PR was opened because no remote was provided.

The no-comments review found no comments or suppressions. Deletions, restores, reruns, reshape flags, and open comment constraints were zero.
