import Link from "next/link";
import { Reveal, Stagger, Grow } from "@/components/shared/MotionPrimitives";
import { Wordmark } from "@/components/chrome/Wordmark";
import { nav } from "@/content/site.config";

/**
 * 首页 — 几何噪点流。
 * 超大变体无衬线 + 荧光锚点 + 流动噪点光晕（已在 globals/body 全局）。
 */
export default function Home() {
  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="mx-auto flex min-h-[calc(100dvh-88px)] max-w-[1400px] flex-col justify-between px-6 pb-16 pt-10 sm:px-10">
        {/* 顶部 hero */}
        <header className="max-w-5xl">
          <Reveal delay={0.1}>
            <p className="meta mb-8 flex items-center gap-3">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
              developer · field notes
            </p>
          </Reveal>

          {/* 超大几何字标作为视觉锚点 */}
          <Reveal delay={0.16} y={30}>
            <Wordmark size="xl" />
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-10 max-w-2xl text-xl leading-relaxed text-ink-soft sm:text-2xl">
              <span className="text-ink">A field notebook</span> for what I build,
              where I go, and what I write down — AI &amp; backend engineering,
              trips, and longer notes.
            </p>
          </Reveal>
        </header>

        {/* 三大支柱入口 — 现代网格，非卡片堆叠 */}
        <Stagger className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-3" gap={0.1}>
          {nav.map((item, i) => (
            <Grow key={item.href}>
              <Link
                href={item.href}
                className="group relative flex h-full min-h-[260px] flex-col justify-between bg-[var(--paper)] p-7 transition-colors duration-500 hover:bg-[var(--mist)]"
              >
                {/* 顶部代号 + 编号 */}
                <div className="flex items-center justify-between">
                  <span className="meta">{String(i + 1).padStart(2, "0")}</span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[0.68rem] font-bold tracking-wider transition-all duration-300"
                    style={{
                      background: "var(--hairline)",
                      color: "var(--ink-soft)",
                    }}
                  >
                    {item.code}
                  </span>
                </div>

                {/* 底部标题 */}
                <div>
                  <h2 className="font-display text-4xl leading-none text-ink sm:text-5xl">
                    {item.label}
                  </h2>
                  <p className="mt-4 max-w-[28ch] text-sm leading-relaxed text-slate">
                    {tagline(item.href)}
                  </p>
                  <span className="meta mt-6 inline-flex items-center gap-2 text-ink transition-all duration-300 group-hover:gap-3">
                    open
                    <span className="inline-block h-px w-6 bg-ink transition-all duration-300 group-hover:w-10 group-hover:bg-[var(--lime)]" />
                  </span>
                </div>

                {/* 悬停时左缘荧光条 */}
                <span className="absolute inset-y-0 left-0 w-1 origin-top scale-y-0 bg-[var(--lime)] transition-transform duration-500 group-hover:scale-y-100" />
              </Link>
            </Grow>
          ))}
        </Stagger>
      </div>
    </div>
  );
}

function tagline(href: string) {
  switch (href) {
    case "/workbench":
      return "Learning streams across AI engineering and backend systems.";
    case "/journey":
      return "Trips I've taken and the photos I brought back.";
    case "/archive":
      return "Long-form notes rendered from local markdown.";
    default:
      return "";
  }
}
