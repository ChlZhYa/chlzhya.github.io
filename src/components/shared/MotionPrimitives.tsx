"use client";

import { motion, type Variants } from "framer-motion";
import { ease } from "@/design/tokens";
import type { ReactNode } from "react";

/**
 * 共享动效原语。
 * 全站统一"有机生长/绽放"语言；reduced-motion 由 globals.css 兜底（时长压到 ~0）。
 */

/** 错落生长容器：子项 staggered 升起 */
export function Stagger({
  children,
  className,
  delay = 0,
  gap = 0.09,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  gap?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** 单个生长项 — 配合 <Stagger> 使用，或单独 animate */
export const growVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: ease.organic },
  },
};

export function Grow({
  children,
  className,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "span";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag className={className} variants={growVariants}>
      {children}
    </MotionTag>
  );
}

/** 简单的进场淡入升起（不依赖 Stagger） */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: ease.organic, delay }}
    >
      {children}
    </motion.div>
  );
}
