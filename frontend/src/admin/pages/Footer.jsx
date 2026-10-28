import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import { firstProblem } from '../validate.js';
import Text from '../components/TextField.jsx';
import ListEditor from '../components/ListEditor.jsx';
import '../components/ResourceForm.css';
import './HeroSection.css';

const rules = {
  required: [
    ['quickLinksHeading', 'Quick links heading'],
    ['servicesHeading', 'Services heading'],
    ['physioHeading', 'Physiotherapy heading'],
    ['contactHeading', 'Contact heading'],
  ],
};

const PLATFORMS = [
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'x', label: 'X (Twitter)' },
  { value: 'linkedin', label: 'LinkedIn' },
];

export default function Footer() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get('/admin/footer').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    const badLink = (values.quickLinks || []).findIndex((l) => !l.label?.trim() || !l.link?.trim());
    const badSocial = (values.socialLinks || []).findIndex((s) => s.url?.trim() && !/^https?:\/\//i.test(s.url.trim()));
    const problem =
      firstProblem(values, rules) ||
      (badLink >= 0 ? `Quick link ${badLink + 1} needs both a name and a link` : undefined) ||
      (badSocial >= 0 ? `Social link ${badSocial + 1}: the link must start with http:// or https://` : undefined);
    if (problem) return toast.error(problem);
    setBusy(true);
    try {
      setValues(await api.put('/admin/footer', values));
      toast.success('Footer saved');
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
      <div className="page-head"><h1>Footer</h1></div>
      <form className="hero-form" onSubmit={submit}>
        <section className="card">
          <h2>About</h2>
          <Text label="Short text under the logo" name="aboutText" rows={3} {...shared} hint="Optional" />
          <span className="hint">
            The footer logo comes from <Link to="/site-settings">Site Settings</Link> (Footer logo).
          </span>
        </section>

        <section className="card">
          <h2>Social media</h2>
          <ListEditor
            label="Social icons"
            hint="An icon appears in the footer only when its link is filled in."
            itemName="Link"
            items={values.socialLinks}
            onChange={(v) => set('socialLinks', v)}
            fields={[
              { name: 'platform', label: 'Platform', type: 'select', options: PLATFORMS },
              { name: 'url', label: 'Page link (https://...)' },
            ]}
            max={6}
          />
        </section>

        <section className="card">
          <h2>Quick links</h2>
          <Text label="Column heading" name="quickLinksHeading" required {...shared} />
          <ListEditor
            label="Links"
            itemName="Link"
            items={values.quickLinks}
            onChange={(v) => set('quickLinks', v)}
            fields={[{ name: 'label', label: 'Name' }, { name: 'link', label: 'Link (e.g. #about)' }]}
            max={12}
          />
        </section>

        <section className="card">
          <h2>Other columns</h2>
          <div className="two-col">
            <Text label="Services column heading" name="servicesHeading" required {...shared} />
            <Text label="Physiotherapy column heading" name="physioHeading" required {...shared} />
            <Text label="Contact column heading" name="contactHeading" required {...shared} />
          </div>
          <span className="hint">
            These columns fill themselves in: the services come from <Link to="/services">Services</Link>, the treatments from{' '}
            <Link to="/physiotherapy">Physiotherapy</Link> (only the ones set to show), and the contact lines from{' '}
            <Link to="/contact-us">Contact Us</Link> (tick "Show in footer" on each detail).
          </span>
        </section>

        <section className="card">
          <h2>Copyright</h2>
          <Text label="Copyright text" name="copyrightText" {...shared} hint="The © symbol and the current year are added automatically, e.g. © 2026 Pamban Swami Home Care. All rights reserved." />
        </section>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save footer'}</button>
        </div>
      </form>
    </>
  );
}
