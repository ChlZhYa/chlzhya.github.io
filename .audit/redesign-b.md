# Flow redesign exploration B

## Current shape and invariant

`dist/app.js` owns a vanilla-JS entry registry, hash routes, localStorage, search, editor and export. The durable contract is `flow-journal-v1`, `{version:1, entries:[Entry]}` with `kind: 'log'|'essay'`; demo records are in `dist/data.js`. The redesign can relabel `log` as Flow in the interface, but must keep parsing, IDs, URLs and saved values intact. Resolve `#/journal` as an alias to Flow. Keep essays on their own route. Existing node/textContent rendering is a useful safety boundary for user text.

## Two structurally distinct directions

**A — Flow field (recommended):** A compact identity header and one short welcome line lead into a full-width month navigator/calendar. Below it, one responsive card field holds the selected month’s Flow moments, newest first; selecting a day filters the field and selecting “All days” restores the month. Cards are a calm, readable grid with small category color marks and true dates, not positioned by hand or arranged as a timeline. Essay writing and browsing live on a distinct Essays page. The calendar and content share one vertical reading path, with no sidebar.

**B — Date cells as the notebook:** Make the month grid the main content surface; days with records expand into mini thought cards inside their cells. Selecting a day opens its full notes below the grid, while essay access is a separate page. This is visibly calendar-first and gives dates equal spatial weight, but variable content makes the grid uneven, overcrowded dates collapse its rhythm, and mobile reflow weakens the month’s shape. It asks the user to decode a dense calendar before reading.

## Decision

Choose A. It keeps short writing as the visual subject while the calendar acts as a useful index. The rubric is distinction from a blog, comfortable reading of short thoughts, an understandable working calendar, keyboard/mobile feasibility, and fit with the existing app and data. A has the best balance: stable source order as entries grow, direct access by date, and no fake activity visualization. B’s useful idea to graft is a clear selected-day state and actual per-day counts; its cell-as-card composition is rejected for density and narrow screens.

## Minimal domain and UI state

- Durable domain stays `Entry {id, kind, title, date, category, tags, body, updatedAt}`; `log` remains the storage value, displayed as “Flow”. No schema bump, rewrite, or migration. Existing entry links remain valid.
- Route: `flow | essays | about | entry(id) | missing`; both `#/flow` and legacy `#/journal` resolve to Flow. Entry keeps its existing ID and `kind`-based return route.
- Flow view state: `month`, `selectedDate | allDays`, `category | all`; derive visible records from entries. No separate activity score, streak, or stored calendar state.
- Dialog state is already native: search and writer open/closed. Writer type is only `log` or `essay`; the Flow page defaults to `log`, Essays to `essay`. Preserve save/error, export, and empty/large-data handling.

## Calendar behavior and movement

Use a true seven-column, Monday-first month grid with previous/next month buttons, a labeled month heading, weekday headers, and one button per date. Mark a day only when real Flow entries exist; show a small count for multiple entries and a distinct today outline. Clicking a marked or empty date selects it and updates the cards area to that date (an explicit empty-day message includes “Show all days”). Month changes reset the selection to all days. Buttons and an `aria-live` month/selection announcement make the calendar usable without a pointer; date labels include the full date and entry count. Do not use intensity heat or imply unrecorded activity.

Motion should explain state: month changes briefly slide the month label and calendar marker together; selecting a date moves the active ring and crossfades the matching card set. Keep the content order fixed, use short opacity/transform only, and disable transitions under `prefers-reduced-motion`. Avoid perpetual drifting, scroll-jacking, or card rearrangement; movement should show where the reader’s attention went.

## Text, focus, and responsive behavior

Render titles, tags, excerpts, and paragraphs with DOM text nodes / `textContent`; never interpret note bodies as HTML. Keep long words and URLs wrapping inside cards. Cards link to the existing entry route and have descriptive accessible names. Maintain visible `:focus-visible`, skip-to-main, semantic headings, and a polite status region. On route changes, focus the page heading; on calendar updates, preserve focus on the activated control and announce the result. On narrow screens, calendar becomes a full-width seven-column grid with large touch targets; cards become one column, with calendar controls reachable before the notes. No horizontal scrolling or visual-only date selection.
