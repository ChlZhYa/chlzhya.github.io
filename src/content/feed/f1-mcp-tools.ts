import type { FeedItem } from "../learning";

/**
 * 单条 feed 项。后续每加一条学习记录/资源/笔记，
 * 在此目录新建一个 .ts 文件、default 导出一个 FeedItem 即可。
 * learning.ts 会自动聚合 feed/ 下所有文件。
 */

const item: FeedItem = {
  id: "f1",
  kind: "note",
  streams: ["tool-use", "harness"],
  date: "2025-11",
  title: "MCP 工具集成的工程化笔记",
  detail: "从协议握手到工具选择的错误恢复闭环。",
};
export default item;
