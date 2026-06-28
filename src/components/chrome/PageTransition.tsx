"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * PageTransition — 路由切换时的轻量淡入。
 *
 * 为什么不用 AnimatePresence mode="wait" + exit？
 * App Router 自己管理导航，用 exit 会让旧页面"先播完动画再卸载"，
 * 造成点击后明显的停顿/重复感（"加载两次"的观感）。
 * 这里改为：路由一变，新内容立即挂载并淡入，不做 exit，更顺滑。
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <main
      key={pathname}
      className="relative z-10 min-h-dvh"
    >
      {children}
    </main>
  );
}
