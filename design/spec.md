# Flow visual specification

Reference: `concept.png`, generated with built-in ImageGen on 2026-10-22. Chosen by the agent from the user's open design brief, pending user feedback.

## Layout and tokens

- Paper background #f7f7f2. Ink #252821. Moss #5f7054. Muted #777b70. Hairline #daddd2. Terracotta #bf7960.
- Centered content width 1120px, generous desktop side margins, mobile 22px.
- Header 90px, simple orbital line mark and Flow 浮流, three navigation links and search button.
- Hero about 300px tall, large two-line Chinese serif heading on left, isolated textured green ribbon asset on right. Handwritten English caption appears as code-native typography. No color tint overlay on asset.
- Main region uses 730px timeline plus 270px sidebar and a generous gutter. Fine vertical rule separates sidebar.
- Timeline uses large serif day numerals, monospaced month and small weekday; thin track and green dot; titles, outlined tags, two-line excerpts, quiet reading links.
- Sidebar uses an actual calendar derived from displayed entries, then essay preview links. Empty calendar days stay neutral. No fabricated activity statistics.
- Footer thin rule, small muted copy. Add an understated sample/local storage note without disrupting the first viewport.
- Serif typography uses available Chinese serif system fonts, Georgia for Latin. Body and controls use system sans fonts, dates use monospace. Headlines about 58px desktop, 34px mobile, list titles 24px, body 15px.
- Open rows and hairlines, no rounded card grid or nested panels.

## Allowed first viewport copy

Flow 浮流; 学习流水; 感悟文章; 关于; 在学习中生长，; 在记录中看见自己。; 一些每天积累的知识，和偶尔停下来想的事情。; a little, every day.; 学习流水; 日复一日，慢慢有迹可循。; 写一条; 全部; AI / Agent; 开发; 阅读; 十月，留下了一些足迹; 偶尔，写得长一点; 那些没有标准答案的想法。

First log title: 让 RAG 真正理解一份文档. Second: 用 Claude Code 搭建一个小而美的工具. Third: 重读《金字塔原理》，从表达到思考.
Essay titles: 不急着成为一个很厉害的人; 输入很多之后，我开始练习输出.
Dates and calendar are content-derived and may change after authoring. All seed entries must be labeled as examples.

## Interaction contract

Learning timeline and essays have separate hash routes. Click any entry to read its complete content. Browser Back works. Category filtering and text search have empty states and reset. The editor saves either entry kind locally with explicit storage success/error. Export JSON for local backups. No public publishing claims, accounts, or sync. About explains the two sections and local-first limitations without invented personal biography.

## Motion and responsive behavior

Brief staggered page appearance, subtle hovering ribbon, small link shifts. `prefers-reduced-motion` disables motion. Visible keyboard focus. On mobile use one column with smaller heading, compact header, smaller ribbon, calendar and essays after logs. Reader remains under 68 characters wide on desktop. Native controls inherit typography.

## Scope

Build and preview locally. Deploy is deferred because poteto-mode's Autonomy section says “Always pause” for deploys. No repository remote was provided. Browser verification and a reviewable implementation precede any deployment decision.
