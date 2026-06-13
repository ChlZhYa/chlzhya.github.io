# Agent Handoff

This project is a personal showcase website, not a dashboard or task management tool.

## Product Direction

- The site should feel minimal, modern, colorful in a restrained way, and slightly technical.
- The site is primarily for displaying locally maintained content.
- Learning and travel content should be treated as long-term archives, not only the latest status.
- The current MVP is a single-page site, but the data model should support future detail pages.
- All visible UI copy should be Chinese unless the user explicitly asks otherwise.

## Confirmed User Preferences

- Avoid dashboard/workbench layouts.
- Avoid online content editing UI, task checkboxes, progress maintenance controls, and dense admin panels.
- Avoid central hero module tabs.
- Navigation belongs near the top-left brand area.
- The hero should use more horizontal space for the main title on desktop.
- AI/tech animation should be subtle and integrated into the hero background layer.
- Do not show the AI animation as a separate framed panel.
- Avoid pure particle motion as the main AI animation metaphor.
- Prefer AI-process visual language: input, retrieval, reasoning, generation, and archival/synthesis.
- Travel photos are welcome inside the Travel section, not in the hero.
- Hide empty module sections through configuration instead of leaving empty placeholders.
- Current hidden sections: Notes, Projects, Future Modules.

## Current Technical Stack

- React
- Vite
- TypeScript
- Plain CSS
- Local content files under `src/content`

## Important Files

- `src/App.tsx`: page structure, navigation, hero background animation, learning/travel sections.
- `src/styles.css`: visual system, responsive rules, motion, layout.
- `src/content/site.config.ts`: site navigation and module visibility switches.
- `src/content/learning.ts`: learning paths, resources, and learning archive data.
- `src/content/travel.ts`: current trip, route, itinerary, gallery, and travel archive data.
- `docs/project-brief.md`: human-readable project brief and decision record.

## Content Model

Learning currently supports:

- Learning paths
- Resources
- Learning archive
- Hidden but reserved: notes and projects

Travel currently supports:

- Current featured trip
- Route stops
- Itinerary
- Destinations
- Gallery
- Travel archive

Future expansion should favor:

- `/learning/:slug` detail pages
- `/travel/:slug` detail pages
- Optional Google Sheets or backend data sync
- Markdown or local structured content as an intermediate source

## Implementation Guardrails

- Keep the UI Chinese-first.
- Keep the site display-oriented.
- Do not introduce a CMS/admin surface unless the user asks for it.
- Do not add Notes, Projects, or Future Modules visibly unless the config and data support them.
- Preserve `prefers-reduced-motion` behavior.
- Keep animation performance modest: limited canvas work, capped device pixel ratio, pause on hidden document.
- After visual changes, run `npm run build` and verify in the browser.

## Current Validation Baseline

The last verified state had:

- `npm run build` passing.
- Browser console without relevant warnings or errors.
- No horizontal overflow at tested desktop viewport.
- Chinese navigation: 首页, 学习, 旅行.
- Hero title: 学习、远行与自我系统.
- Hero canvas integrated as `.hero > canvas.ai-canvas`.
- Archive sections visible: 学习档案 and 旅行档案.
