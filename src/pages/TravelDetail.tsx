import { Link, useParams } from "react-router-dom";
import ParticlesBackground from "../components/ParticlesBackground";
import { SectionLabel } from "../components/shared";
import { travelConfig } from "../content/site.config";
import { trips } from "../content/travel";

export default function TravelDetail() {
  const { slug } = useParams();
  const trip = trips.find((t) => t.slug === slug);

  return (
    <section className="content-section travel section-anchor trip-detail">
      <ParticlesBackground theme="travel" />
      <Link className="back-link reveal is-visible" to="/travel">
        ← 返回旅行
      </Link>

      {!trip ? (
        <div className="section-heading reveal">
          <SectionLabel index="02" label="旅行" />
          <h2>没有找到这次旅行</h2>
          <p>可能链接已失效，或这条旅程尚未整理。</p>
        </div>
      ) : (
        <>
          <div className="trip-detail-header reveal">
            <span className="trip-detail-period">{trip.period}</span>
            <h2>{trip.title}</h2>
            <p>{trip.summary}</p>
          </div>

          {trip.status === "placeholder" || !trip.itinerary ? (
            <div className="trip-detail-empty reveal">
              <span>行程待补充</span>
              <p>这条旅行的路线、行程与照片还在整理中，稍后会更新到这里。</p>
            </div>
          ) : (
            <div className="travel-layout">
              <div className="travel-copy">
                {travelConfig.sections.route && trip.routeStops ? (
                  <div className="route-line reveal" aria-label="旅行路线">
                    {trip.routeStops.map((stop, index) => (
                      <div className="route-stop" key={stop}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <strong>{stop}</strong>
                      </div>
                    ))}
                  </div>
                ) : null}

                {travelConfig.sections.itinerary && trip.itinerary ? (
                  <div className="timeline reveal">
                    {trip.itinerary.map((item) => (
                      <article className="timeline-item" key={item.day}>
                        <span>{item.day}</span>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.detail}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}

                {travelConfig.sections.destinations && trip.destinations ? (
                  <div className="destination-grid reveal">
                    {trip.destinations.map((destination) => (
                      <article className={`destination-card ${destination.accent}`} key={destination.city}>
                        <h3>{destination.city}</h3>
                        <p>{destination.note}</p>
                      </article>
                    ))}
                  </div>
                ) : null}
              </div>

              {travelConfig.sections.gallery && trip.gallery ? (
                <div className="gallery-stack reveal">
                  {trip.gallery.map((image, index) => (
                    <figure className={`gallery-card card-${index + 1}`} key={image.title}>
                      <img src={image.src} alt={image.title} loading="lazy" />
                      <figcaption>{image.title}</figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </>
      )}
    </section>
  );
}
