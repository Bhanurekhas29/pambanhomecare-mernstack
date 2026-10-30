import { Lines, isBlank } from './common.jsx';
import './Faq.css';

export default function Faq({ data }) {
  if (!data.isVisible) return null;
  const items = (data.items || []).filter((i) => !isBlank(i.question) && !isBlank(i.answer));
  if (!items.length) return null;

  return (
    <section id="faq" className="section faq">
      <div className="container faq-wrap">
        <header className="faq-head">
          {!isBlank(data.eyebrow) && <p className="eyebrow">{data.eyebrow}</p>}
          <h2 className="section-title"><Lines text={data.heading} /></h2>
          {!isBlank(data.description) && <p className="faq-sub">{data.description}</p>}
        </header>

        {/* every answer stays in the page, so search engines can read it even while it is folded */}
        <div className="faq-list">
          {items.map((item, i) => (
            <details key={i} className="faq-item">
              <summary><h3>{item.question}</h3></summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
