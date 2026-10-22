# Flow v2 superseded design A

Superseded by the user's correction on 2026-10-23. The active design is concept B and spec.md. This file records the earlier brief only.

The user selected concept-a.png on 2026-10-22. They also explicitly selected cool white plus blue-violet, clear and modern with a little playful movement. This replaces the old paper/green/serif timeline plus sidebar. Concept B's scattered canvas and circular calendar were rejected by the user.

## Locked visual system

- Colors: cool white #f6f7fb canvas, white date dock, ink #20212e, muted #686b83, violet #6554e8, pale lilac #eeebff, small lime #dfefb0. No paper grain or green ribbon.
- Modern Chinese system sans. Wordmark lowercase flow, about 26px and weight700, a small violet spark mark. Hero headline about48px desktop, weight650. Note titles20px, text16px/1.7. UI14px, dates12px.
- Desktop maximum width1320px at1440 wide. Header compact72px. Intro about230px with a clear heading on left, lavender glass asterisk on right. The asterisk is a generated standalone transparent PNG with no tint overlay. A thin lime curve and handwritten caption are code-native decoration. No label above headline.
- Hero copy: 念头流过，就留在这里。 Supporting: 小想法、偶然发现，还有那些突然想通的瞬间。 Button: 记一笔 +. Navigation: Flow, 文章, 关于. Search icon at right.
- A full-width white low calendar dock sits immediately below intro. Left: month/year. Middle: every day of that month, shown as weekday initial, circular activity dot, day number. Right: previous/next month buttons. Active dots reflect actual record dates; today outlined. Selected date distinct from today. No fake activity counts. Dots must remain understandable as dates and usable by keyboard.
- Flow heading and small filters sit below calendar. Filters 全部, 灵感, 学习, 生活. Open three-column note field with staggered vertical spacing and varying note lengths. Most notes have no enclosing box. One restrained lilac highlighted aha note is permitted. No vertical track, giant date numerals, aside, equal-height card stack, or random absolute positioning of user text.
- Notes show tiny date+dot, thought title/body without duplicating the same text, soft category/tag labels, and a discreet arrow to the full reader. Actual new short demo records replace study-heavy examples. Keep demo labels honest but quiet.
- A shallow separate long-form article preview band follows notes. Keep the existing two essay examples and their text; the generated concept's invented photos and three new article titles are not content requirements. Text-only previews fit this site's actual content, so no unrelated photos are needed.
- Footer remains quiet with export and local-storage explanation available. All dialogs, readers and other pages inherit the same sans/blue-violet style.

## Calendar and content semantics

UI state is {month:'YYYY-MM', selectedDate:null|string, category:'全部'|'灵感'|'学习'|'生活', visibleCount:24}. Default date scope is selected month. Month arrows reset selectedDate and page limit. Day selection filters to that date; clicking selected day can clear it. Explicit 全部日期 escape enables all-time records and a 回到本月 control restores this month. Category/date intersection is explained by empty-state text and reset controls. Activity counts are derived before pagination from records in the month. Keep focus on the activated replacement control and announce changes. Every date remains usable, including empty dates.

On mobile the dock becomes a compact genuine Monday-first seven-column round-dot calendar with clear touch targets and month controls. Notes collapse to one column without text rotation or horizontal overflow. At intermediate width use two note columns. Preserve logical newest-first DOM order. No endless card floating or scroll hijacking. Short staggered entrance and small hover spring/asterisk tilt provide the desired movement; reduced motion disables transforms/animations.

## Durable data and capture

Keep key flow-journal-v1, schema version1, kind log/essay and original record IDs. Display log as Flow throughout product copy. Canonical route #/flow; legacy #/journal continues to render without destructive redirect. Essay/entry/about routes remain. Old categories AI / Agent, 开发, 阅读 still validate and map to 学习 in display filters. Add 灵感 and 学习 category values as necessary while preserving old data verbatim. No migration write on load.

Writing is body-first for Flow. Title is optional and a bounded title is derived from the first nonempty body line at save if omitted. Keep title required for essays. Date/category/tag details can be quiet secondary controls. Existing title/body values remain untouched. Safe textContent rendering, search, save failure preservation, backup, native dialog cancel and skip-link fixes stay intact. Do not claim cloud storage.

## Architecture synthesis

Architecture A is the base, independently favored by the cross-judge for its explicit state, bounded rendering and backward compatibility. Grafts from B are coherent month scope, focus-preserving date filtering, and body-first capture. Visual structure follows the user's explicit concept-A choice, so no circular calendar is implemented. Existing app.js remains composition/rendering owner. A small pure flow-model.js can hold shared month/category/date selection rules and makes meaningful behavior checks cheap, without duplicating persistence.

## Verification

Compare native concept size to actual browser screenshot. Check palette, layout, typography, calendar, card rhythm, artwork, copy and mobile. Exercise legacy route and existing data, date/category combinations, month transition, empty day recovery, no-title Flow save, essay save, search, export, keyboard and reduced motion source. Capture final clean preview on127.0.0.1; use localhost origin for synthetic writing tests.
