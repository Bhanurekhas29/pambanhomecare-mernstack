import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import '../components/ResourceForm.css';

export default function Credits() {
  const [values, setValues] = useState(null);
  const toast = useToast();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/site-settings').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      setValues(await api.put('/admin/site-settings', values));
      toast.success('Credits saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!values) return error ? <div className="alert alert-error">{error}</div> : <p>Loading...</p>;

  const credit = values.creditUrl
    ? <a href={values.creditUrl} target="_blank" rel="noreferrer">{values.creditText}</a>
    : values.creditText;

  return (
    <>
      <div className="page-head"><h1>Credits</h1></div>
      <form className="card form-card" onSubmit={submit}>
        <div className="field check">
          <input id="showCredit" type="checkbox" checked={!!values.showCredit}
            onChange={(e) => set('showCredit', e.target.checked)} />
          <label htmlFor="showCredit">{credit}</label>
        </div>
        <span className="hint" style={{ display: 'block', marginBottom: 20 }}>
          Tick to show this credit link in the website footer.
        </span>

        <div className="field">
          <label htmlFor="creditText">Credit text</label>
          <input id="creditText" type="text" required value={values.creditText || ''}
            onChange={(e) => set('creditText', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="creditUrl">Hyperlink URL</label>
          <input id="creditUrl" type="text" placeholder="https://" value={values.creditUrl || ''}
            onChange={(e) => set('creditUrl', e.target.value)} />
          <span className="hint">Where the credit text links to, e.g. the Vetri IT Systems website</span>
        </div>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </>
  );
}
