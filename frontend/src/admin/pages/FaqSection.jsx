import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ListEditor from '../components/ListEditor.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = { required: [['heading', 'Main heading']] };

export default function FaqSection() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/faq').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const items = values.items || [];
    const missing = items.findIndex((i) => !(i.question || '').trim() || !(i.answer || '').trim());
    const problem = firstProblem(values, rules) || (missing >= 0 ? `Question ${missing + 1} needs both a question and an answer` : undefined);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/faq', values));
      toast.success('FAQ section saved');
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
      <div className="page-head"><h1>FAQ</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <div className="field check" style={{ marginBottom: 6 }}>
            <input id="isVisible" type="checkbox" checked={!!values.isVisible} onChange={(e) => set('isVisible', e.target.checked)} />
            <label htmlFor="isVisible">Show this section on the website</label>
          </div>
          <span className="hint">Untick to hide the whole FAQ section.</span>
        </section>

        <section className="card">
          <h2>Heading</h2>
          <Text label="Small heading" name="eyebrow" {...shared} hint="Optional" />
          <Text label="Main heading" name="heading" rows={2} required {...shared} hint="Press Enter for a new line" />
          <Text label="Text beside the questions" name="description" rows={3} {...shared} hint="Optional. Shown on the left of the questions." />
        </section>

        <section className="card">
          <h2>Questions</h2>
          <ListEditor
            label="Questions"
            hint="Visitors can open each question to read its answer. Search engines can read every answer."
            itemName="Question"
            items={values.items}
            onChange={(v) => set('items', v)}
            fields={[
              { name: 'question', label: 'Question', wide: true },
              { name: 'answer', label: 'Answer', multiline: true, wide: true },
            ]}
            max={15}
          />
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save FAQ'}</button>
        </div>
      </form>
    </>
  );
}
