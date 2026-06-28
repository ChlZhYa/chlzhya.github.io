import { SectionHead } from "@/components/shared/SectionHead";
import { Stagger } from "@/components/shared/MotionPrimitives";
import { TripCard } from "./TripCard";
import { trips } from "@/content/travel";

/**
 * Journey 列表页 — 行程按年分组。
 * trips 多了之后，按年份分组展示，避免一长串卡片向下堆叠无结构。
 */

/** 从 period（"2025 · Feb"）提取年份 */
function yearOf(period: string): string {
  const m = period.match(/^(\d{4})/);
  return m ? m[1] : "—";
}

/** 按 year 分组，年份降序 */
function groupByYear<T extends { period: string }>(items: T[]): { year: string; items: T[] }[] {
  const map = new Map<string, T[]>();
  for (const it of items) {
    const y = yearOf(it.period);
    if (!map.has(y)) map.set(y, []);
    map.get(y)!.push(it);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .map(([year, items]) => ({ year, items }));
}

export function JourneyView() {
  const groups = groupByYear(trips);

  return (
    <div className="relative mx-auto min-h-[calc(100dvh-88px)] max-w-[1400px] px-6 pb-24 pt-10 sm:px-10">
      <SectionHead
        kicker="02 · journey"
        title={<>trips &amp; <em className="not-italic text-[var(--lime)]">photos</em></>}
        intro="A simple record of the trips I've taken and the photos I brought back. Pick a trip to open its photos and day-by-day route."
      />

      {/* 按年分组 */}
      <div className="mt-12 flex flex-col gap-14">
        {groups.map((g) => (
          <section key={g.year}>
            {/* 年份标题 */}
            <div className="mb-6 flex items-baseline gap-4 border-b border-[var(--hairline)] pb-3">
              <h2 className="font-display text-4xl font-semibold text-ink">{g.year}</h2>
              <span className="meta text-slate">{g.items.length} {g.items.length === 1 ? "trip" : "trips"}</span>
            </div>
            {/* 该年行程卡片 */}
            <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3" gap={0.1}>
              {g.items.map((trip, i) => (
                <TripCard key={trip.id} trip={trip} index={i} />
              ))}
            </Stagger>
          </section>
        ))}
      </div>
    </div>
  );
}
