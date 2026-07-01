"use client";

import Link from "next/link";

/**
 * LivingIndex — Agent Harness 双项目的同心环辐射图。
 *
 * 设计语言：10 个 stream 不是等数分组，而是从核心接口向外辐射的能力递进。
 * 三个同心环（inner/mid/outer）按真实数量分布节点（3-3-4），不强行对称——
 * 环上节点不均匀反而自然，因为它如实反映了"外层最厚（可靠性是生产级重头）"。
 *
 * 结构：中央核（RUN）→ 内环（接口）→ 中环（能力）→ 外环（可靠性）。
 */

const STATUS_OPACITY = { active: 0.95, growing: 0.65, seedling: 0.4 } as const;
const STATUS_LABEL = { active: "●", growing: "◐", seedling: "○" } as const;

type RingKey = "inner" | "mid" | "outer";

const RING_META: Record<RingKey, { label: string; hint: string }> = {
  inner: { label: "phase 01 · 接口", hint: "Agent 如何感知与表达" },
  mid: { label: "phase 02 · 能力", hint: "Agent 用什么干活" },
  outer: { label: "phase 03 · 可靠性", hint: "Agent 如何被信任" },
};

type StreamLike = {
  id: string;
  name: string;
  code: string;
  status: keyof typeof STATUS_OPACITY;
  ring: RingKey;
  summary: string;
};

// 视口与几何参数
const VB = 600; // viewBox 尺寸
const CX = VB / 2; // 圆心 x
const CY = VB / 2; // 圆心 y
const RADII: Record<RingKey, number> = {
  inner: 110,
  mid: 200,
  outer: 285,
};
const NODE_R = 34; // 节点半径

/**
 * 计算某环上第 i 个（共 n 个）节点的角度（度），起点在正上 -90°，顺时针。
 * 为避免内外环节点完全对齐成一条辐射线，给不同环一个偏移角。
 */
function nodeAngle(i: number, n: number, ring: RingKey): number {
  const step = 360 / n;
  const base = -90; // 正上方起点
  const offset = ring === "mid" ? step / 2 : ring === "outer" ? step / 3 : 0;
  return base + offset + i * step;
}

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function LivingIndex({
  streams,
  selectedId,
}: {
  streams: StreamLike[];
  selectedId: string;
}) {
  const byRing = (k: RingKey) => streams.filter((s) => s.ring === k);
  const inner = byRing("inner");
  const mid = byRing("mid");
  const outer = byRing("outer");

  const place = (list: StreamLike[], ring: RingKey) =>
    list.map((s, i) => {
      const angle = nodeAngle(i, list.length, ring);
      const { x, y } = polar(CX, CY, RADII[ring], angle);
      return { ...s, x, y, angle };
    });

  const innerNodes = place(inner, "inner");
  const midNodes = place(mid, "mid");
  const outerNodes = place(outer, "outer");

  return (
    <div className="flex min-h-[608px] items-center justify-center px-2 py-6">
      <svg
        viewBox={`0 0 ${VB} ${VB}`}
        className="h-full max-h-[600px] w-auto"
        role="img"
        aria-label="Agent 能力同心环图，10 个 stream 分三层：接口、能力、可靠性"
      >
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--lime)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--lime)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 三层同心环轨道 */}
        {(Object.keys(RADII) as RingKey[]).map((k) => (
          <circle
            key={k}
            cx={CX}
            cy={CY}
            r={RADII[k]}
            fill="none"
            stroke="var(--hairline)"
            strokeWidth={1}
            strokeDasharray={k === "inner" ? "0" : "3 5"}
          />
        ))}

        {/* 环标签：每个环顶部标注 */}
        {(Object.keys(RADII) as RingKey[]).map((k) => {
          const meta = RING_META[k];
          const r = RADII[k];
          return (
            <text
              key={k}
              x={CX}
              y={CY - r - 8}
              textAnchor="middle"
              className="fill-[var(--slate)] font-mono"
              style={{ fontSize: "10px", letterSpacing: "0.08em" }}
            >
              {meta.label}
            </text>
          );
        })}

        {/* 中心核：runtime 内核 */}
        <circle cx={CX} cy={CY} r={70} fill="url(#core-glow)" />
        <circle
          cx={CX}
          cy={CY}
          r={36}
          fill="var(--paper)"
          stroke="var(--lime)"
          strokeWidth={1.5}
        />
        <text
          x={CX}
          y={CY - 4}
          textAnchor="middle"
          className="fill-[var(--lime)] font-mono"
          style={{ fontSize: "10px", letterSpacing: "0.1em" }}
        >
          agent
        </text>
        <text
          x={CX}
          y={CY + 12}
          textAnchor="middle"
          className="fill-[var(--ink)] font-display"
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          runtime
        </text>

        {/* 选中节点到中心的射线（仅选中时） */}
        {[...innerNodes, ...midNodes, ...outerNodes].map((n) =>
          n.id === selectedId ? (
            <line
              key={`ray-${n.id}`}
              x1={CX}
              y1={CY}
              x2={n.x}
              y2={n.y}
              stroke="var(--lime)"
              strokeWidth={1}
              strokeOpacity={0.5}
            />
          ) : null,
        )}

        {/* 渲染节点 */}
        {[...innerNodes, ...midNodes, ...outerNodes].map((n) => {
          const isSel = n.id === selectedId;
          const opacity = isSel ? 1 : STATUS_OPACITY[n.status];
          return (
            <g key={n.id} style={{ opacity, cursor: "pointer" }}>
              <Link href={`/workbench?stream=${n.id}`} replace scroll={false}>
                <title>{`${n.code} · ${n.name}`}</title>
                  {/* 节点底圆 */}
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={isSel ? NODE_R + 3 : NODE_R}
                    fill={isSel ? "var(--lime)" : "var(--paper)"}
                    stroke={isSel ? "var(--lime)" : "var(--hairline)"}
                    strokeWidth={isSel ? 0 : 1}
                    style={
                      isSel
                        ? { filter: "drop-shadow(0 0 10px rgba(37,99,235,0.45))" }
                        : undefined
                    }
                    className="transition-all duration-300"
                  />
                  {/* 状态点 */}
                  <text
                    x={n.x}
                    y={n.y - 16}
                    textAnchor="middle"
                    style={{ fontSize: "11px" }}
                    fill={isSel ? "var(--void)" : "var(--slate)"}
                  >
                    {STATUS_LABEL[n.status]}
                  </text>
                  {/* 代号 */}
                  <text
                    x={n.x}
                    y={n.y + 2}
                    textAnchor="middle"
                    className="font-mono"
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      fill: isSel ? "var(--void)" : "var(--ink)",
                    }}
                  >
                    {n.code}
                  </text>
                  {/* 名称（小字） */}
                  <text
                    x={n.x}
                    y={n.y + 16}
                    textAnchor="middle"
                    style={{
                      fontSize: "8px",
                      fill: isSel ? "var(--void)" : "var(--slate)",
                    }}
                  >
                    {n.name.length > 14 ? n.name.slice(0, 13) + "…" : n.name}
                  </text>
              </Link>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
