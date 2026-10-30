import { Icon, Lines, assetUrl, isBlank, linkProps } from './common.jsx';
import './About.css';

export default function About({ data }) {
  if (!data.isVisible) return null;
  const features = (data.features || []).filter((f) => !isBlank(f.text));

  return (
    <section id="about" className="section about">
      <div className="container about-grid">
        <div className="about-photo-wrap">
          <div className="about-photo">
            {data.imageUrl ? <img src={assetUrl(data.imageUrl)} alt="" /> : <div className="photo-placeholder"><Icon name="image" /></div>}
          </div>
          {!isBlank(data.badgeText) && (
            <div className="about-badge">
              <span className="badge-icon"><Icon name={data.badgeIcon} filled /></span>
              <span>{data.badgeText}</span>
            </div>
          )}
        </div>

        <div className="about-copy">
          {!isBlank(data.eyebrow) && <p className="eyebrow">{data.eyebrow}</p>}
          <h2 className="section-title"><Lines text={data.heading} /></h2>
          {!isBlank(data.description) && String(data.description).split(/\n\s*\n/).map((para, i) => <p key={i} className="about-text">{para}</p>)}

          {features.length > 0 && (
            <ul className="about-list">
              {features.map((f, i) => (
                <li key={i}><span className="tick"><Icon name={f.icon} /></span>{f.text}</li>
              ))}
            </ul>
          )}

          {!isBlank(data.buttonLabel) && !isBlank(data.buttonLink) && (
            <a {...linkProps(data.buttonLink)} className="btn btn-primary">{data.buttonLabel} <Icon name="arrow_forward" /></a>
          )}
        </div>
      </div>
    </section>
  );
}
