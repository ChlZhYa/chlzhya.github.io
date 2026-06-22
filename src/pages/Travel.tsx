import CylinderGallery from "../components/CylinderGallery";
import ParticlesBackground from "../components/ParticlesBackground";
import { SectionLabel } from "../components/shared";

export default function Travel() {
  return (
    <section className="content-section travel section-anchor">
      <ParticlesBackground theme="travel" />
      <SectionLabel index="02" label="旅行" />
      <div className="section-heading reveal">
        <h2>走过的路，会长成自己的故事。</h2>
        <p>每一次出行围成一圈。向下滚动让圆柱旋转，点击正前方的卡片查看行程。</p>
      </div>

      <CylinderGallery />
    </section>
  );
}
