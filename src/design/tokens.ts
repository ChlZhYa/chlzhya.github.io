/**
 * Open Field — central design tokens.
 * 方向：几何噪点流 — 近白底 + 流动噪点光晕 + 变体无衬线 + 单一荧光锚点。
 *
 * 反模板关键：只保留一个荧光色做全站锚点，砍掉多色调色板。
 */

export const palette = {
  /** 极浅蓝白底 — 冷色清爽 */
  paper: "#f0f9ff",
  mist: "#e0f2fe", // 面板/分隔（略深蓝白）
  void: "#1e293b", // 深石板灰 — 主文字与线条

  /** 文字层级（石板灰系） */
  ink: "#1e293b",
  inkSoft: "#475569",
  slate: "#64748b", // 次要文字（灰石板）

  /** 主强调 — 蓝 */
  lime: "#2563eb",
  /** 次强调 — 紫 */
  violet: "#7c3aed",

  /** 发丝线（基于石板灰） */
  hairline: "rgba(30, 41, 59, 0.12)",
  hairlineSoft: "rgba(30, 41, 59, 0.06)",
} as const;

/** 字体 CSS 变量名（由 layout.tsx 通过 next/font 注入） */
export const fonts = {
  display: "var(--font-display)", // Outfit — 超现代几何无衬线展示
  sans: "var(--font-sans)", // Inter — 正文
  mono: "var(--font-mono)", // JetBrains Mono — 数据/标签
} as const;

/** 字号阶梯 */
export const typeScale = {
  display: "clamp(3.2rem, 11vw, 9.5rem)",
  h1: "clamp(2.4rem, 6vw, 4.8rem)",
  h2: "clamp(1.6rem, 3.2vw, 2.6rem)",
  h3: "clamp(1.2rem, 1.8vw, 1.5rem)",
  body: "clamp(1rem, 1.05vw, 1.12rem)",
  small: "0.85rem",
  meta: "0.72rem",
} as const;

/** 缓动 */
export const ease = {
  organic: [0.22, 1, 0.36, 1] as const,
  soft: [0.45, 0, 0.15, 1] as const,
  sweep: [0.65, 0, 0.35, 1] as const,
} as const;

/** 三大支柱元信息（导航/页头复用）。颜色统一用 lime 锚点，靠代号区分。 */
export const pillars = [
  {
    key: "workbench",
    name: "Workbench",
    tagline: "Learning streams in AI & backend engineering.",
    code: "WB",
    path: "/workbench",
  },
  {
    key: "journey",
    name: "Journey",
    tagline: "Trips and the photos I brought back.",
    code: "JN",
    path: "/journey",
  },
  {
    key: "archive",
    name: "Archive",
    tagline: "Long-form notes from local markdown.",
    code: "AR",
    path: "/archive",
  },
] as const;

export type PillarKey = (typeof pillars)[number]["key"];
