"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { FeedItem, RoadmapStep, Stream, WeeklyPlan } from "@/content/learning";

/**
 * StreamFeed — 选中路线后右侧的"关联内容汇总"。
 *
 * 当前阶段只展示真实可访问的学习资源。
 * 内容再多也不撑高整页。
 */

const E = [0.22, 1, 0.36, 1] as const;

const RESOURCE_KIND_LABEL: Record<NonNullable<FeedItem["resourceKind"]>, string> = {
  book: "BOOK",
  course: "COURSE",
  paper: "PAPER",
  doc: "DOC",
  repo: "REPO",
};

export function StreamFeed({
  stream,
  items,
  roadmap,
  weeks,
}: {
  stream: Stream;
  items: FeedItem[];
  roadmap: RoadmapStep[];
  weeks: WeeklyPlan[];
}) {
  const reduce = useReducedMotion();
  const resources = useMemo(
    () => items.filter((item) => item.kind === "resource" && item.href),
    [items],
  );

  return (
    <motion.div
      key={stream.id}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: E }}
      className="flex flex-col"
    >
      {/* 头部：路线标题 + 简介 */}
      <div className="shrink-0 border-b border-[var(--hairline)] pb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="meta">{stream.code} · stream</span>
            <h3 className="mt-2 font-display text-2xl leading-none text-ink">{stream.name}</h3>
          </div>
          <span
            className="mt-1 shrink-0 rounded px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wider"
            style={
              stream.status === "active"
                ? { background: "var(--lime)", color: "var(--void)" }
                : { background: "var(--hairline)", color: "var(--ink-soft)" }
            }
          >
            {stream.status}
          </span>
        </div>
        <p className="mt-2 max-w-[42ch] text-sm leading-relaxed text-ink-soft">{stream.summary}</p>
        {weeks.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {weeks.map((week) => (
              <span
                key={`${stream.id}-${week.week}`}
                className="meta rounded-full border border-[var(--hairline)] bg-white/35 px-2 py-1 text-[0.6rem] text-slate"
              >
                W{week.week}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 自然流：roadmap + resources，不再有内部滚动容器 */}
      {roadmap.length > 0 && (
        <div className="border-b border-[var(--hairline-soft)] py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="meta text-[var(--lime)]">roadmap</span>
            <span className="meta text-slate">{roadmap.length} moves</span>
          </div>
          <div className="flex flex-col gap-3">
            {roadmap.map((step) => (
              <div key={`${stream.id}-${step.phase}`} className="border-l border-[var(--hairline)] pl-3">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-display text-base font-semibold leading-tight text-ink">
                    {step.phase}
                  </span>
                  <span className="meta text-slate">{step.horizon}</span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-soft">{step.focus}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {step.deliverables.map((deliverable) => (
                    <span
                      key={deliverable}
                      className="rounded border border-[var(--hairline)] bg-white/35 px-2 py-1 text-[0.68rem] leading-tight text-slate"
                    >
                      {deliverable}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-[0.7rem] leading-relaxed text-[var(--violet)]">
                  面试信号：{step.interviewSignal}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex shrink-0 items-center justify-between gap-3 py-3">
        <span className="meta text-[var(--lime)]">recommended resources</span>
        <span className="meta text-slate">{resources.length} links</span>
      </div>

      <AnimatePresence mode="popLayout">
        {resources.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="meta py-6 text-center text-slate"
          >
            resources will be added when this stream becomes active.
          </motion.p>
        ) : (
          <ul className="flex flex-col">
            {resources.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: E, delay: reduce ? 0 : i * 0.04 }}
                className="group border-b border-[var(--hairline-soft)] py-3.5 last:border-0"
              >
                <div className="flex items-baseline gap-3">
                  {/* 类型标记 */}
                  <span
                    className="meta w-16 shrink-0"
                    style={{ color: "var(--violet)" }}
                  >
                    {item.resourceKind ? RESOURCE_KIND_LABEL[item.resourceKind] : "LINK"}
                  </span>
                  {/* 日期 */}
                  <span className="meta w-16 shrink-0 tabular-nums text-slate">{item.date}</span>
                  {/* 标题 */}
                  <span className="flex-1">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      className="font-display text-base leading-tight text-ink transition-colors group-hover:text-[var(--lime)]"
                    >
                      {item.title}
                    </a>
                    {item.detail && (
                      <span className="mt-0.5 block text-xs leading-relaxed text-slate">
                        {item.detail}
                      </span>
                    )}
                  </span>
                  <span className="meta shrink-0 text-slate transition-colors group-hover:text-ink">↗</span>
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
