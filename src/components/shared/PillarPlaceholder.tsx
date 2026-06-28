import Link from "next/link";
import { SectionHead } from "./SectionHead";
import { Reveal, Stagger, Grow } from "./MotionPrimitives";
import { nav } from "@/content/site.config";

/**
 * 支柱占位页：统一几何噪点流骨架。
 * 阶段 B/C/D 各支柱会替换为自己的真实实现。
 */
export function PillarPlaceholder({
  index,
  code,
  title,
  titleEm,
  kicker,
  intro,
  motif,
}: {
  index: number;
  code: string;
  title: string;
  titleEm: string;
  kicker: string;
  intro: string;
  motif: React.ReactNode;
}) {
  return (
    <div className="relative mx-auto min-h-[calc(100dvh-88px)] max-w-[1400px] px-6 pb-20 pt-10 sm:px-10">
      <SectionHead
        kicker={`${String(index).padStart(2, "0")} · ${kicker}`}
        title={
          <>
            {title}{" "}
            <em className="not-italic text-[var(--lime)]">{titleEm}</em>
          </>
        }
        intro={intro}
      />

      {/* 母题视觉占位 */}
      <Reveal delay={0.3} className="mt-14">
        <div className="relative h-[clamp(240px,42vh,440px)] w-full overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--mist)]/40">
          {motif}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5">
            <span className="meta text-slate">coming in next phase</span>
            <span className="meta inline-flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
              drafting
            </span>
          </div>
        </div>
      </Reveal>

      {/* 跨支柱导航 */}
      <Stagger className="mt-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3" gap={0.1}>
        {nav.map((item) => (
          <Grow key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between bg-[var(--paper)] px-5 py-4 transition-colors hover:bg-[var(--mist)]"
            >
              <span className="flex flex-col">
                <span className="meta text-slate">{item.code}</span>
                <span className="mt-1 font-display text-xl text-ink">{item.label}</span>
              </span>
              <span className="meta text-slate transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                →
              </span>
            </Link>
          </Grow>
        ))}
      </Stagger>
    </div>
  );
}
