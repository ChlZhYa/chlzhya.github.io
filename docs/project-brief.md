# 个人网站项目简报

## 项目定位

这是一个个人展示型网站，用来展示学习路径、资料沉淀、旅行规划和旅行记录。它不是任务管理后台，也不是在线维护进度的工作台。

用户希望自己的内容主要在本地维护，再同步到网站上展示。网站承担的是“浏览、呈现、归档”的角色，而不是“编辑、打卡、管理”的角色。

## 当前设计方向

方向名可以理解为：**Minimal Tech Editorial**。

关键词：

- 简约
- 现代
- 有色彩但不花哨
- 有技术感但不喧宾夺主
- 展示流，而不是 dashboard
- 中文界面
- 首屏有克制的 AI/科技感动效
- 学习和旅行是长期档案，不只是当前内容

## 已确认偏好

- 首屏不要中间的 Learning / Travel 切换器。
- 模块切换放在左上角导航附近。
- 首屏右上角不要照片展示。
- 旅行照片可以放在 Travel 模块内部。
- AI 动效不应是独立框出来的一块区域。
- AI 动效应该和背景融为同一层。
- 不喜欢纯粒子运动，需要更能表达 AI 相关概念。
- 页面中文化。
- 桌面端主标题要利用更多横向空间。
- 学习模块当前不展示 Notes 和 Projects。
- Future Modules 当前不展示。
- 模块显示应该可配置，空模块不渲染。

## 当前页面结构

MVP 是单页展示流：

1. 首页 Hero
   - 中文主标题
   - 简短介绍
   - 轻量标签
   - 两个跳转按钮
   - 背景层 AI 动效

2. 学习模块
   - Learning Paths
   - Resources
   - 学习档案

3. 旅行模块
   - 当前精选旅程
   - 路线
   - 行程
   - 目的地
   - 照片展示
   - 旅行档案

4. Footer
   - 本地优先维护
   - 后续可接 GitHub Pages、Google Sheets 或自有后端

## 关于历史内容

用户指出：如果只有单页面展示，随着学习路径和旅行内容增加，历史信息可能无法查看。尤其旅行模块不能只展示一次旅行。

因此当前方案采用：

- 当前精选内容：展示当前最重要的一组学习或旅行内容。
- 历史归档：展示过往阶段、过往旅行和未来目的地。

后续可以从归档卡片升级为详情页：

```text
/learning/:slug
/travel/:slug
```

## 数据配置方式

当前数据在本地 TypeScript 文件中：

```text
src/content/site.config.ts
src/content/learning.ts
src/content/travel.ts
```

模块开关在：

```ts
export const learningConfig = {
  enabled: true,
  sections: {
    paths: true,
    notes: false,
    projects: false,
    resources: true,
  },
};
```

旅行模块类似：

```ts
export const travelConfig = {
  enabled: true,
  sections: {
    route: true,
    itinerary: true,
    destinations: true,
    gallery: true,
  },
};
```

## 技术方案

当前技术栈：

- React
- Vite
- TypeScript
- Plain CSS
- 本地内容文件

当前不接后端，不接 Google Sheets。后续可选：

- GitHub Pages 静态部署
- Google Sheets 作为轻量内容维护源
- 自有后端 API
- Postgres 数据库存储结构化数据
- Markdown/MDX 作为学习笔记和旅行详情源

## AI 动效方案

当前 Hero 背景使用 Canvas 2D。

设计意图：

- 不使用独立卡片容器
- 不做纯粒子效果
- 表达 AI 流程感
- 动效克制、虚化、低对比
- 不影响阅读

视觉隐喻：

```text
输入 -> 检索 -> 推理 -> 生成 -> 沉淀
```

性能约束：

- 使用 `requestAnimationFrame`
- 限制 `devicePixelRatio`
- 页面隐藏时暂停
- 尊重 `prefers-reduced-motion`
- 移动端减少复杂度

## 已否决方向

- Dashboard / 工作台式布局
- 在线维护任务进度
- 首屏独立照片展示
- 首屏中央模块切换器
- 纯粒子动画
- 英文为主的界面
- 空的 Notes / Projects 模块占位
- Future Modules 在 MVP 里展示

## 下一步建议

1. 初始化 Git 仓库并推到 GitHub。
2. 配置 GitHub Pages 部署。
3. 把学习和旅行归档数据改成更稳定的 `slug` 结构。
4. 增加详情页路由。
5. 决定内容源：
   - 继续本地 TypeScript
   - 改 Markdown/MDX
   - 接 Google Sheets
   - 接自有后端
6. 根据真实内容进一步调整视觉密度和模块样式。

## 给后续 AI 工具的提示

继续工作前请先阅读：

```text
AGENTS.md
docs/project-brief.md
```

后续修改时优先保持：

- 中文界面
- 展示流
- 配置化模块
- 低调技术感
- 当前精选 + 历史归档
- 本地优先的数据维护方式
