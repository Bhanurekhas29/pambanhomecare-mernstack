import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import ListEditor from '../components/ListEditor.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = {
  required: [
    ['heading', 'Main heading'],
    ['tabHomeCareLabel', 'First form tab name'],
    ['tabPhysioLabel', 'Second form tab name'],
    ['submitLabel', 'Form button text'],
    ['successMessage', 'Thank-you message'],
  ],
};

export default function ContactUs() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/contact-us').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const missing = (values.items || []).findIndex((item) => !item.value || !item.value.trim());
    const problem = firstProblem(values, rules) || (missing >= 0 ? `Contact detail ${missing + 1} needs a value` : undefined);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/contact-us', values));
      toast.success('Contact section saved');
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
      <div className="page-head"><h1>Contact Us</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">
            Untick to hide the whole Contact Us section, including the form. Buttons that link to "#contact"
            (like the header's Contact Us button) would then lead nowhere.
          </span>
        </section>

        <section className="card">
          <h2>Background</h2>
          <ImageUpload
            label="Background image" value={values.backgroundImageUrl} onChange={(v) => set('backgroundImageUrl', v)}
            hint="Optional. A wide picture covering the whole Contact Us section, such as soft artwork with leaves or hearts. It shows exactly as uploaded."
          />
          {values.backgroundImageUrl && (
            <div className="field check">
              <input id="backgroundOverlay" type="checkbox" checked={!!values.backgroundOverlay} onChange={(e) => set('backgroundOverlay', e.target.checked)} />
              <label htmlFor="backgroundOverlay">Add a soft light layer over the picture</label>
              <span className="hint">Tick this for an ordinary photo so the heading and the form stay easy to read. Leave it off for designed artwork.</span>
            </div>
          )}
        </section>

        <section className="card">
          <h2>Heading</h2>
          <Text label="Small heading" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line" />
          <Text label="Short description" name="description" rows={2} {...shared} hint="Optional" />
          <ImageUpload
            label="Extra photo (optional)" value={values.imageUrl} onChange={(v) => set('imageUrl', v)}
            hint="A cut-out photo shown on the left. Not needed if your background picture already shows the people."
          />
        </section>

        <section className="card">
          <h2>Contact card (blue box)</h2>
          <ImageUpload
            label="Blue card background" value={values.infoBackgroundUrl} onChange={(v) => set('infoBackgroundUrl', v)}
            hint="Optional. Dark blue artwork (flowers, curves) shown behind the card's text. Without one, the card uses plain blue."
          />
          <Text label="Card title" name="infoTitle" {...shared} hint="Optional" />
          <Text label="Card text" name="infoText" rows={3} {...shared} hint="Optional" />
          <ListEditor
            label="Contact details"
            hint="Phone, email, address, working hours. Add the real details here."
            itemName="Detail"
            items={values.items}
            onChange={(v) => set('items', v)}
            fields={[
              { name: 'icon', label: 'Icon', icon: true },
              { name: 'label', label: 'Label (e.g. PHONE)' },
              { name: 'value', label: 'Value (e.g. +91 98765 43210)', wide: true },
              { name: 'showInFooter', label: 'Show this in the footer too', type: 'checkbox', wide: true },
            ]}
            max={8}
          />
        </section>

        <section className="card">
          <h2>Callback form</h2>
          <div className="two-col">
            <Text label="First tab name" name="tabHomeCareLabel" required {...shared} hint="Lists your Services in its dropdown" />
            <Text label="Second tab name" name="tabPhysioLabel" required {...shared} hint="Lists your Physiotherapy treatments" />
            <Text label="Form button text" name="submitLabel" required {...shared} />
          </div>
          <Text label="Thank-you message" name="successMessage" rows={2} required {...shared} hint="Shown to the visitor after they send the form" />
          <span className="hint">
            Submissions are saved in <strong>Enquiries</strong>. Name, mobile number, age and gender are required on the form,
            and the mobile number and email are checked for the correct format.
          </span>
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save contact section'}</button>
        </div>
      </form>
    </>
  );
}
