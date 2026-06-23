import { Link } from "react-router-dom";
import TechCanvas from "../components/TechCanvas";
import { siteConfig } from "../content/site.config";
import { learningPaths } from "../content/learning";
import { trips } from "../content/travel";

export default function Home() {
  const previewPaths = learningPaths.slice(0, 3);

  return (
    <div className="home-dashboard">
      <section className="hero home-hero section-anchor">
        <TechCanvas />
        <div className="hero-inner">
          <div className="hero-panel reveal is-visible">
            <div className="panel-corners" aria-hidden="true" />
            <span className="hero-kicker">PERSONAL INDEX</span>
            <span className="hero-code">----</span>
            <div className="hero-copy">
              <h1>{siteConfig.hero.title}<span aria-hidden="true">.</span></h1>
              <p className="hero-description">{siteConfig.hero.description}</p>
            </div>
            <div className="hero-metrics" aria-label="内容状态">
              <span><strong>{String(learningPaths.length).padStart(2, "0")}</strong>学习路径</span>
              <span><strong>12</strong>学习资源</span>
              <span><strong>{String(trips.length).padStart(2, "0")}</strong>旅行归档</span>
              <span><strong>853</strong>照片记录</span>
            </div>
            <div className="hero-actions">
              <Link className="button primary" to="/learning">
                {siteConfig.hero.primaryAction}
              </Link>
              <Link className="button ghost" to="/travel">
                {siteConfig.hero.secondaryAction}
              </Link>
            </div>
          </div>
          <div className="process-panel reveal is-visible" aria-label="内容处理流程">
            <div className="panel-corners" aria-hidden="true" />
            <span className="process-label">DATA FLOW</span>
            <div className="flow-node input"><strong>输入</strong><small>INPUT</small></div>
            <div className="flow-node retrieve"><strong>检索</strong><small>RETRIEVE</small></div>
            <div className="flow-core" aria-hidden="true">
              <span />
              <i />
            </div>
            <div className="flow-node reason"><strong>推理</strong><small>REASON</small></div>
            <div className="flow-node generate"><strong>生成</strong><small>GENERATE</small></div>
            <div className="flow-node archive"><strong>归档</strong><small>ARCHIVE</small></div>
            <div className="flow-line line-a" />
            <div className="flow-line line-b" />
            <div className="flow-line line-c" />
            <div className="flow-line line-d" />
          </div>
        </div>
      </section>

      <section className="home-grid section-anchor">
        <div className="home-panel learning-preview reveal">
          <div className="home-panel-head">
            <h2><span />学习路径</h2>
            <Link to="/learning">查看全部</Link>
          </div>
          <div className="preview-card-grid">
            {previewPaths.map((path, index) => (
              <article className="preview-path-card" key={path.title}>
                <span className={`preview-status ${path.status}`}>{path.statusLabel}</span>
                <div className="path-symbol" aria-hidden="true">
                  <span>{index === 0 ? "</>" : index === 1 ? "AI" : "SYS"}</span>
                </div>
                <h3>{path.title}</h3>
                <p>{path.summary}</p>
                <div className="preview-meta">
                  <span>{index === 2 ? "09" : index === 1 ? "18" : "12"} 资源</span>
                  <span>{index === 0 ? "更新 3 天前" : index === 1 ? "更新 1 周前" : "更新 2 周前"}</span>
                </div>
                <i className="preview-progress" style={{ ["--progress" as string]: `${index === 2 ? 36 : index === 1 ? 34 : 50}%` }} />
              </article>
            ))}
          </div>
          <div className="panel-tabs" aria-label="学习状态筛选">
            <span className="active">全部</span>
            <span>进行中</span>
            <span>计划中</span>
            <span>已完成</span>
          </div>
        </div>

        <div className="home-panel travel-preview reveal">
          <div className="home-panel-head">
            <h2><span />旅行轨迹</h2>
            <Link to="/travel">查看全部</Link>
          </div>
          <div className="mini-helix" aria-label="旅行时间轴预览">
            <div className="mini-core">
              <span>2025<small>今年</small></span>
              <span>2024</span>
              <span>2023</span>
              <span>2022</span>
            </div>
            <div className="mini-rings" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            {trips.slice(0, 3).map((trip, index) => (
              <Link className={`mini-trip-card mini-trip-${index + 1}`} to={`/travel/${trip.slug}`} key={trip.slug}>
                <img src={trip.cover} alt="" loading="lazy" />
                <span>
                  <strong>{trip.title}</strong>
                  <small>{trip.routeStops?.slice(1).join("、") || trip.summary}</small>
                  <em>{trip.period}</em>
                </span>
                <b>{String(index + 1).padStart(2, "0")}</b>
              </Link>
            ))}
          </div>
          <Link className="timeline-control" to="/travel">
            <span aria-hidden="true">‹</span>
            滚动探索时间轴
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </section>

    </div>
  );
}
