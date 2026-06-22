import { Link } from "react-router-dom";
import TechCanvas from "../components/TechCanvas";
import { siteConfig } from "../content/site.config";
import { learningPaths } from "../content/learning";
import { featuredTrip, nextTrip } from "../content/travel";

export default function Home() {
  const activePaths = learningPaths.filter((path) => path.status === "active");

  return (
    <>
      <section className="hero section-anchor">
        <TechCanvas />
        <div className="hero-inner">
          <div className="hero-copy reveal is-visible">
            <h1>{siteConfig.hero.title}</h1>
            <p className="hero-description">{siteConfig.hero.description}</p>
            <div className="hero-actions">
              <Link className="button primary" to="/learning">
                {siteConfig.hero.primaryAction}
              </Link>
              <Link className="button ghost" to="/travel">
                {siteConfig.hero.secondaryAction}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section section-anchor">
        <div className="section-heading reveal">
          <h2>最近在学</h2>
        </div>
        <div className="path-grid reveal">
          {activePaths.map((path) => (
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
        <Link className="teaser-link" to="/learning">
          进入学习 →
        </Link>
      </section>

      <section className="content-section section-anchor">
        <div className="section-heading reveal">
          <h2>{nextTrip ? "下一程" : "最近一程"}</h2>
        </div>
        <article className="trip-summary reveal">
          <span>{featuredTrip.period}</span>
          <h3>{featuredTrip.title}</h3>
          <p>{featuredTrip.summary}</p>
        </article>
        <div className="route-line reveal" aria-label="旅行路线">
          {featuredTrip.routeStops?.map((stop, index) => (
            <div className="route-stop" key={stop}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stop}</strong>
            </div>
          ))}
        </div>
        <Link className="teaser-link" to="/travel">
          进入旅行 →
        </Link>
      </section>
    </>
  );
}
