import { useEffect, useState } from 'react';
import { api } from '../api/client';
import ImageUpload from '../components/ImageUpload.jsx';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import IconPicker from '../components/IconPicker.jsx';
import ListEditor from '../components/ListEditor.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = {
  required: [['heading', 'Main heading'], ['description', 'Description']],
  pairs: [
    ['primaryBtnLabel', 'primaryBtnLink', 'Primary button'],
    ['secondaryBtnLabel', 'secondaryBtnLink', 'Secondary button'],
  ],
};

export default function HeroSection() {
  const [values, setValues] = useState(null);
  const toast = useToast();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/hero').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const problem = firstProblem(values, rules);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/hero', values));
      toast.success('Hero section saved');
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
      <div className="page-head"><h1>Hero Section</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <h2>Main content</h2>
          <Text label="Small heading above the title" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line, e.g. 'Professional Care.' then 'Right at Your Home.'" />
          <Text label="Description" name="description" rows={3} required {...shared} />
          <ImageUpload label="Background image" value={values.backgroundImageUrl} onChange={(v) => set('backgroundImageUrl', v)} hint="Wide photo behind the hero. Large images are fine, up to 5 MB." />
        </section>

        <section className="card">
          <h2>Buttons</h2>
          <div className="two-col">
            <Text label="Primary button text" name="primaryBtnLabel" {...shared} />
            <Text label="Primary button link" name="primaryBtnLink" {...shared} />
            <Text label="Secondary button text" name="secondaryBtnLabel" {...shared} />
            <Text label="Secondary button link" name="secondaryBtnLink" {...shared} />
          </div>
          <span className="hint">Optional. Leave a button's text and link both empty to hide it; otherwise fill in both.</span>
        </section>

        <section className="card">
          <h2>Highlights</h2>
          <ListEditor
            label="Badges below the buttons"
            itemName="Badge"
            items={values.features}
            onChange={(v) => set('features', v)}
            fields={[{ name: 'icon', label: 'Icon', icon: true }, { name: 'text', label: 'Text' }]}
            max={6}
          />
        </section>

        <section className="card">
          <h2>Care options card (right side)</h2>
          <div className="two-col">
            <div className="field">
              <label>Card icon</label>
              <IconPicker value={values.cardIcon} onChange={(v) => set('cardIcon', v)} />
            </div>
            <div />
            <Text label="Line 1 (italic)" name="cardTagline" {...shared} />
            <Text label="Line 2" name="cardHeading" {...shared} />
            <Text label="Line 3 (highlighted in pink)" name="cardHighlight" {...shared} />
          </div>
          <Text label="Card description" name="cardDescription" rows={2} {...shared} />
          <ListEditor
            label="Care options"
            itemName="Option"
            items={values.options}
            onChange={(v) => set('options', v)}
            fields={[
              { name: 'icon', label: 'Icon', icon: true },
              { name: 'title', label: 'Title' },
              { name: 'description', label: 'Description', wide: true },
              { name: 'link', label: 'Link', wide: true },
            ]}
            max={4}
          />
          <Text label="Card footer strip" name="cardFooter" {...shared} />
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save hero section'}</button>
        </div>
      </form>
    </>
  );
}
