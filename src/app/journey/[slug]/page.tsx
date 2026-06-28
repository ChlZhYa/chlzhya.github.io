import Link from "next/link";
import { notFound } from "next/navigation";
import { PhotoGrid } from "@/components/journey/PhotoGrid";
import { ItineraryTimeline } from "@/components/journey/ItineraryTimeline";
import { Reveal } from "@/components/shared/MotionPrimitives";
import { trips, getTrip } from "@/content/travel";

/**
 * Journey 详情页 — /journey/[slug]
 * 封面 hero + 简介 + 照片网格 + 行程时间线。
 * 服务端渲染，静态生成所有 trip。
 */

export function generateStaticParams() {
  return trips.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  // params 是异步的（Next 15+）
  return params.then((p) => {
    const trip = getTrip(p.slug);
    return { title: trip ? trip.title : "Journey" };
  });
}

export default async function TripDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const trip = getTrip(slug);
  if (!trip) notFound();

  return (
    <div className="relative mx-auto min-h-[calc(100dvh-88px)] max-w-[1100px] px-6 pb-24 pt-8 sm:px-10">
      {/* 返回链接 */}
      <Reveal>
        <Link
          href="/journey"
          className="meta inline-flex items-center gap-2 text-slate transition-colors hover:text-ink"
        >
          <span className="inline-block h-px w-6 bg-current" />
          back to journey
        </Link>
      </Reveal>

      {/* Hero 区 */}
      <Reveal delay={0.1}>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="meta">{trip.period}</span>
            <h1 className="mt-2 font-display text-[clamp(2.4rem,6vw,4.5rem)] font-semibold leading-[0.95] text-ink">
              {trip.title}
            </h1>
            <p className="meta mt-3 text-slate">{trip.places}</p>
          </div>
          <div className="flex gap-6">
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--lime)]">{trip.days}</div>
              <div className="meta mt-1">days</div>
            </div>
            <div className="text-center">
              <div className="font-display text-3xl text-[var(--lime)]">{trip.photos.length}</div>
              <div className="meta mt-1">photos</div>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-ink-soft">
          {trip.summary}
        </p>
      </Reveal>

      {/* 封面大图 */}
      <Reveal delay={0.25}>
        <div className="mt-8 overflow-hidden rounded-2xl border border-[var(--hairline)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={trip.cover}
            alt={trip.title}
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
      </Reveal>

      {/* 行程时间线 */}
      {trip.itinerary && trip.itinerary.length > 0 && (
        <Reveal delay={0.1}>
          <section className="mt-14">
            <ItineraryTimeline trip={trip} />
          </section>
        </Reveal>
      )}

      {/* 照片网格 */}
      <section className="mt-14">
        <Reveal>
          <div className="meta mb-5 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--lime)]" />
            photos · {trip.photos.length} frames
          </div>
        </Reveal>
        <PhotoGrid photos={trip.photos} />
      </section>

      {/* 底部返回 */}
      <Reveal>
        <div className="mt-16 border-t border-[var(--hairline)] pt-6">
          <Link
            href="/journey"
            className="meta inline-flex items-center gap-2 text-slate transition-colors hover:text-ink"
          >
            <span className="inline-block h-px w-6 bg-current" />
            all trips
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
