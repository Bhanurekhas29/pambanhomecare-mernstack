import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = { required: [['heading', 'Main heading'], ['businessName', 'Business name']] };

export default function GoogleBusiness() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/google-business').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const rating = values.rating === '' || values.rating === null ? null : Number(values.rating);
    const problem =
      firstProblem(values, rules) ||
      (rating !== null && !(rating >= 0 && rating <= 5) ? 'Rating must be a number from 0 to 5' : undefined) ||
      (values.buttonLink && !/^https?:\/\//i.test(values.buttonLink.trim())
        ? 'Button link must start with http:// or https://'
        : undefined);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/google-business', { ...values, rating }));
      toast.success('Google section saved');
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
      <div className="page-head"><h1>Find Us on Google</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">Untick to hide the whole Find Us on Google section.</span>
        </section>

        <section className="card">
          <h2>Heading</h2>
          <Text label="Main heading" name="heading" required {...shared} />
          <Text label="Short description" name="description" rows={2} {...shared} hint="Optional" />
        </section>

        <section className="card">
          <h2>Business card</h2>
          <ImageUpload label="Business photo" value={values.imageUrl} onChange={(v) => set('imageUrl', v)} hint="Small round photo beside the business name. Optional." />
          <Text label="Business name" name="businessName" required {...shared} />
          <div className="two-col">
            <div className="field">
              <label htmlFor="rating">Rating (0 to 5)</label>
              <input
                id="rating" type="number" min="0" max="5" step="0.1" value={values.rating ?? ''}
                onChange={(e) => set('rating', e.target.value)}
              />
              <span className="hint">Shown as stars. Leave empty to hide the rating.</span>
            </div>
            <Text label="Reviews label" name="reviewsLabel" {...shared} hint='e.g. "Google Reviews"' />
          </div>
          <Text label="Address" name="address" rows={2} {...shared} hint="Optional" />
        </section>

        <section className="card">
          <h2>Button</h2>
          <div className="two-col">
            <Text label="Button text" name="buttonLabel" {...shared} />
            <Text label="Google Business Profile link" name="buttonLink" {...shared} hint="Starts with https://" />
          </div>
          <span className="hint">The button appears on the website once both a text and a link are filled in.</span>
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save google section'}</button>
        </div>
      </form>
    </>
  );
}
