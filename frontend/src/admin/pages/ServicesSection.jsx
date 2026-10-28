import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = {
  required: [['heading', 'Main heading']],
  pairs: [['ctaButtonLabel', 'ctaButtonLink', 'Button']],
};

export default function ServicesSection() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/services-section').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const problem = firstProblem(values, rules);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/services-section', values));
      toast.success('Services section saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!values) return error ? <div className="alert alert-error">{error}</div> : <p>Loading...</p>;
  const shared = { values, set };

  return (
    <>
      <div className="page-head">
        <h1>Services section</h1>
        <Link to="/services" className="btn btn-outline">← Back to services</Link>
      </div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">
            Untick to hide the whole Services section. Its "Home Care Services" menu link is hidden automatically too.
          </span>
        </section>

        <section className="card">
          <h2>Heading</h2>
          <Text label="Small heading" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line" />
          <Text label="Short description" name="description" rows={2} {...shared} hint="Optional. Shown under the heading." />
        </section>

        <section className="card">
          <h2>Bottom bar</h2>
          <Text label="Question text" name="ctaText" {...shared} hint='e.g. "Not sure which service fits your family?" Leave empty to hide the bar.' />
          <div className="two-col">
            <Text label="Button text" name="ctaButtonLabel" {...shared} />
            <Text label="Button link" name="ctaButtonLink" {...shared} />
          </div>
          <span className="hint">Optional. Leave both button fields empty to hide the button; otherwise fill in both.</span>
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save services section'}</button>
        </div>
      </form>
    </>
  );
}
