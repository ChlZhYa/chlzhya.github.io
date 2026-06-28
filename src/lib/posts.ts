import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

/**
 * Archive 文章读取管线（服务端）。
 *
 * 数据源：src/content/posts/*.md
 * 流程：
 *   1. fs 读取目录下所有 .md
 *   2. gray-matter 解析 frontmatter（title/date/tags/summary/draft）
 *   3. remark + remark-html 渲染正文为 HTML 字符串
 *
 * 全部在服务端/build 时完成，零运行时开销、纯文件系统。
 */

const POSTS_DIR = path.join(process.cwd(), "src", "content", "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string; // ISO 或 YYYY-MM
  tags: string[];
  summary: string;
  /** 字数估算（用于阅读时长） */
  readingMinutes: number;
  draft?: boolean;
};

export type Post = PostMeta & {
  /** 渲染后的 HTML 字符串 */
  html: string;
};

/** 估算阅读时长（中文按 400 字/分，英文按 200 词/分，这里粗略按字符数估算） */
function estimateReadingMinutes(text: string): number {
  const chars = text.replace(/\s+/g, "").length;
  return Math.max(1, Math.round(chars / 400));
}

/** 安全地读取目录，不存在则返回空 */
function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

/** 获取所有文章的 meta（不含正文），按日期降序，排除 draft */
export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map((slug) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), "utf8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? ""),
        tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
        summary: String(data.summary ?? ""),
        readingMinutes: estimateReadingMinutes(content),
        draft: Boolean(data.draft),
      } satisfies PostMeta;
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** 获取单篇完整文章（含渲染后的 HTML 正文） */
export async function getPost(slug: string): Promise<Post | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);

  const processed = await remark().use(remarkHtml).process(content);
  const html = processed.toString();

  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    summary: String(data.summary ?? ""),
    readingMinutes: estimateReadingMinutes(content),
    draft: Boolean(data.draft),
    html,
  };
}

/** 获取所有 tag（用于索引页 tag 过滤） */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllPosts()) {
    for (const t of p.tags) tags.add(t);
  }
  return Array.from(tags).sort();
}
