# AGENTS.md

本文件对所有在本仓库工作的 agent 生效。

## Git 提交规范

- 提交信息使用 Conventional Commits 格式：`type(scope): 描述`，
  scope 取 git / editor / test / docs / chore 等（见 git log 既有惯例）
- 按改动模块分批提交：一次提交只包含一个模块或一个关注点，
  混合改动先用 `git add <path>` 分文件暂存，再逐批提交
- 典型拆分：功能代码、测试、文档、样式/重构 各自独立成提交
- 未明确要求时不要自动提交


## 内容发布

为用户发布短文（Flow）或文章时：

1. 在 `content/flow/`（kind=`log`）或 `content/essays/`（kind=`essay`）新增/编辑 Markdown
2. Frontmatter 必填：`title`、`date`（YYYY-MM-DD）、`category`；可选 `tags`、`updatedAt`、`id`
3. 本地可运行 `npm run build` 生成 `dist/published.js`；提交时**同时提交** content 改动与更新后的 `dist/published.js`（CI 部署前也会再跑一遍 build，保证 Pages 产物最新）
4. 不要改动 `dist/data.js` 里的 `demo-*` 示例，除非用户明确要求
5. 一次提交只做一件事（例如 `feat(content): add flow note about …`）
