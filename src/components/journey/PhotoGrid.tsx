"use client";

import { motion, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import type { Photo } from "@/content/travel";

/**
 * PhotoGrid — 错落照片网格 + 点击放大灯箱。
 * 照片用 CSS columns 实现瀑布流式错落（适合旅行照片的随性）。
 */

const E = [0.22, 1, 0.36, 1] as const;
/** 照片超过此数时折叠，避免详情页过长 */
const COLLAPSE_THRESHOLD = 12;

export function PhotoGrid({ photos }: { photos: Photo[] }) {
  const reduce = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  const shouldCollapse = photos.length > COLLAPSE_THRESHOLD;
  const visible = expanded ? photos : photos.slice(0, COLLAPSE_THRESHOLD);
  const hiddenCount = photos.length - COLLAPSE_THRESHOLD;

  return (
    <>
      <div className="columns-2 gap-3 [column-fill:_balance] md:columns-3 lg:gap-4">
        {visible.map((p, i) => (
          <motion.button
            key={p.id}
            type="button"
            onClick={() => setActive(i)}
            className="group relative mb-3 block w-full overflow-hidden rounded-xl border border-[var(--hairline)] bg-[var(--mist)] break-inside-avoid lg:mb-4"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, ease: E, delay: reduce ? 0 : (i % 6) * 0.06 }}
            aria-label={p.caption ? `Photo: ${p.caption}` : `Photo ${i + 1}`}
          >
            {/* 图片 */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={p.caption ?? ""}
              loading="lazy"
              className="w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
            {/* 图说覆盖层 */}
            {p.caption && (
              <div className="pointer-events-none absolute inset-0 flex items-end bg-gradient-to-t from-[var(--void)]/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="p-3 text-left text-xs font-medium text-white">
                  {p.caption}
                </span>
              </div>
            )}
            {/* 角标编号 */}
            <span className="meta pointer-events-none absolute right-2 top-2 rounded bg-[var(--void)]/55 px-1.5 py-0.5 text-[0.6rem] text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              {String(i + 1).padStart(2, "0")}
            </span>
          </motion.button>
        ))}
      </div>

      {/* 折叠时显示"展开全部"按钮 */}
      {shouldCollapse && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="meta inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] px-4 py-2 text-ink-soft transition-colors hover:border-[var(--lime)] hover:text-ink"
          >
            {expanded ? "show fewer" : `show all ${photos.length} · +${hiddenCount}`}
            <span className="transition-transform duration-300" style={{ transform: expanded ? "rotate(180deg)" : undefined }}>↓</span>
          </button>
        </div>
      )}

      {/* 灯箱 */}
      <AnimatePresence>
        {active !== null && (
          <Lightbox
            photos={photos}
            index={active}
            onClose={() => setActive(null)}
            onIndex={setActive}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/** Lightbox — 全屏查看 + 左右切换 */
function Lightbox({
  photos,
  index,
  onClose,
  onIndex,
}: {
  photos: Photo[];
  index: number;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const photo = photos[index];

  const prev = () => onIndex((index - 1 + photos.length) % photos.length);
  const next = () => onIndex((index + 1) % photos.length);

  // 键盘：esc 关闭，←/→ 切换
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, index, photos.length]);

  return (
    <motion.div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--void)]/85 p-4 backdrop-blur-md sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: [0.65, 0, 0.35, 1] }}
      onClick={onClose}
    >
      {/* 顶部栏 */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 sm:p-6">
        <span className="meta text-white/70">
          {index + 1} / {photos.length}
        </span>
        <button
          type="button"
          onClick={onClose}
          className="meta text-white/70 transition-colors hover:text-white"
          aria-label="Close"
        >
          close · esc
        </button>
      </div>

      {/* 左右切换 */}
      {photos.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:left-6"
            aria-label="Previous"
          >
            ←
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/20 sm:right-6"
            aria-label="Next"
          >
            →
          </button>
        </>
      )}

      {/* 图片 */}
      <motion.div
        key={photo.id}
        className="relative max-h-[82vh] max-w-[88vw]"
        initial={reduce ? false : { opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: E }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={photo.caption ?? ""}
          className="max-h-[82vh] max-w-[88vw] rounded-lg object-contain shadow-2xl"
        />
        {photo.caption && (
          <p className="mt-3 text-center text-sm text-white/80">{photo.caption}</p>
        )}
      </motion.div>
    </motion.div>
  );
}
