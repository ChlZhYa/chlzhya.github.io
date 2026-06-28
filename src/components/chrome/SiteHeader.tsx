"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { nav } from "@/content/site.config";
import { WordmarkButton } from "./Wordmark";
import { useEffect, useState } from "react";

/**
 * SiteHeader — 常驻页头导航（非模板）。
 *
 * 设计点（区别于通用个人站模板）：
 *  - 不是居中胶囊、不是透明叠加条。而是一条贯穿顶部的"发丝线 + 代号"结构。
 *  - 左：几何字标（点击触发命令面板式索引覆盖层）。
 *  - 中：一条会随当前路由"拉伸"的发丝线（active 段高亮荧光）。
 *  - 右：三大支柱用 WB/JN/AR 代号 + 全名，悬停时代号被荧光块"标记"。
 *  - 整条悬浮在内容之上，极薄、半透雾色，滚动时收缩高度。
 */

export function SiteHeader() {
  const pathname = usePathname();
  const [indexOpen, setIndexOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // 滚动检测：滚动后页头加实底 + 收缩，避免内容穿透被"挡"
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-[var(--hairline)] bg-[var(--paper)]/90 backdrop-blur-xl"
            : "border-b border-[var(--hairline-soft)] bg-[var(--paper)]/70 backdrop-blur-md"
        }`}
      >
        <div
          className={`mx-auto flex max-w-[1400px] items-center gap-6 px-6 transition-all duration-300 sm:px-10 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          {/* 左：字标 */}
          <WordmarkButton
            onClick={() => setIndexOpen((o) => !o)}
            expanded={indexOpen}
          />

          {/* 中：随路由拉伸的发丝线 */}
          <div className="relative hidden h-px flex-1 bg-[var(--hairline)] sm:block">
            <motion.div
              className="absolute inset-y-0 left-0 bg-[var(--lime)]"
              initial={false}
              animate={{ width: `${activeRatio(pathname) * 100}%` }}
              transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
            />
          </div>

          {/* 右：三支柱代号导航 */}
          <nav className="flex items-center gap-1 sm:gap-2">
            {nav.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group relative flex items-center gap-2 rounded-md px-2.5 py-1.5 sm:px-3"
                >
                  {/* 悬停/激活时代号被荧光块标记 */}
                  <span
                    className={`meta transition-colors duration-300 ${
                      active
                        ? "text-ink"
                        : "text-slate group-hover:text-ink"
                    }`}
                  >
                    <span
                      className={`mr-1.5 inline-block rounded px-1 transition-colors duration-300 ${
                        active || "group-hover:bg-[var(--lime)] group-hover:text-void"
                      }`}
                      style={
                        active
                          ? { background: "var(--lime)", color: "var(--void)" }
                          : undefined
                      }
                    >
                      {item.code}
                    </span>
                    <span className="hidden md:inline">{item.label}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* 命令面板式索引覆盖层（点字标触发，区别于普通页头） */}
      <AnimatePresence>
        {indexOpen && (
          <IndexOverlay
            key="index-overlay"
            onClose={() => setIndexOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** 当前路由对应的发丝线填充比例 */
function activeRatio(path: string): number {
  if (path === "/" || path === "") return 0;
  if (path.startsWith("/workbench")) return 0.34;
  if (path.startsWith("/journey")) return 0.67;
  if (path.startsWith("/archive")) return 1;
  return 0;
}

/**
 * 索引覆盖层 — 命令面板式（非侧边抽屉）。
 * 点字标才打开，给一个更沉浸的"全站入口"瞬间。
 */
function IndexOverlay({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
    >
      <button
        type="button"
        aria-label="Close index"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-[var(--void)]/30 backdrop-blur-[4px]"
      />
      <motion.div
        className="relative z-10 w-[min(680px,100%)] overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--paper)] shadow-[var(--shadow-panel)]"
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 顶部 — 像命令面板的输入条 */}
        <div className="flex items-center gap-3 border-b border-[var(--hairline)] px-6 py-4">
          <span className="meta text-slate">›</span>
          <span className="meta text-ink">jump to</span>
          <span className="meta ml-auto text-slate">esc to close</span>
        </div>

        {/* 三入口 */}
        <nav className="flex flex-col p-3">
          {nav.map((item, i) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="group flex items-center gap-4 rounded-xl px-4 py-4 transition-colors hover:bg-[var(--mist)]"
              >
                <span className="meta w-6 text-slate">{i + 1}</span>
                <span
                  className="inline-block rounded px-1.5 py-0.5 text-[0.68rem] font-bold tracking-wider transition-colors"
                  style={
                    active
                      ? { background: "var(--lime)", color: "var(--void)" }
                      : { background: "var(--hairline)", color: "var(--ink-soft)" }
                  }
                >
                  {item.code}
                </span>
                <span className="flex flex-1 flex-col">
                  <span className="font-display text-2xl leading-none text-ink">
                    {item.label}
                  </span>
                  <span className="mt-1 text-sm text-slate">{item.tagline}</span>
                </span>
                <span className="meta text-slate transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink">
                  ↵
                </span>
              </Link>
            );
          })}
        </nav>
      </motion.div>
    </motion.div>
  );
}
