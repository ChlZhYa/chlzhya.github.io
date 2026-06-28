"use client";

import Link from "next/link";

/**
 * LivingIndex — Support Agent Harness 的递进 sprint ladder。
 *
 * 3 个阶段（业务建模 / 核心能力 / 系统可靠性），从上到下形成执行路径。
 */

const STATUS_OPACITY = { active: 0.95, growing: 0.65, seedling: 0.4 } as const;

const RINGS = [
  { key: "inner", label: "phase 01", hint: "Agent 输入、输出与知识入口" },
  { key: "mid", label: "phase 02", hint: "工具、上下文与任务流程" },
  { key: "outer", label: "phase 03", hint: "可靠性、评估与协作" },
] as const;

const STATUS_LABEL = { active: "●", growing: "◐", seedling: "○" } as const;

type StreamLike = {
  id: string; name: string; code: string;
  status: keyof typeof STATUS_OPACITY;
  ring: "inner" | "mid" | "outer";
  summary: string;
};

export function LivingIndex({
  streams,
  selectedId,
}: {
  streams: StreamLike[];
  selectedId: string;
}) {
  return (
    <div className="flex min-h-[608px] flex-col gap-3 px-1 py-8 sm:px-2">
      {RINGS.map((ring, index) => {
        const items = streams.filter((s) => s.ring === ring.key);
        return (
          <div key={ring.key} className="relative grid flex-1 grid-cols-[2.5rem_1fr] gap-3">
            {index < RINGS.length - 1 && (
              <div className="absolute left-5 top-12 h-[calc(100%+0.75rem)] w-px bg-[var(--hairline)]" />
            )}
            <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--hairline)] bg-[var(--paper)] font-mono text-[0.72rem] font-bold text-[var(--lime)]">
              {index + 1}
            </div>
            <section className="flex flex-col rounded-xl border border-[var(--hairline)] bg-white/25 p-3">
              <div className="mb-3 flex items-baseline gap-2">
                <span className="meta text-[var(--lime)]">{ring.label}</span>
                <span className="text-[0.72rem] leading-tight text-slate">{ring.hint}</span>
                <span className="meta ml-auto tabular-nums text-slate">{items.length}</span>
              </div>
              <div className="grid flex-1 content-start gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {items.map((s) => {
                  const isSel = s.id === selectedId;
                  const dim = !isSel;
                  const opacity = dim ? STATUS_OPACITY[s.status] : 1;
                  return (
                    <Link
                      key={s.id}
                      href={`/workbench?stream=${s.id}`}
                      replace
                      scroll={false}
                      className="group relative flex min-h-[4.5rem] flex-col items-start justify-between rounded-lg border p-3 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--lime)]"
                      style={{
                        background: isSel ? "var(--lime)" : "rgba(255,255,255,0.35)",
                        borderColor: isSel ? "var(--lime)" : "var(--hairline)",
                        opacity,
                        boxShadow: isSel ? "0 6px 20px -6px var(--lime)" : "none",
                      }}
                      aria-current={isSel ? "page" : undefined}
                    >
                      <span className="flex w-full items-center gap-2">
                        <span
                          className="text-[0.7rem] leading-none"
                          style={{ color: isSel ? "var(--void)" : "var(--slate)" }}
                        >
                          {STATUS_LABEL[s.status]}
                        </span>
                        <span
                          className="font-display text-[0.95rem] font-semibold leading-tight"
                          style={{ color: isSel ? "var(--void)" : "var(--ink)" }}
                        >
                          {s.name}
                        </span>
                      </span>
                      <span
                        className="meta rounded px-1.5 py-0.5 text-[0.58rem]"
                        style={
                          isSel
                            ? { background: "var(--void)", color: "var(--lime)" }
                            : { background: "var(--hairline)", color: "var(--ink-soft)" }
                        }
                      >
                        {s.code}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </section>
          </div>
        );
      })}
    </div>
  );
}
