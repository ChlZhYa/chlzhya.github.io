import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trips } from "../content/travel";
import type { Trip } from "../content/travel";

const N = trips.length;
const STEP_DEG = 360 / N; // 相邻卡片在圆周方向上的夹角
const CARD_W = 240; // 卡片宽（沿轴向）
const CARD_H = 300; // 卡片高

function radiusFor(count: number, cardHeight: number): number {
  // 沿水平轴排成正多边形，按卡片高度算半径，留缝隙
  return cardHeight / (2 * Math.tan(Math.PI / count)) + 24;
}

// 中央水平圆柱体由多少薄圆盘拼成
const CORE_RINGS = 16;

export default function CylinderGallery() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const radius = useMemo(() => radiusFor(N, CARD_H), []);

  // 滚动驱动：rotation(旋转) + 整体下沉(translateY)
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
      const progress = Math.min(1, Math.max(0, scrolled / total));
      setRotation(progress * 360);
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

  // 当前正前方（最靠观察者）的卡片
  useEffect(() => {
    const norm = ((rotation % 360) + 360) % 360;
    let best = 0;
    let bestDelta = Infinity;
    for (let i = 0; i < N; i++) {
      const cardAngle = (i * STEP_DEG) % 360;
      let delta = Math.abs(norm - cardAngle);
      delta = Math.min(delta, 360 - delta);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = i;
      }
    }
    setActiveIndex(best);
  }, [rotation]);

  // 每张卡片当前相对正前方的角度差，用于判断是否在背面
  const cardState = (i: number): "front" | "back" => {
    const norm = ((rotation % 360) + 360) % 360;
    const cardAngle = (i * STEP_DEG + norm) % 360;
    // 卡片绕水平轴：0° 在正前方，180° 在正后方。90~270 视为背面。
    return cardAngle > 90 && cardAngle < 270 ? "back" : "front";
  };

  const rings = Array.from({ length: CORE_RINGS }, (_, i) => i);

  return (
    <div className="cylinder-stage" ref={stageRef}>
      <div className="cylinder-scene" style={{ ["--radius" as string]: `${radius}px` }}>
        {/* —— 中央水平 3D 圆柱体 —— */}
        <div className="spine-3d" aria-hidden="true" style={{ width: `${CARD_W * 2.6}px` }}>
          {/* 左 / 右端盖 */}
          <div className="spine-cap cap-left" />
          <div className="spine-cap cap-right" />
          {/* 内核辉光（沿水平轴的光柱） */}
          <div className="spine-core" />
          {/* 沿水平轴排列的薄圆盘，拼成圆柱体表面 */}
          {rings.map((i) => (
            <div
              key={i}
              className="spine-ring"
              style={{ left: `${(i / (CORE_RINGS - 1)) * 100}%` }}
            />
          ))}
        </div>

        {/* —— 卡片滚筒：整体随滚动旋转 + 下沉 —— */}
        <div
          className="cylinder-ring"
          style={{
            transform: `translateY(${reducedMotion ? 0 : (rotation / 360) * 360}px) rotateX(${
              reducedMotion ? 0 : rotation
            }deg)`,
          }}
        >
          {trips.map((trip, i) => (
            <CylinderCard
              key={trip.slug}
              trip={trip}
              index={i}
              active={i === activeIndex}
              face={cardState(i)}
              radius={radius}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CylinderCard({
  trip,
  index,
  active,
  face,
  radius,
}: {
  trip: Trip;
  index: number;
  active: boolean;
  face: "front" | "back";
  radius: number;
}) {
  const isPlaceholder = trip.status === "placeholder";
  return (
    <Link
      className={`cyl-card ${active ? "is-front" : ""} ${face === "back" ? "is-back" : ""} ${
        isPlaceholder ? "is-placeholder" : ""
      }`}
      to={`/travel/${trip.slug}`}
      style={{ transform: `rotateX(${index * STEP_DEG}deg) translateZ(${radius}px)` }}
      aria-label={`${trip.title} · 查看行程`}
    >
      <div className="cyl-cover">
        <img src={trip.cover} alt={trip.title} loading="lazy" />
        <div className="cyl-shade" />
        {isPlaceholder ? <span className="cyl-badge">待补充</span> : <span className="cyl-badge ready">已记录</span>}
      </div>
      <div className="cyl-info">
        <span className="cyl-period">{trip.period}</span>
        <h3>{trip.title}</h3>
        <p>{trip.summary}</p>
      </div>
    </Link>
  );
}
