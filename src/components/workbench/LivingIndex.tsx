"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { FeedItem, RoadmapStep, Stream, WeeklyPlan } from "@/content/learning";
import { StreamFeed } from "./StreamFeed";

/**
 * LivingIndex — Agent Harness 双项目的递进轨道流（单栏叙事版）。
 *
 * 设计语言：10 个 stream 从核心接口纵向贯穿到外围可靠性，一条 lime→violet 渐变轨道
 * 串联三层 phase。选中某个 stream 后，详情面板在该 stream 所属 phase 下方就地展开，
 * 不再有固定右侧面板——导航与内容一体。
 */

const STATUS_OPACITY = { active: 0.95, growing: 0.65, seedling: 0.4 } as const;
const STATUS_LABEL = { active: "●", growing: "◐", seedling: "○" } as const;
const E = [0.22, 1, 0.36, 1] as const;

type RingKey = "inner" | "mid" | "outer";

const PHASES: { key: RingKey; label: string; sub: string; hint: string }[] = [
  { key: "inner", label: "phase 01", sub: "接口", hint: "Agent 如何感知与表达" },
  { key: "mid", label: "phase 02", sub: "能力", hint: "Agent 用什么干活" },
  { key: "outer", label: "phase 03", sub: "可靠性", hint: "Agent 如何被信任" },
];

type StreamLike = {
  id: string;
  name: string;
  code: string;
  status: keyof typeof STATUS_OPACITY;
  ring: RingKey;
  summary: string;
};

export function LivingIndex({
  streams,
  selectedId,
  selectedStream,
  feed,
  roadmap,
  weeks,
}: {
  streams: StreamLike[];
  selectedId: string;
  selectedStream: Stream;
  feed: FeedItem[];
  roadmap: RoadmapStep[];
  weeks: WeeklyPlan[];
}) {
  const reduce = useReducedMotion();
  const byRing = (k: RingKey) => streams.filter((s) => s.ring === k);

  return (
    <div className="flex flex-col gap-5 px-2 py-6 sm:px-4">
      {PHASES.map((phase, pi) => {
        const items = byRing(phase.key);
        const isPhaseExpanded = selectedStream.ring === phase.key;
        return (
          <div key={phase.key} className="relative grid grid-cols-[3rem_1fr] gap-3">
            {/* 左侧：phase 序号节点 + 贯穿渐变线 */}
            <div className="relative flex flex-col items-center">
              {/* 贯穿线：最后一层之下不画，其余贯穿到下一 phase */}
              {pi < PHASES.length - 1 && (
                <div
                  className="absolute top-10 bottom-[-1.25rem] w-[2px]"
                  style={{
                    background:
                      "linear-gradient(to bottom, var(--lime) 0%, var(--violet) 100%)",
                    opacity: 0.5,
                  }}
                />
              )}
              {/* 序号圆 */}
              <div
                className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-[1.5px] font-mono text-[0.78rem] font-bold"
                style={{
                  borderColor: "var(--lime)",
                  color: "var(--lime)",
                  background: "var(--paper)",
                }}
              >
                {pi + 1}
              </div>
            </div>

            {/* 右侧：phase 标签行 + 节点行 +（选中时）就地展开面板 */}
            <section className="rounded-xl border border-[var(--hairline)] bg-white/25 p-3">
              {/* phase 标签行：独占一行，永不被节点遮挡 */}
              <div className="mb-3 flex items-baseline gap-2 border-b border-[var(--hairline-soft)] pb-2">
                <span className="meta text-[var(--lime)]">{phase.label}</span>
                <span className="font-display text-sm font-semibold text-ink">
                  {phase.sub}
                </span>
                <span className="meta ml-auto text-slate">{phase.hint}</span>
              </div>

              {/* 节点行：flex 自适应，3 个或 4 个都整齐填满 */}
              <div className="flex flex-wrap gap-2">
                {items.map((s) => {
                  const isSel = s.id === selectedId;
                  const opacity = isSel ? 1 : STATUS_OPACITY[s.status];
                  return (
                    <Link
                      key={s.id}
                      href={`/workbench?stream=${s.id}`}
                      replace
                      scroll={false}
                      className="group relative flex min-w-[7.5rem] flex-1 items-center gap-2 rounded-lg border p-2.5 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lime)]"
                      style={{
                        background: isSel ? "var(--lime)" : "rgba(255,255,255,0.4)",
                        borderColor: isSel ? "var(--lime)" : "var(--hairline)",
                        opacity,
                        boxShadow: isSel ? "0 4px 14px -4px var(--lime)" : "none",
                      }}
                      aria-current={isSel ? "page" : undefined}
                      title={`${s.code} · ${s.name}`}
                    >
                      <span
                        className="text-[0.7rem] leading-none"
                        style={{ color: isSel ? "var(--void)" : "var(--slate)" }}
                      >
                        {STATUS_LABEL[s.status]}
                      </span>
                      <span className="flex flex-col">
                        <span
                          className="font-display text-[0.85rem] font-semibold leading-tight"
                          style={{ color: isSel ? "var(--void)" : "var(--ink)" }}
                        >
                          {s.name}
                        </span>
                        <span
                          className="meta mt-0.5"
                          style={{ color: isSel ? "var(--void)" : "var(--slate)" }}
                        >
                          {s.code}
                        </span>
                      </span>
                    </Link>
                  );
                })}
              </div>

              {/* 就地展开：选中 stream 属于该 phase 时渲染详情面板 */}
              <AnimatePresence initial={false}>
                {isPhaseExpanded && (
                  <motion.div
                    key={selectedStream.id}
                    initial={reduce ? false : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.32, ease: E }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 rounded-lg border border-[var(--hairline-soft)] bg-[var(--paper)]/50 p-4">
                      <StreamFeed
                        stream={selectedStream}
                        items={feed}
                        roadmap={roadmap}
                        weeks={weeks}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>
        );
      })}
    </div>
  );
}
