import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import '../components/ResourceForm.css';

export default function EmailSettings() {
  const [values, setValues] = useState(null);
  const [password, setPassword] = useState('');
  const [testTo, setTestTo] = useState('');
  const toast = useToast();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    api.get('/admin/email-settings').then(setValues).catch((e) => setError(e.message));
  }, []);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      setValues(await api.put('/admin/email-settings', { ...values, smtpPass: password }));
      setPassword('');
      toast.success('Email settings saved');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const sendTest = async () => {
    setTesting(true);
    try {
      const res = await api.post('/admin/email-settings/test', { to: testTo });
      toast.success(res.message);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setTesting(false);
    }
  };

  if (!values) return error ? <div className="alert alert-error">{error}</div> : <p>Loading...</p>;

  return (
    <>
      <div className="page-head"><h1>Email Settings</h1></div>
      <form className="card form-card" onSubmit={submit}>
        <div className="field">
          <label htmlFor="enquiryEmail">Email to receive enquiries</label>
          <input id="enquiryEmail" type="email" value={values.enquiryEmail || ''} onChange={(e) => set('enquiryEmail', e.target.value)} />
          <span className="hint">An alert is sent here every time someone submits the Contact Us form</span>
        </div>
        <div className="field">
          <label htmlFor="smtpUser">Gmail address to send from</label>
          <input id="smtpUser" type="email" value={values.smtpUser || ''} onChange={(e) => set('smtpUser', e.target.value)} />
          <span className="hint">The Gmail account that sends the emails, e.g. yourname@gmail.com</span>
        </div>
        <div className="field">
          <label htmlFor="smtpPass">Gmail app password</label>
          <input id="smtpPass" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder={values.hasPassword ? 'Saved. Leave empty to keep it' : ''} />
          <span className="hint">
            The 16-letter code from Google, not your normal Gmail password. Get it at myaccount.google.com, Security,
            2-Step Verification, App passwords. Spaces are fine.
          </span>
        </div>
        <div className="field">
          <label htmlFor="smtpHost">Mail server</label>
          <input id="smtpHost" type="text" value={values.smtpHost || ''} onChange={(e) => set('smtpHost', e.target.value)} />
          <span className="hint">Leave as smtp.gmail.com for Gmail</span>
        </div>
        <div className="field">
          <label htmlFor="smtpPort">Port</label>
          <input id="smtpPort" type="number" value={values.smtpPort ?? ''} onChange={(e) => set('smtpPort', e.target.value)} />
          <span className="hint">Leave as 587 for Gmail</span>
        </div>

        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
        </div>
      </form>

      <div className="card form-card" style={{ marginTop: 20 }}>
        <div className="field">
          <label htmlFor="testTo">Send a test email</label>
          <input id="testTo" type="email" placeholder={values.enquiryEmail || values.smtpUser || 'name@example.com'}
            value={testTo} onChange={(e) => setTestTo(e.target.value)} />
          <span className="hint">Save first, then send a test to check the settings work. Leave empty to send to the enquiry email.</span>
        </div>
        <div className="form-actions">
          <button type="button" className="btn" disabled={testing} onClick={sendTest}>{testing ? 'Sending...' : 'Send test email'}</button>
        </div>
      </div>
    </>
  );
}
