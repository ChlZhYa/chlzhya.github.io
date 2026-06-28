import Link from "next/link";
import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal, Stagger, Grow } from "@/components/shared/MotionPrimitives";
import { SpineStack } from "@/components/archive/SpineStack";
import { getAllPosts, getAllTags } from "@/lib/posts";

/**
 * Archive — 书脊栈 + 文章索引。
 * 上方：书脊栈视觉 / 下方：可读的文章列表 + tag 标注。
 */

export const metadata = { title: "Archive" };

export default function ArchivePage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <div className="relative mx-auto min-h-[calc(100dvh-88px)] max-w-[1400px] px-6 pb-24 pt-10 sm:px-10">
      <SectionHead
        kicker="03 · archive"
        title={
          <>
            read like a <em className="not-italic text-[var(--lime)]">scroll</em>
          </>
        }
        intro="Long-form notes rendered from local markdown — mostly AI and backend engineering. Pull a spine to open the full text."
      />

      {/* 书脊栈视觉 */}
      <Reveal delay={0.2} className="mt-12">
        <div className="rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/60 p-6">
          <div className="meta mb-5 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
            the stacks · {posts.length} entries
          </div>
          {posts.length > 0 ? (
            <SpineStack posts={posts} />
          ) : (
            <p className="meta py-8 text-center text-slate">no posts yet.</p>
          )}
        </div>
      </Reveal>

      {/* tag 标注 */}
      {tags.length > 0 && (
        <Reveal delay={0.25} className="mt-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="meta mr-1 text-slate">tags</span>
            {tags.map((t) => (
              <span
                key={t}
                className="meta rounded-full border border-[var(--hairline)] px-2.5 py-1 text-ink-soft"
              >
                {t}
              </span>
            ))}
          </div>
        </Reveal>
      )}

      {/* 文章列表 — 按年分组（避免文章多了无结构堆叠） */}
      <div className="mt-12 flex flex-col gap-12">
        {groupByYear(posts).map((g) => (
          <section key={g.year}>
            {/* 年份标题 */}
            <div className="mb-4 flex items-baseline gap-4 border-b border-[var(--hairline)] pb-3">
              <h2 className="font-display text-3xl font-semibold text-ink">{g.year}</h2>
              <span className="meta text-slate">
                {g.items.length} {g.items.length === 1 ? "note" : "notes"}
              </span>
            </div>
            {/* 该年文章 */}
            <Stagger className="flex flex-col" gap={0.08}>
              {g.items.map((p) => (
                <Grow key={p.slug}>
                  <Link
                    href={`/archive/${p.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-[var(--hairline)] py-5 transition-colors hover:bg-[var(--paper)]/50 sm:gap-6"
                  >
                    <span className="meta shrink-0 tabular-nums text-slate">{p.date}</span>
                    <span className="flex flex-col">
                      <span className="font-display text-xl leading-tight text-ink transition-colors group-hover:text-[var(--lime)] sm:text-2xl">
                        {p.title}
                      </span>
                      <span className="mt-1 max-w-[60ch] text-sm leading-relaxed text-ink-soft">
                        {p.summary}
                      </span>
                      <span className="meta mt-2 flex gap-2 text-slate">
                        {p.tags.map((t) => (
                          <span key={t}>#{t}</span>
                        ))}
                        <span>· {p.readingMinutes} min read</span>
                      </span>
                    </span>
                    <span className="meta self-center text-slate transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                      →
                    </span>
                  </Link>
                </Grow>
              ))}
            </Stagger>
          </section>
        ))}
      </div>
    </div>
  );
}

/** 按 year 分组，年份降序 */
function groupByYear<T extends { date: string }>(items: T[]): { year: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const y = it.date.slice(0, 4);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(it);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([year, items]) => ({ year, items }));
}
