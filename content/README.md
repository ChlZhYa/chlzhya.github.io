# Content 发布说明

把 Markdown 放进对应文件夹，运行 `npm run build`（或由 GitHub Actions 在部署前构建），站点就会加载这些内容。

## 文件夹

| 路径 | kind | 用途 |
|------|------|------|
| `content/flow/*.md` | `log` | 短笔记 / Flow |
| `content/essays/*.md` | `essay` | 长文 / 文章 |

跳过本目录下的 `README.md`；只处理 `.md` 正文文件。

## Frontmatter 格式

```yaml
---
title: 标题
date: 2026-10-27
category: 生活
tags: [可选, 标签]
updatedAt: 2026-10-27T09:00:00.000Z
id: optional-slug
---
正文（Markdown 或纯文本）
```

### 字段说明

- **title**（必填）：标题
- **date**（必填）：`YYYY-MM-DD`
- **category**（必填）：分类，例如 `生活`、`灵感`、`学习`
- **tags**（可选）：字符串数组，默认 `[]`
- **updatedAt**（可选）：ISO 时间；缺省为 `date` + `T09:00:00.000Z`
- **id**（可选）：稳定 id；缺省为文件名去掉 `.md`

### 正文语法

正文按 GitHub 风格 Markdown 渲染：段落、`#` 到 `######` 标题、加粗、斜体、删除线、行内代码、围栏代码块、有序与无序列表、任务清单、引用、分隔线、表格、链接和图片。段落内的单个换行显示为换行。

正文里的原始 HTML 标签按文字原样显示，不会变成元素。链接和图片地址只接受 `http:`、`https:`、`mailto:` 和站内相对地址，其他协议的链接只显示链接文字。HTML 实体（例如 `&copy;`）按原文显示，需要符号时直接写符号。

首页卡片的摘要和无标题记录的自动标题使用去掉 Markdown 标记后的纯文本。

## 本地构建

```sh
npm run build   # 生成 dist/published.js
npm start       # 会先 build 再启动本地服务器
```

CI 在上传 Pages 产物前也会执行同一构建脚本。`dist/data.js` 里的 `demo-*` 示例不受影响。
