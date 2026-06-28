"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Trip } from "@/content/travel";

const E = [0.22, 1, 0.36, 1] as const;

/**
 * TripCard — 行程列表卡片。
 * 大封面 + 行程名 + 地点 + 时间 + 照片数。
 */
export function TripCard({ trip, index }: { trip: Trip; index: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, ease: E, delay: reduce ? 0 : index * 0.1 }}
    >
      <Link
        href={`/journey/${trip.slug}`}
        className="group block overflow-hidden rounded-2xl border border-[var(--hairline)] bg-[var(--paper)]/60 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(30,41,59,0.28)]"
      >
        {/* 封面 */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[var(--mist)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trip.cover}
            alt={trip.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--void)]/40 via-transparent to-transparent" />
          {/* 顶部代号 */}
          <span className="meta absolute left-4 top-4 rounded bg-[var(--paper)]/80 px-2 py-1 text-ink backdrop-blur-sm">
            trip {String(index + 1).padStart(2, "0")}
          </span>
          {/* 底部时间 */}
          <span className="meta absolute bottom-4 left-4 text-white">
            {trip.period}
          </span>
        </div>

        {/* 文本 */}
        <div className="p-6">
          <h3 className="font-display text-2xl leading-none text-ink transition-colors group-hover:text-[var(--lime)]">
            {trip.title}
          </h3>
          <p className="meta mt-2 text-slate">{trip.places}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            {trip.summary}
          </p>
          <div className="mt-5 flex items-center justify-between border-t border-[var(--hairline-soft)] pt-4">
            <span className="meta text-slate">
              {trip.photos.length} photos · {trip.days} days
            </span>
            <span className="meta inline-flex items-center gap-2 text-ink transition-all duration-300 group-hover:gap-3">
              open
              <span className="inline-block h-px w-5 bg-ink transition-all duration-300 group-hover:w-8 group-hover:bg-[var(--lime)]" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
