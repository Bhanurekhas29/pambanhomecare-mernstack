import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import ImageUpload from '../components/ImageUpload.jsx';
import '../components/ResourceForm.css';

export default function SiteSettings() {
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
      toast.success('Site settings saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (!values) return error ? <div className="alert alert-error">{error}</div> : <p>Loading...</p>;

  return (
    <>
      <div className="page-head"><h1>Site Settings</h1></div>
      <form className="card form-card" onSubmit={submit}>
        <div className="field">
          <label htmlFor="siteName">Website name</label>
          <input id="siteName" type="text" required value={values.siteName || ''} onChange={(e) => set('siteName', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="tagline">Tagline</label>
          <input id="tagline" type="text" value={values.tagline || ''} onChange={(e) => set('tagline', e.target.value)} />
          <span className="hint">Small text under the name in the header, e.g. HOME CARE</span>
        </div>

        <ImageUpload label="Header logo" value={values.headerLogoUrl} onChange={(v) => set('headerLogoUrl', v)} hint="Shown at the top-left of the website" />
        <ImageUpload label="Footer logo" value={values.footerLogoUrl} onChange={(v) => set('footerLogoUrl', v)} hint="Shown in the website footer" />

        <div className="field">
          <label htmlFor="ctaLabel">Header button text</label>
          <input id="ctaLabel" type="text" value={values.ctaLabel || ''} onChange={(e) => set('ctaLabel', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="ctaLink">Header button link</label>
          <input id="ctaLink" type="text" value={values.ctaLink || ''} onChange={(e) => set('ctaLink', e.target.value)} />
        </div>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </>
  );
}
