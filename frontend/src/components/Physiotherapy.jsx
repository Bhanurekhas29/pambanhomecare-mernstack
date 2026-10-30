import { useState } from 'react';
import { Icon, assetUrl, isBlank, linkProps } from './common.jsx';
import './Physiotherapy.css';

// Heading with the chosen words shown in pink
function Heading({ text, highlight }) {
  const parts = !isBlank(highlight) && String(text).includes(highlight) ? String(text).split(highlight) : null;
  if (!parts) return text;
  return <>{parts[0]}<span className="pink">{highlight}</span>{parts.slice(1).join(highlight)}</>;
}

export default function Physiotherapy({ section, treatments }) {
  const [openId, setOpenId] = useState(null); // phones: the card whose "i" button was tapped
  if (!section.isVisible) return null;

  return (
    <section id="physiotherapy" className="section physio">
      <div className="container physio-wrap">
        <header className="physio-head">
          {!isBlank(section.eyebrow) && <p className="eyebrow physio-eyebrow"><span />{section.eyebrow}<span /></p>}
          <h2 className="section-title"><Heading text={section.heading} highlight={section.highlightText} /></h2>
          {!isBlank(section.description) && <p className="physio-sub">{section.description}</p>}
        </header>

        <div className="physio-grid">
          {treatments.map((t, i) => {
            // two columns: the colours swap every row (navy/pink, pink/navy, ...)
            const tone = (Math.floor(i / 2) + (i % 2)) % 2 === 0 ? 'navy' : 'pink';
            const hasDesc = !isBlank(t.description);
            const open = openId === t.id;
            const label = (
              <h3 className={`physio-label tone-${tone}`}>
                <span className="physio-icon"><Icon name={t.icon} /></span>
                <span>{t.title}</span>
              </h3>
            );
            return (
              <article key={t.id} className={`physio-card ${hasDesc ? 'has-reveal' : ''} ${open ? 'open' : ''}`}>
                <div className="physio-photo">
                  {t.imageUrl ? <img src={assetUrl(t.imageUrl)} alt={t.title} loading="lazy" /> : <div className="physio-fallback"><Icon name={t.icon} /></div>}
                </div>
                {/* the white description panel grows up from the bottom when the "i" button is pressed */}
                {hasDesc && (
                  <button
                    type="button" className="card-i" aria-expanded={open}
                    aria-label={open ? `Hide details of ${t.title}` : `Show details of ${t.title}`}
                    onClick={() => setOpenId(open ? null : t.id)}
                  >
                    <Icon name={open ? 'close' : 'info'} />
                  </button>
                )}
                {hasDesc ? <div className="card-info">{label}<p className="card-more">{t.description}</p></div> : label}
              </article>
            );
          })}
        </div>

        {!isBlank(section.bannerTitle) && (
          <div
            className={`physio-banner ${section.bannerImageUrl ? 'has-image' : ''} ${section.bannerImageUrl && section.bannerDarken ? 'darken' : ''}`}
            style={section.bannerImageUrl ? { backgroundImage: `url(${assetUrl(section.bannerImageUrl)})` } : undefined}
          >
            <div>
              <h3>{section.bannerTitle}</h3>
              {!isBlank(section.bannerText) && <p>{section.bannerText}</p>}
            </div>
            {!isBlank(section.bannerButtonLabel) && !isBlank(section.bannerButtonLink) && (
              <a {...linkProps(section.bannerButtonLink)} className="btn btn-primary">{section.bannerButtonLabel}</a>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
