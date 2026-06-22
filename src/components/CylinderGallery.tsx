import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { trips } from "../content/travel";
import type { Trip } from "../content/travel";

// 圆柱几何
const STEP_DEG = 360 / trips.length; // 相邻卡片夹角

function radiusFor(count: number, cardWidth: number): number {
  return cardWidth / (2 * Math.tan(Math.PI / count)) + 28;
}

// 中央 3D 圆柱体由多少层薄圆环堆叠而成（越多越像光滑的管子）
const SPINE_RINGS = 18;

export default function CylinderGallery() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [rotation, setRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  const radius = useMemo(() => radiusFor(trips.length, 240), []);

  // 滚动驱动旋转
  useEffect(() => {
    if (reducedMotion) return;
    const stage = stageRef.current;
    if (!stage) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh;
      const scrolled = vh - rect.top;
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

  // 当前最靠前方的卡片 → 高亮时间节点
  useEffect(() => {
    const norm = ((rotation % 360) + 360) % 360;
    let best = 0;
    let bestDelta = Infinity;
    trips.forEach((_, i) => {
      const cardAngle = (i * STEP_DEG) % 360;
      let delta = Math.abs(norm - cardAngle);
      delta = Math.min(delta, 360 - delta);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = i;
      }
    });
    setActiveIndex(best);
  }, [rotation]);

  const rings = Array.from({ length: SPINE_RINGS }, (_, i) => i);

  return (
    <div className="cylinder-stage" ref={stageRef}>
      <div className="cylinder-scene" style={{ ["--radius" as string]: `${radius}px` }}>
        {/* —— 中央 3D 圆柱体（有深度的发光管）—— */}
        <div className="spine-3d" aria-hidden="true">
          {/* 顶 / 底端盖（旋转成水平的圆盘，给出圆柱体的开口厚度） */}
          <div className="spine-cap cap-top" />
          <div className="spine-cap cap-bottom" />
          {/* 内核辉光，比管身更亮，营造内部能量感 */}
          <div className="spine-core" />
          {/* 由多个薄圆环堆成的管壁，每个 rotateX(90) 变成水平圆环 */}
          {rings.map((i) => (
            <div
              key={i}
              className="spine-ring"
              style={{ transform: `translateY(${(i / (SPINE_RINGS - 1)) * 100 - 50}%) rotateX(90deg)` }}
            />
          ))}
          {/* 竖向时间轴标签：贴在圆柱体表面，随旋转一起转 */}
          <div
            className="spine-track"
            style={{ transform: `rotateY(${reducedMotion ? 0 : rotation}deg)` }}
          >
            {trips.map((trip, i) => (
              <div
                key={trip.slug}
                className={`spine-node ${i === activeIndex ? "is-active" : ""}`}
                style={{ top: `${(i / (trips.length - 1 || 1)) * 92 + 4}%` }}
              >
                <span className="spine-dot" />
                <span className="spine-label">
                  <strong>{trip.period}</strong>
                  <em>{trip.title}</em>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* —— 卡片环：绕竖轴排列，跟随滚动旋转 —— */}
        <div
          className="cylinder-ring"
          style={{
            transform: `translateZ(calc(var(--radius) * -1)) rotateY(${reducedMotion ? 0 : rotation}deg)`,
          }}
        >
          {trips.map((trip, i) => (
            <CylinderCard key={trip.slug} trip={trip} index={i} active={i === activeIndex} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CylinderCard({ trip, index, active }: { trip: Trip; index: number; active: boolean }) {
  const isPlaceholder = trip.status === "placeholder";
  return (
    <Link
      className={`cyl-card ${active ? "is-front" : ""} ${isPlaceholder ? "is-placeholder" : ""}`}
      to={`/travel/${trip.slug}`}
      style={{ transform: `rotateY(${index * STEP_DEG}deg) translateZ(var(--radius))` }}
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
