# AGENTS.md

本文件对所有在本仓库工作的 agent 生效。

## Git 提交规范

- 提交信息使用 Conventional Commits 格式：`type(scope): 描述`，
  scope 取 git / editor / test / docs / chore 等（见 git log 既有惯例）
- 按改动模块分批提交：一次提交只包含一个模块或一个关注点，
  混合改动先用 `git add <path>` 分文件暂存，再逐批提交
- 典型拆分：功能代码、测试、文档、样式/重构 各自独立成提交
- 未明确要求时不要自动提交
