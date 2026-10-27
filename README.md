# Flow 浮流

一个安静的念头展示空间。Flow 收下观察、小想法和突然想通的瞬间；文章留给较长的思考。仓库内有六条 Flow 和两篇文章示例，均明确标为“示例”。

## 本地运行

需要 Node.js 18 或更新版本，无需安装依赖或构建。

```sh
npm start
```

`npm start` 会先执行 `npm run build`（把 `content/` 下的 Markdown 编成 `dist/published.js`），再启动服务器。打开 <http://127.0.0.1:4173>。运行 `npm run check` 检查语法并构建内容，`npm test` 验证日期、筛选、记录快照与 frontmatter 解析。服务器运行时，`npm run smoke` 检查静态资源、文件类型和只读边界。

## 浏览

首页默认显示本月 Flow。右侧的月历卡片按真实记录数标出活跃日期；点击日期筛选，再点一次恢复整月。月份箭头切换月份，分类可与日期一起筛选。月份标题旁的 ∞ 按钮切换“全部日期”跨月份浏览，再次点击回到本月。画布呈现前五条匹配记录，其余记录在下方继续展示，每条只出现一次。

卡片直接显示至多三行正文摘要，点击卡片任意位置可打开阅读页。自动标题与正文首行完全相同时只展示一次，完整内容仍按原文保存。

阅读页用 `dist/vendor/marked.esm.js`（marked v18.1.2，MIT）解析正文 Markdown，`dist/markdown.js` 把解析得到的 token 直接构建为 DOM 节点，不经过 `innerHTML`。正文里的原始 HTML 按文字显示，链接只接受 `http:`、`https:`、`mailto:` 和站内相对地址。支持的语法见 `content/README.md`。卡片摘要和自动标题使用去掉标记后的纯文本。

页面不再提供在线写入。早前在浏览器里保存过的记录仍会显示，记录使用 `localStorage`，键为 `flow-journal-v1`，快照结构为 `{ "version": 1, "entries": [...] }`。旧分类“AI / Agent”“开发”“阅读”仍可读取，并归入“学习”筛选。旧的 `#/journal` 链接仍可访问 Flow，新的首页地址是 `#/flow`。

页脚和“关于”页可导出 JSON 备份，导出时重新读取最新记录，只包含用户自己的内容，不包含示例。站点内容可通过仓库内 Markdown 公开发布（见下方「内容发布」）。若本地数据无法读取，页面会提示并暂停导出，以免生成不完整的备份。

## 内容发布

把短笔记放进 `content/flow/`，长文放进 `content/essays/`，使用 YAML frontmatter（`title` / `date` / `category` 必填）。详见 `content/README.md`。

```sh
npm run build   # 生成 dist/published.js
```

GitHub Pages 工作流在上传 `dist` 前会自动运行同一构建。`dist/data.js` 中的 `demo-*` 示例仍保留作演示。

## 文件

- `dist/index.html` 提供页面外壳与原生对话框。
- `dist/styles.css` 实现响应式画布、月历和动效。
- `dist/app.js` 负责路由、渲染和检索。
- `dist/markdown.js` 把正文 Markdown 解析为 DOM 节点，并提供去标记的纯文本。
- `dist/vendor/marked.esm.js` 是 marked 的 ESM 构建，按原样 vendor，升级时整文件替换。
- `dist/flow-model.js` 负责纯日期、分类和筛选逻辑。
- `dist/entry-model.js` 负责本地记录快照的读取校验。
- `dist/data.js` 保存只读示例。
- `dist/published.js` 由 `content/` 构建生成的已发布条目。
- `content/flow/`、`content/essays/` Markdown 源文件。
- `scripts/build-content.mjs` 内容构建脚本。
- `server.mjs` 提供本机静态服务器。
