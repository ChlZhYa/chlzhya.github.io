"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { Trip } from "@/content/travel";

const E = [0.22, 1, 0.36, 1] as const;

/**
 * ItineraryTimeline — 按天的行程时间线。
 * 左侧一条竖向发丝线，每个节点是一个行程要点。
 */
export function ItineraryTimeline({ trip }: { trip: Trip }) {
  const reduce = useReducedMotion();
  const items = trip.itinerary ?? [];

  if (items.length === 0) return null;

  return (
    <div>
      <div className="meta mb-5 flex items-center gap-2">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
        itinerary · {trip.days} days
      </div>
      <ol className="relative ml-2 border-l border-[var(--hairline)] pl-6">
        {items.map((it, i) => (
          <motion.li
            key={i}
            initial={reduce ? false : { opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: E, delay: reduce ? 0 : i * 0.08 }}
            className="relative pb-7 last:pb-0"
          >
            {/* 节点圆点 */}
            <span className="absolute -left-[31px] top-1 flex h-3 w-3 items-center justify-center rounded-full border-2 border-[var(--lime)] bg-[var(--paper)]" />
            <div className="flex items-baseline gap-3">
              <span className="meta w-12 shrink-0 tabular-nums text-[var(--lime)]">
                day {String(it.day).padStart(2, "0")}
              </span>
              <span className="font-display text-lg leading-tight text-ink">
                {it.title}
              </span>
            </div>
            {it.note && (
              <p className="mt-1.5 max-w-[52ch] pl-[4.1rem] text-sm leading-relaxed text-ink-soft">
                {it.note}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
