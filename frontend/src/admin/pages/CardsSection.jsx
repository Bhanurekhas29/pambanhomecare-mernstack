import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ListEditor from '../components/ListEditor.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = { required: [['heading', 'Main heading']] };

// A section made of a heading plus a list of icon/title/text cards
// (Why Choose Us, Our Promises, ...). `menuLinkLabel` is only given when the section has a menu link.
// `backgroundImage`: also offer a background picture for the section (Our Promises, Why Choose Us).
// `darkSection`: the section is dark, so the optional layer over the picture is dark instead of light.
export default function CardsSection({
  endpoint, title, menuLinkLabel, itemName = 'Card', itemsHint, backgroundImage = false, darkSection = false,
}) {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setValues(null);
    api.get(endpoint).then(setValues).catch((e) => setError(e.message));
  }, [endpoint]);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const missing = (values.items || []).findIndex((item) => !item.title || !item.title.trim());
    const problem = firstProblem(values, rules) || (missing >= 0 ? `${itemName} ${missing + 1} needs a title` : undefined);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put(endpoint, values));
      toast.success(`${title} section saved`);
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
      <div className="page-head"><h1>{title}</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">
            Untick to hide the whole {title} section.
            {menuLinkLabel && ` Its "${menuLinkLabel}" menu link is hidden automatically too.`}
          </span>
        </section>

        <section className="card">
          <h2>Heading</h2>
          <Text label="Small heading" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line" />
          <Text label="Short description" name="description" rows={2} {...shared} hint="Optional. Shown under the heading." />
        </section>

        {backgroundImage && (
          <section className="card">
            <h2>Background</h2>
            <ImageUpload
              label="Background image" value={values.backgroundImageUrl} onChange={(v) => set('backgroundImageUrl', v)}
              hint="Optional. A wide picture covering the whole section, such as soft artwork with leaves or hearts. It shows exactly as uploaded."
            />
            {values.backgroundImageUrl && (
              <div className="field check">
                <input id="backgroundOverlay" type="checkbox" checked={!!values.backgroundOverlay} onChange={(e) => set('backgroundOverlay', e.target.checked)} />
                <label htmlFor="backgroundOverlay">{darkSection ? 'Add a dark layer over the picture' : 'Add a soft light layer over the picture'}</label>
                <span className="hint">
                  Tick this for an ordinary photo so the heading and text stay easy to read. Leave it off for designed artwork.
                </span>
              </div>
            )}
          </section>
        )}

        <section className="card">
          <h2>{itemName}s</h2>
          <ListEditor
            label={`${itemName}s`}
            hint={itemsHint}
            itemName={itemName}
            items={values.items}
            onChange={(v) => set('items', v)}
            fields={[
              { name: 'icon', label: 'Icon', icon: true },
              { name: 'title', label: 'Title' },
              { name: 'text', label: 'Text (optional)', multiline: true, wide: true },
            ]}
            max={8}
          />
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : `Save ${title.toLowerCase()}`}</button>
        </div>
      </form>
    </>
  );
}
