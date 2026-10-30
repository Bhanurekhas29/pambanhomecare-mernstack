import { Icon, Lines, assetUrl, isBlank, linkProps } from './common.jsx';
import './Services.css';

export default function Services({ section, services }) {
  if (!section.isVisible) return null;

  return (
    <section id="services" className="section services">
      <div className="container services-wrap">
        <header className="services-head">
          {!isBlank(section.eyebrow) && (
            <p className="services-eyebrow"><Icon name="favorite" filled /> {section.eyebrow} <Icon name="favorite" filled /></p>
          )}
          <h2 className="section-title"><Lines text={section.heading} /></h2>
          <Icon name="favorite" className="services-heart" />
          {!isBlank(section.description) && <p className="services-sub">{section.description}</p>}
        </header>

        <div className="services-grid">
          {services.map((s, i) => {
            const tone = i % 2 === 0 ? 'navy' : 'pink'; // navy and pink take turns, as in the design
            const hasDesc = !isBlank(s.description);
            const label = (
              <h3 className={`service-label tone-${tone}`}>
                <span className="label-icon"><Icon name={s.icon} /></span>
                <span>{s.title}</span>
              </h3>
            );
            return (
              <article
                key={s.id}
                className={`service-card ${s.isWide ? 'is-wide' : ''} ${!s.isWide && hasDesc ? 'has-reveal' : ''}`}
                tabIndex={!s.isWide && hasDesc ? 0 : undefined}
              >
                <div className="service-photo">
                  {s.imageUrl ? <img src={assetUrl(s.imageUrl)} alt={s.title} loading="lazy" /> : <div className="service-fallback"><Icon name={s.icon} /></div>}
                </div>
                {s.isWide && hasDesc && <p className="service-desc">{s.description}</p>}
                {/* ordinary cards: the white description panel grows up from the bottom on hover, keyboard focus or tap */}
                {!s.isWide && hasDesc ? <div className="card-info">{label}<p className="card-more">{s.description}</p></div> : label}
              </article>
            );
          })}
        </div>

        {!isBlank(section.ctaText) && (
          <div className="services-cta">
            <Icon name="volunteer_activism" className="cta-icon" />
            <p>{section.ctaText}</p>
            {!isBlank(section.ctaButtonLabel) && !isBlank(section.ctaButtonLink) && (
              <a {...linkProps(section.ctaButtonLink)} className="btn btn-outline-pink">
                {section.ctaButtonLabel} <Icon name="arrow_forward" />
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
