import { ArchiveList, SectionLabel } from "../components/shared";
import { travelConfig } from "../content/site.config";
import { currentTrip, destinations, gallery, itinerary, routeStops, travelArchive } from "../content/travel";

export default function Travel() {
  return (
    <section className="content-section travel section-anchor">
      <SectionLabel index="02" label="旅行" />
      <div className="travel-layout">
        <div className="travel-copy">
          <div className="section-heading reveal">
            <h2>走过的路，会长成自己的故事。</h2>
            <p>不是赶路，是一路慢慢长出来的字。</p>
          </div>

          <article className="trip-summary reveal">
            <span>{currentTrip.period}</span>
            <h3>{currentTrip.title}</h3>
            <p>{currentTrip.summary}</p>
          </article>

          {travelConfig.sections.route ? (
            <div className="route-line reveal" aria-label="旅行路线">
              {routeStops.map((stop, index) => (
                <div className="route-stop" key={stop}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stop}</strong>
                </div>
              ))}
            </div>
          ) : null}

          {travelConfig.sections.itinerary ? (
            <div className="timeline reveal">
              {itinerary.map((item) => (
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

          {travelConfig.sections.destinations ? (
            <div className="destination-grid reveal">
              {destinations.map((destination) => (
                <article className={`destination-card ${destination.accent}`} key={destination.city}>
                  <h3>{destination.city}</h3>
                  <p>{destination.note}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>

        {travelConfig.sections.gallery ? (
          <div className="gallery-stack reveal">
            {gallery.map((image, index) => (
              <figure className={`gallery-card card-${index + 1}`} key={image.title}>
                <img src={image.src} alt={image.title} loading="lazy" />
                <figcaption>{image.title}</figcaption>
              </figure>
            ))}
          </div>
        ) : null}
      </div>

      <ArchiveList title="旅行档案" items={travelArchive} />
    </section>
  );
}
