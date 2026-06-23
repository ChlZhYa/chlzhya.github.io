import { ArchiveList, SectionLabel } from "../components/shared";
import ParticlesBackground from "../components/ParticlesBackground";
import { learningConfig } from "../content/site.config";
import { learningArchive, learningPaths, resources } from "../content/learning";

export default function Learning() {
  return (
    <section className="learning learning-shell section-anchor">
      <ParticlesBackground theme="learning" />

      <div className="learning-hero">
        <div className="learning-copy reveal is-visible">
          <div className="tech-mark" aria-hidden="true">
            <span />
            <span />
          </div>
          <SectionLabel index="01" label="学习" />
          <h1>学习路径</h1>
          <i aria-hidden="true" />
          <p>以知识轴为中心，把能力模块、资料来源和复盘记录整理成可追踪的学习系统。</p>
          <div className="learning-stats" aria-label="学习统计">
            <span><strong>{String(learningPaths.length).padStart(2, "0")}</strong>路径</span>
            <span><strong>{String(resources.length * 4).padStart(2, "0")}</strong>资源</span>
            <span><strong>{String(learningArchive.length).padStart(2, "0")}</strong>档案</span>
          </div>
          <div className="learn-scroll-cue" aria-hidden="true">
            <span>SCROLL TO EXPLORE</span>
            <b />
          </div>
        </div>

        {learningConfig.sections.paths ? (
          <div className="knowledge-stage reveal is-visible" aria-label="学习路径空间索引">
            <div className="learning-mode">LEARNING MODE</div>
            <div className="knowledge-axis">
              <span className="axis-title">知识轴<small>KNOWLEDGE INDEX</small></span>
              {learningPaths.map((path, index) => (
                <span className={`knowledge-marker marker-${index + 1}`} key={path.title}>
                  <b />
                  <strong>{path.period}</strong>
                  <small>{path.title}</small>
                </span>
              ))}
              <span className="knowledge-marker marker-4">
                <b />
                <strong>长期</strong>
                <small>复盘归档</small>
              </span>
            </div>
            <div className="knowledge-core" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            {learningPaths.map((path, index) => (
              <article className={`learning-float-card learn-card-${index + 1}`} key={path.title}>
                <span className={`learning-card-status ${path.status}`}>{path.statusLabel}</span>
                <div>
                  <small>{path.period}</small>
                  <h2>{path.title}</h2>
                  <p>{path.summary}</p>
                  <em>{path.signal}</em>
                </div>
                <b aria-hidden="true">{index === 0 ? "AI" : index === 1 ? "UX" : "DB"}</b>
              </article>
            ))}
          </div>
        ) : null}
      </div>

      {learningConfig.sections.resources ? (
        <div className="learning-resources reveal">
          <div className="learning-block-head">
            <span>02</span>
            <div>
              <small>NEXT SECTION</small>
              <h2>资料地图</h2>
            </div>
          </div>
          <div className="resource-orbit-list">
            {resources.map((resource) => (
              <article className={`resource-orbit-card ${resource.tone}`} key={resource.label}>
                <b aria-hidden="true" />
                <span>{resource.label}</span>
                <p>{resource.meta}</p>
              </article>
            ))}
          </div>
        </div>
      ) : null}

      <ArchiveList title="学习档案" items={learningArchive} />
    </section>
  );
}
