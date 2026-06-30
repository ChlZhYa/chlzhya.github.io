"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { SectionHead } from "@/components/shared/SectionHead";
import { Reveal } from "@/components/shared/MotionPrimitives";
import { LivingIndex } from "./LivingIndex";
import { StreamFeed } from "./StreamFeed";
import { getFeed, streamMap, streamRoadmaps, streams, supportWeeklyPlan } from "@/content/learning";

/**
 * Workbench — Agent Harness 双项目学习地图。
 * 左：LivingIndex（9 分支俯瞰） / 右：选中路线的行动路线与关联内容时间线（内部滚动）。
 */
export function WorkbenchView() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("stream");
  const selectedId = requested && streamMap[requested] ? requested : streams[0].id;
  const selected = streamMap[selectedId];
  const items = useMemo(() => getFeed(selectedId), [selectedId]);
  const roadmap = streamRoadmaps[selectedId] ?? [];
  const linkedWeeks = useMemo(
    () => supportWeeklyPlan.filter((week) => week.streams.includes(selectedId)),
    [selectedId],
  );

  return (
    <div className="relative mx-auto min-h-[calc(100dvh-88px)] max-w-[1400px] px-6 pb-16 pt-6 sm:px-10 sm:pt-8">
      <SectionHead
        kicker="01 · workbench"
        title={<>agent <em className="not-italic text-[var(--lime)]">harness</em></>}
        intro="22-week dual-project execution map: Research Agent (retrieval/synthesis/citation) + Coding Agent (code edit/test/approval), sharing one runtime/trace/eval harness across 9 capability streams."
      />

      {/* 主交互区：索引 + 关联时间线 */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
        <Reveal delay={0.2} className="order-2 lg:order-1">
          <div className="relative min-h-[680px] overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/60 p-4">
            <div className="meta absolute left-4 top-4 z-10 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
              current sprint map · tap a branch
            </div>
            <LivingIndex streams={streams} selectedId={selectedId} />
          </div>
        </Reveal>

        <Reveal delay={0.3} className="order-1 lg:order-2">
          {/* 固定高度容器：与左侧 SVG 区块等高，内部滚动 */}
          <div className="h-[680px] rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/60 p-6">
            <StreamFeed stream={selected} items={items} roadmap={roadmap} weeks={linkedWeeks} />
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.4}>
        <section className="mt-10 border-t border-[var(--hairline)] pt-8">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="meta text-[var(--lime)]">22-week plan</span>
              <h2 className="mt-2 font-display text-3xl leading-none text-ink">
                Agent Harness · 双项目作品集
              </h2>
            </div>
            <p className="max-w-[52ch] text-sm leading-relaxed text-slate">
              每周保持学习、实现、产出三件事：资料只服务当前实现，不等“全部看完”再开始 coding。
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {supportWeeklyPlan.map((week) => {
              const isActive = week.status === "active";
              const isDone = week.status === "done";
              return (
                <article
                  key={week.week}
                  className={
                    isActive
                      ? "relative rounded-xl border border-[var(--lime)] bg-[var(--lime)]/5 p-4"
                      : isDone
                        ? "rounded-xl border border-[var(--hairline-soft)] bg-white/20 p-4 opacity-70"
                        : "rounded-xl border border-[var(--hairline)] bg-white/30 p-4"
                  }
                >
                  {isActive && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[var(--lime)] px-2 py-0.5 text-[0.56rem] font-medium uppercase tracking-wide text-white">
                      <span className="inline-block h-1 w-1 animate-pulse rounded-full bg-white" />
                      in progress
                    </span>
                  )}
                  <div className="mb-3 flex items-baseline justify-between gap-3">
                    <span className="meta text-[var(--violet)]">week {week.week}</span>
                    <span className="h-px flex-1 bg-[var(--hairline-soft)]" />
                  </div>
                  <h3 className="font-display text-lg leading-tight text-ink">{week.theme}</h3>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {week.streams.map((streamId) => (
                      <span
                        key={`${week.week}-${streamId}`}
                        className="meta rounded border border-[var(--hairline)] bg-white/35 px-1.5 py-0.5 text-[0.56rem] text-slate"
                      >
                        {streamMap[streamId]?.code ?? streamId}
                      </span>
                    ))}
                  </div>
                  <div className="mt-3 grid gap-3">
                    <div>
                      <div className="meta mb-1 text-slate">learn</div>
                      <p className="text-xs leading-relaxed text-ink-soft">{week.learn.join(" / ")}</p>
                    </div>
                    <div>
                      <div className="meta mb-1 text-slate">build</div>
                      <p className="text-xs leading-relaxed text-ink-soft">{week.build.join(" / ")}</p>
                    </div>
                  </div>
                  <p className="mt-3 border-t border-[var(--hairline-soft)] pt-3 text-xs leading-relaxed text-[var(--violet)]">
                    {week.output}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
