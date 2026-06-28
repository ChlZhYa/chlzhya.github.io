"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/chrome/Wordmark";

/**
 * 水滴入湖面开屏。
 *
 * 设计语言：站点底色就是"湖面"（极浅蓝白纸），一滴墨（lime 锚点色）从上方落下，
 * 触水瞬间激起多层同心涟漪向外扩散，同时字标被"激活"绘制出来。
 * 涟漪收束后整屏淡出，无缝流向 workbench。
 *
 * 触发策略：同一会话仅首次播放（sessionStorage 记忆），之后直接跳转，避免反复打扰。
 * reduced-motion：不播动画，直接跳转。
 */
const SPLASH_KEY = "openfield:splash-seen";

const EASE_OUT_SOFT = [0.16, 1, 0.3, 1] as const;

/** 仅客户端、首次访问、非 reduced-motion 才播放 */
function shouldPlay(reduce: boolean | null): boolean {
  if (typeof window === "undefined") return false;
  if (reduce) return false;
  try {
    return !sessionStorage.getItem(SPLASH_KEY);
  } catch {
    return true;
  }
}

export function DropSplash() {
  const router = useRouter();
  const reduce = useReducedMotion();
  // lazy init：客户端首次渲染即决定是否播放，避免 effect 级联渲染。
  // reduce 在首渲为 null（未决），用 false 兜底，真正判定推迟到 effect 里按最终值跳转。
  const [play] = useState(() => shouldPlay(reduce ?? false));

  // 决定去路的副作用集中在一个 effect：跳转目标恒为 workbench
  useEffect(() => {
    if (play) return; // 播放时由另一个 effect 在动画末尾跳转
    const r = router;
    r.replace("/workbench");
  }, [play, router]);

  // 动画结束后：记忆 + 跳转
  useEffect(() => {
    if (!play) return;
    const t = setTimeout(() => {
      try {
        sessionStorage.setItem(SPLASH_KEY, "1");
      } catch {
        // ignore
      }
      router.replace("/workbench");
    }, 1700);
    return () => clearTimeout(t);
  }, [play, router]);

  // 不播放：占位空屏（跳转前避免闪现）
  if (!play) {
    return <div className="fixed inset-0 z-[100] bg-[var(--paper)]" aria-hidden />;
  }

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[var(--paper)]"
      initial={{ opacity: 1 }}
      // 末段整屏轻淡出，无缝交接给 workbench
      animate={{ opacity: [1, 1, 1, 0] }}
      transition={{ duration: 1.7, times: [0, 0.6, 0.8, 1], ease: EASE_OUT_SOFT }}
    >
      {/* 湖面噪点底（呼应全站几何噪点语言，极淡） */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(37,99,235,0.04) 0%, transparent 60%)",
        }}
      />

      <div className="relative flex items-center justify-center">
        {/* 同心涟漪：多层从中心向外扩散，错峰 */}
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="absolute rounded-full border"
            style={{
              borderColor: i % 2 === 0 ? "var(--lime)" : "var(--violet)",
              borderWidth: "1.5px",
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: ["0vmin", `${45 + i * 22}vmin`],
              height: ["0vmin", `${45 + i * 22}vmin`],
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: 1.5,
              delay: 0.25 + i * 0.18,
              ease: EASE_OUT_SOFT,
            }}
          />
        ))}

        {/* 水滴本体：从上方落下，触水后压缩消失，激发涟漪 */}
        <motion.span
          className="absolute z-10 h-3 w-3 rounded-full"
          style={{
            background: "linear-gradient(180deg, var(--lime), var(--violet))",
            boxShadow: "0 0 14px rgba(37,99,235,0.5)",
          }}
          initial={{ y: "-42vmin", scale: 1, opacity: 0 }}
          animate={{
            y: ["-42vmin", "0vmin", "0vmin"],
            scale: [1, 1, 0.2],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.7,
            times: [0, 0.8, 1],
            ease: [0.45, 0, 0.55, 1],
          }}
        />

        {/* 触水闪光：水滴落点的高光 */}
        <motion.span
          className="absolute z-20 h-1.5 w-1.5 rounded-full bg-white"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 6, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 0.5, delay: 0.56, ease: EASE_OUT_SOFT }}
          style={{ boxShadow: "0 0 12px rgba(255,255,255,0.9)" }}
        />

        {/* 字标：被涟漪"激活"，在水滴落下后绘制 */}
        <motion.div
          className="relative z-0 px-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.45 }}
        >
          <Wordmark size="xl" animated />
        </motion.div>
      </div>

      {/* 角标：极淡的进度暗示，让等待不突兀 */}
      <motion.span
        className="meta absolute bottom-8 left-1/2 -translate-x-1/2 text-[var(--slate)] opacity-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 1, delay: 0.85, ease: EASE_OUT_SOFT }}
      >
        entering workbench
      </motion.span>
    </motion.div>
  );
}
