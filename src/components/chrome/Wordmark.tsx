"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";

/**
 * ChlZhYa — 熔合式抽象字标。
 *
 * 设计目标：一眼看不出原字母。把 7 个字母的笔画完全打散、
 * 重新熔合成 3 条连续抽象曲线，靠走势 + 节奏 + 留白构成独特印记，
 * 而非 7 个可辨识的字母单元。读起来像抽象几何符号。
 *
 *   线 1（主轴·荧光）：起弧 → 折角 → 贯穿 → 分叉节点
 *   线 2（冠饰）：上方小弧
 *   线 3（基底）：短弧 + 闭合圆
 */

const E = [0.22, 1, 0.36, 1] as const;

const PATHS: { d: string; accent?: boolean }[] = [
  // 主轴：起弧 → 折角 → 贯穿 → 分叉
  {
    d: "M8 16 A12 12 0 0 1 20 6 L36 6 L24 20 L48 20 L36 34 L60 22 L54 10 M60 22 L66 34 M60 22 L54 10",
    accent: true,
  },
  // 冠饰：上方小弧
  { d: "M28 4 A6 6 0 0 1 40 4" },
  // 基底：短弧 + 闭合圆
  { d: "M72 28 A8 8 0 1 0 80 36 L74 36 M88 22 A7 7 0 1 0 88 36" },
];

export function Wordmark({
  size = "md",
  animated = true,
}: {
  size?: "sm" | "md" | "lg" | "xl";
  animated?: boolean;
}) {
  const reduce = useReducedMotion();
  const dims: Record<string, { w: string; h: string }> = {
    sm: { w: "w-[3.8rem]", h: "h-5" },
    md: { w: "w-[5.8rem]", h: "h-8" },
    lg: { w: "w-[9.5rem]", h: "h-12" },
    xl: { w: "w-[clamp(13rem,28vw,23rem)]", h: "h-[clamp(3.6rem,8.5vw,7.2rem)]" },
  };
  const d = dims[size];

  return (
    <span
      className={`inline-flex items-center ${d.h} ${d.w} text-ink`}
      aria-label="ChlZhYa"
      role="img"
    >
      <svg
        viewBox="0 0 120 40"
        className="h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="wm-gradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--lime)" />
            <stop offset="100%" stopColor="var(--violet)" />
          </linearGradient>
        </defs>
        {PATHS.map((p, i) =>
          animated && !reduce ? (
            <motion.path
              key={i}
              d={p.d}
              stroke={p.accent ? "url(#wm-gradient)" : "currentColor"}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1 + i * 0.2, ease: E, delay: i * 0.25 }}
            />
          ) : (
            <path
              key={i}
              d={p.d}
              stroke={p.accent ? "url(#wm-gradient)" : "currentColor"}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ),
        )}
      </svg>
    </span>
  );
}

/** 可点击的字标按钮（页头左上） */
export function WordmarkButton({
  onClick,
  expanded,
}: {
  onClick: () => void;
  expanded: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open site index"
      aria-expanded={expanded}
      className="group flex items-center gap-2.5"
    >
      <Wordmark size="sm" animated={false} />
      <span
        aria-hidden
        className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
          expanded
            ? "scale-150 bg-[var(--lime)]"
            : "scale-100 bg-[var(--slate)] opacity-60 group-hover:bg-[var(--lime)]"
        }`}
      />
    </button>
  );
}

/** 角落信标 monogram（单一荧光分叉节点，可做 favicon） */
export function Monogram({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" aria-hidden="true">
      <motion.path
        d="M20 10 L20 30 M20 22 L11 11 M20 22 L29 11"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/** 点击跳首页的字标（备用） */
export function WordmarkLink() {
  return (
    <Link href="/" aria-label="Back to home">
      <Wordmark size="md" animated />
    </Link>
  );
}
