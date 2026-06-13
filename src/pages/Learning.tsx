import { ArchiveList, SectionLabel } from "../components/shared";
import { learningConfig } from "../content/site.config";
import { learningArchive, learningPaths, resources } from "../content/learning";

export default function Learning() {
  return (
    <section className="content-section learning section-anchor">
      <SectionLabel index="01" label="学习" />
      <div className="section-heading reveal">
        <h2>沉下来的字，才经得起回看。</h2>
        <p>读过、做过、想过，都让它慢慢沉下来。</p>
      </div>

      {learningConfig.sections.paths ? (
        <div className="path-grid reveal">
          {learningPaths.map((path) => (
            <article className="path-card" key={path.title}>
              <div className="card-topline">
                <span className={`status-dot ${path.status}`} />
                <span>{path.statusLabel}</span>
                <span>{path.period}</span>
              </div>
              <h3>{path.title}</h3>
              <p>{path.summary}</p>
              <span className="signal">{path.signal}</span>
            </article>
          ))}
        </div>
      ) : null}

      {learningConfig.sections.resources ? (
        <div className="resource-band reveal">
          <div>
            <span className="section-mini">资料</span>
            <h3>值得反复回看的资源索引。</h3>
          </div>
          <div className="resource-list">
            {resources.map((resource) => (
              <article className={`resource-item ${resource.tone}`} key={resource.label}>
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
