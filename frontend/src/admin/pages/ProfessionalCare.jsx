import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = {
  required: [['heading', 'Main heading']],
  pairs: [['buttonLabel', 'buttonLink', 'Button']],
};

export default function ProfessionalCare() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/professional-care').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const problem = firstProblem(values, rules);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/professional-care', values));
      toast.success('Professional care section saved');
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
      <div className="page-head"><h1>Professional Care</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">Untick to hide the whole Professional Care section.</span>
        </section>

        <section className="card">
          <h2>Content</h2>
          <Text label="Small heading" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line" />
          <Text label="Description" name="description" rows={4} {...shared} hint="Optional" />
          <ImageUpload label="Photo" value={values.imageUrl} onChange={(v) => set('imageUrl', v)} hint="Shown on the right side of the section" />
        </section>

        <section className="card">
          <h2>Button</h2>
          <div className="two-col">
            <Text label="Button text" name="buttonLabel" {...shared} />
            <Text label="Button link" name="buttonLink" {...shared} />
          </div>
          <span className="hint">Optional. Leave both empty to hide the button; otherwise fill in both.</span>
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save professional care'}</button>
        </div>
      </form>
    </>
  );
}
