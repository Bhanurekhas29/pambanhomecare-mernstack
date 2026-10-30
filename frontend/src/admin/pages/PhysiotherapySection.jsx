import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = {
  required: [['heading', 'Main heading']],
  pairs: [['bannerButtonLabel', 'bannerButtonLink', 'Banner button']],
};

export default function PhysiotherapySection() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/physiotherapy-section').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const problem = firstProblem(values, rules);
    if (problem) return toast.error(problem);
    if (values.highlightText && !values.heading.includes(values.highlightText)) {
      return toast.error('Highlighted words must appear exactly as written in the main heading');
    }
    setBusy(true);
    try {
      setValues(await api.put('/admin/physiotherapy-section', values));
      toast.success('Physiotherapy section saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!values) return error ? <div className="alert alert-error">{error}</div> : <p>Loading...</p>;
  const shared = { values, set };

  // live preview of the heading with the pink part
  const [before, after] = values.highlightText && values.heading.includes(values.highlightText)
    ? values.heading.split(values.highlightText)
    : [values.heading, null];

  return (
    <>
      <div className="page-head">
        <h1>Physiotherapy section</h1>
        <Link to="/physiotherapy" className="btn btn-outline">← Back to treatments</Link>
      </div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">
            Untick to hide the whole Physiotherapy section. Its "Physiotherapy" menu link is hidden automatically too.
          </span>
        </section>

        <section className="card">
          <h2>Heading</h2>
          <Text label="Small heading" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line" />
          <Text
            label="Words shown in pink" name="highlightText" {...shared}
            hint="Optional. Type part of the heading exactly as written, e.g. Your Home."
          />
          <Text label="Short description" name="description" rows={2} {...shared} hint="Optional. Shown under the heading." />
          <div className="field">
            <label>Preview</label>
            <div className="heading-preview">
              {before}{after !== null && <span className="pink">{values.highlightText}</span>}{after}
            </div>
          </div>
        </section>

        <section className="card">
          <h2>Blue banner</h2>
          <ImageUpload
            label="Banner background image" value={values.bannerImageUrl} onChange={(v) => set('bannerImageUrl', v)}
            hint="Optional. Finished banner artwork shows exactly as uploaded, anchored to its bottom edge so corner decorations stay visible."
          />
          {values.bannerImageUrl && (
            <div className="field check">
              <input id="bannerDarken" type="checkbox" checked={!!values.bannerDarken} onChange={(e) => set('bannerDarken', e.target.checked)} />
              <label htmlFor="bannerDarken">Add a dark layer over the picture</label>
              <span className="hint">Tick this for an ordinary photo so the white text stays easy to read. Leave it off for designed banner artwork.</span>
            </div>
          )}
          <Text label="Banner title" name="bannerTitle" {...shared} hint="Leave empty to hide the whole banner" />
          <Text label="Banner text" name="bannerText" rows={2} {...shared} hint="Optional" />
          <div className="two-col">
            <Text label="Button text" name="bannerButtonLabel" {...shared} />
            <Text label="Button link" name="bannerButtonLink" {...shared} />
          </div>
          <span className="hint">Optional. Leave both button fields empty to hide the button; otherwise fill in both.</span>
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save physiotherapy section'}</button>
        </div>
      </form>
    </>
  );
}
