import { useEffect, useState } from 'react';
import { api, SITE_URL } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';
import './Seo.css';

const TITLE_GOOD = 60; // roughly what search engines show before cutting a title
const DESC_GOOD = 160;

function Counter({ length, good }) {
  const over = length > good;
  return (
    <span className={`seo-count ${over ? 'over' : length ? 'ok' : ''}`}>
      {length} / {good} characters{over ? ' - may be cut off in search results' : ''}
    </span>
  );
}

export default function Seo() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/seo').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!values.metaTitle?.trim()) return toast.error('Meta title is required');
    setBusy(true);
    try {
      setValues(await api.put('/admin/seo', values));
      toast.success('SEO settings saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!values) return error ? <div className="alert alert-error">{error}</div> : <p>Loading...</p>;

  const title = values.metaTitle || '';
  const desc = values.metaDescription || '';
  const clip = (text, max) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);
  const host = SITE_URL.replace(/^https?:\/\//, '');

  return (
    <>
      <div className="page-head"><h1>SEO</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <h2>Search engine text</h2>
          <p className="seo-intro">
            This is the text Google and other search engines show for your website, and the title shown on the browser tab.
          </p>

          <div className="field">
            <label htmlFor="metaTitle">Meta title <span className="req">*</span></label>
            <input id="metaTitle" type="text" required maxLength={120} value={title} onChange={(e) => set('metaTitle', e.target.value)} />
            <Counter length={title.length} good={TITLE_GOOD} />
            <span className="hint">Include your business name and main service, e.g. "Pamban Swami Home Care | Home Care & Physiotherapy at Home".</span>
          </div>

          <div className="field">
            <label htmlFor="metaDescription">Meta description</label>
            <textarea id="metaDescription" rows={3} maxLength={320} value={desc} onChange={(e) => set('metaDescription', e.target.value)} />
            <Counter length={desc.length} good={DESC_GOOD} />
            <span className="hint">One or two sentences that tell people why to visit. Optional, but recommended.</span>
          </div>
        </section>

        <section className="card">
          <h2>Search result preview</h2>
          <div className="seo-preview" aria-label="Preview of how this may look on Google">
            <span className="seo-url">{host}</span>
            <span className="seo-title">{clip(title, 62) || 'Your meta title appears here'}</span>
            <span className="seo-desc">{clip(desc, 165) || 'Your meta description appears here.'}</span>
          </div>
          <span className="hint">A guide only. Google decides the final wording, and changes can take a few days to appear.</span>
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save SEO'}</button>
        </div>
      </form>
    </>
  );
}
