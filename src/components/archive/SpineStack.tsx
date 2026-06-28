"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { PostMeta } from "@/lib/posts";

const E = [0.22, 1, 0.36, 1] as const;

/**
 * SpineStack — 书脊栈索引视觉。
 * 文章是一排窄书脊；悬停把某一册"抽出"，显示预览。
 * 与传统文章列表的区别：用垂直书脊隐喻，强调"馆藏"而非"信息流"。
 */
export function SpineStack({ posts }: { posts: PostMeta[] }) {
  const reduce = useReducedMotion();

  return (
    <div className="flex items-end gap-1.5 overflow-x-auto pb-2 sm:gap-2">
      {posts.map((p, i) => {
        // 书脊高度交替，制造错落
        const h = i % 3 === 0 ? "h-44" : i % 3 === 1 ? "h-52" : "h-40";
        return (
          <motion.div
            key={p.slug}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: E, delay: reduce ? 0 : i * 0.06 }}
            className="group relative w-16 shrink-0 sm:w-20"
          >
            <Link
              href={`/archive/${p.slug}`}
              className={`flex ${h} w-full flex-col justify-between overflow-hidden rounded-md border border-[var(--hairline)] bg-[var(--mist)] p-2.5 transition-all duration-400 group-hover:-translate-y-2 group-hover:bg-[var(--lime)] group-hover:text-white`}
              title={p.title}
            >
              {/* 顶部：竖排标题 */}
              <span
                className="meta shrink-0"
                style={{
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                {p.title}
              </span>
              {/* 底部：日期 */}
              <span className="meta shrink-0 text-[0.6rem] opacity-70">
                {p.date}
              </span>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
