import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllPosts } from "@/lib/posts";
import { ReadingProgress } from "@/components/archive/ReadingProgress";
import { Reveal } from "@/components/shared/MotionPrimitives";
import "./prose.css";

/**
 * Archive 长读页 — /archive/[slug]
 * 服务端渲染本地 md，纸卷长读体验：阅读进度条 + 衬线感正文。
 */

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post ? post.title : "Archive" };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <div className="relative mx-auto min-h-[calc(100dvh-88px)] max-w-[760px] px-6 pb-24 pt-6 sm:px-10">
      {/* 阅读进度条 */}
      <ReadingProgress />

      {/* 返回链接 */}
      <Reveal>
        <Link
          href="/archive"
          className="meta inline-flex items-center gap-2 text-slate transition-colors hover:text-ink"
        >
          <span className="inline-block h-px w-6 bg-current" />
          back to archive
        </Link>
      </Reveal>

      {/* 文章头部 */}
      <header className="mt-8">
        <Reveal delay={0.05}>
          <div className="meta flex flex-wrap items-center gap-3 text-slate">
            <time>{post.date}</time>
            <span>·</span>
            <span>{post.readingMinutes} min read</span>
            <span>·</span>
            <span className="flex gap-2">
              {post.tags.map((t) => (
                <span key={t}>#{t}</span>
              ))}
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.12}>
          <h1 className="mt-4 font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-semibold leading-[1.02] text-ink">
            {post.title}
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">
            {post.summary}
          </p>
        </Reveal>
      </header>

      {/* 正文（渲染后的 md HTML） */}
      <Reveal delay={0.28}>
        <article
          className="prose mt-12"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </Reveal>

      {/* 底部 */}
      <Reveal>
        <div className="mt-16 border-t border-[var(--hairline)] pt-6">
          <Link
            href="/archive"
            className="meta inline-flex items-center gap-2 text-slate transition-colors hover:text-ink"
          >
            <span className="inline-block h-px w-6 bg-current" />
            all notes
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
