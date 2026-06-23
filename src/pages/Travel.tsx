import CylinderGallery from "../components/CylinderGallery";
import ParticlesBackground from "../components/ParticlesBackground";
import { SectionLabel } from "../components/shared";
import { trips } from "../content/travel";

export default function Travel() {
  return (
    <section className="content-section travel section-anchor">
      <ParticlesBackground theme="travel" />
      <div className="travel-hero-copy">
        <div className="travel-tech-mark" aria-hidden="true">
          <span />
          <span />
        </div>
        <SectionLabel index="02" label="旅行" />
        <div className="section-heading reveal">
          <h2>旅行轨迹</h2>
          <p>以时间为轴，把每段路线压缩成可回放的空间记录。</p>
        </div>
        <div className="travel-telemetry travel-metrics reveal" aria-label="旅行页面状态">
          <span><strong>{String(trips.length).padStart(2, "0")}</strong>旅行记录</span>
          <span><strong>12</strong>目的地</span>
          <span><strong>28</strong>行程天数</span>
        </div>
        <div className="travel-scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <b />
        </div>
      </div>
      <div className="travel-mode-hud" aria-hidden="true">
        <span>TRAVEL MODE</span>
        <i />
      </div>

      <CylinderGallery />
      <div className="travel-next-panel" aria-hidden="true">
        <strong>02</strong>
        <span>NEXT SECTION</span>
        <b>目的地地图</b>
      </div>
    </section>
  );
}
