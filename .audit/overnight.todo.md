# 夜间自主优化

- [x] Read the Principles section of the poteto-mode skill.
- [x] Frame.
- [x] Design the workflow.
- [x] Run the loop.
- [x] Keep the audit trail.
- [x] Verify and hand back.

## Completion predicate

保留冷白蓝紫、错落念头画布、环形日历与 Flow / 文章区分。完成可恢复的写作与自有记录修改，卡片呈现可读正文；保存失败和过期修改不会静默覆盖内容。语法、行为测试、HTTP smoke、真实浏览器桌面与手机流程通过，独立评审关闭实质问题，留下可复查的报告与决策日志。

## Workflow

- [x] Frame / Fan out. Two read-only architecture candidates grounded in current source at 2069446.
- [x] Baseline. Existing clean page captured in overnight-before-desktop.png.
- [x] Ground / Sketch / Agree. Compare small session draft approach with store boundary approach; record contract before code.
- [x] Implement. One isolated code owner for coupled writer/store changes; root owns visual refinements and evidence only after integration.
- [x] Verify unit. Pure data behavior tests, syntax, HTTP resources; independently review diff.
- [x] Verify product. Browser create, draft recovery, edit, conflict, search, export, responsive and keyboard checks.
- [x] Aggregate / Report. Resolve proven defects, record limitations, audit trail and morning report.
- [x] Scrap. skip: no repeated structural friction invalidated the accepted design.

## Scope and rigor

Two coupled functional improvements (draft recovery and editing) and a bounded card readability pass. No backend, cloud account, deployment, destructive deletion, or wholesale visual redesign. High rigor for local data writes; screenshots and manual browser interactions for presentation. Stop when the predicate passes, rather than expanding into a new product.

## Throughput checkpoint

Architecture audits run in parallel. Source changes have one owner in an isolated worktree. Root verifies the real UI and owns decision trail. Review starts after the functional unit is available; visual work waits for source ownership handoff. This avoids competing writes to app.js/styles.css.
