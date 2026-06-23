import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trips } from "../content/travel";
import type { Trip } from "../content/travel";

const N = trips.length;
const STEP_DEG = 74;
const STEP_Y = 340;
const RADIUS = 300;
const SPIRAL_TURNS = Math.max(1, N - 1);

export default function CylinderGallery() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // 滚动驱动：纵向螺旋的旋转、下沉和当前看板。
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const scrolled = -rect.top;
      const nextProgress = Math.min(1, Math.max(0, scrolled / total));
      setProgress(nextProgress);
      setActiveIndex(Math.min(N - 1, Math.max(0, Math.round(nextProgress * SPIRAL_TURNS))));
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  const scrollValue = reducedMotion ? activeIndex : progress * SPIRAL_TURNS;
  const rotation = -scrollValue * STEP_DEG;
  const descent = -scrollValue * STEP_Y;
  const timelineProgress = reducedMotion ? 0 : progress * 100;

  return (
    <div
      className="helix-stage"
      ref={stageRef}
      style={{ ["--timeline-progress" as string]: `${timelineProgress}%` }}
    >
      <div className="helix-scene">
        <div className="helix-axis" aria-hidden="true">
          <span className="axis-light" />
          {trips.map((trip, index) => (
            <span
              className={`axis-marker ${index === activeIndex ? "is-active" : ""}`}
              key={trip.slug}
              style={{ top: `${10 + (index / Math.max(1, N - 1)) * 78}%` }}
            >
              <strong>{trip.period}</strong>
              <small>{trip.title.replace("计划", "").replace("清单", "")}</small>
            </span>
          ))}
        </div>

        <div
          className="helix-world"
          style={{
            ["--helix-rotation" as string]: `${rotation}deg`,
            ["--helix-y" as string]: `${descent}px`,
            ["--helix-radius" as string]: `${RADIUS}px`,
          }}
        >
          <div className="helix-core" aria-hidden="true" />
          <div className="helix-rail rail-a" aria-hidden="true" />
          <div className="helix-rail rail-b" aria-hidden="true" />
          <div className="helix-rail rail-c" aria-hidden="true" />
          {trips.map((trip, index) => (
            <TimePillar key={`${trip.slug}-time`} trip={trip} index={index} active={index === activeIndex} />
          ))}
          {trips.map((trip, i) => (
            <HelixCard
              key={trip.slug}
              trip={trip}
              index={i}
              active={i === activeIndex}
              focusDistance={Math.abs(i - scrollValue)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function TimePillar({ trip, index, active }: { trip: Trip; index: number; active: boolean }) {
  return (
    <div
      className={`time-pillar ${active ? "is-active" : ""}`}
      style={{
        ["--item-angle" as string]: `${index * STEP_DEG + 28}deg`,
        ["--item-y" as string]: `${index * STEP_Y}px`,
      }}
      aria-hidden="true"
    >
      <span>{trip.period}</span>
    </div>
  );
}

function HelixCard({ trip, index, active, focusDistance }: {
  trip: Trip;
  index: number;
  active: boolean;
  focusDistance: number;
}) {
  const isPlaceholder = trip.status === "placeholder";
  const clampedDistance = Math.min(2.4, focusDistance);
  const opacity = Math.max(0.16, 1 - clampedDistance * 0.32);
  const scale = Math.max(0.92, 1 - clampedDistance * 0.025);
  const blur = Math.min(2.4, clampedDistance * 0.7);
  const saturate = 0.72 + opacity * 0.34;
  const brightness = 0.9 + opacity * 0.1;
  return (
    <Link
      className={`helix-card ${active ? "is-front" : ""} ${isPlaceholder ? "is-placeholder" : ""}`}
      to={`/travel/${trip.slug}`}
      style={{
        ["--item-angle" as string]: `${index * STEP_DEG}deg`,
        ["--item-y" as string]: `${index * STEP_Y}px`,
        ["--card-opacity" as string]: opacity.toFixed(3),
        ["--card-scale" as string]: scale.toFixed(3),
        ["--card-blur" as string]: `${blur.toFixed(2)}px`,
        ["--card-saturate" as string]: saturate.toFixed(3),
        ["--card-brightness" as string]: brightness.toFixed(3),
      }}
      aria-label={`${trip.title} · 查看行程`}
    >
      <div className="helix-cover">
        <img src={trip.cover} alt={trip.title} loading="lazy" />
        <div className="helix-shade" />
        {isPlaceholder ? <span className="helix-badge">待补充</span> : <span className="helix-badge ready">已记录</span>}
        <span className="helix-node-index">节点 {String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="helix-info">
        <span className="helix-period">{trip.period}</span>
        <h3>{trip.title}</h3>
        <p>{trip.summary}</p>
        <span className="helix-open">查看行程</span>
      </div>
    </Link>
  );
}
