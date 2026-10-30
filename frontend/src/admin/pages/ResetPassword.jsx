import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import AuthCard from '../components/AuthCard.jsx';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') || '';
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('Passwords do not match');
    setBusy(true);
    try {
      const res = await api.post('/admin/reset-password', { token, password: form.password });
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Reset password" subtitle="Choose a new password for your account">
      {error && <div className="alert alert-error">{error}</div>}
      {!token && <div className="alert alert-error">This reset link is missing its token.</div>}
      {message ? (
        <div className="alert alert-success">{message}</div>
      ) : (
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="password">New password</label>
            <input id="password" type="password" minLength={8} required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
            <span className="hint">At least 8 characters with an uppercase letter, a lowercase letter, a number and a special character (such as @ # $ !)</span>
          </div>
          <div className="field">
            <label htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" minLength={8} required value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
          </div>
          <button className="btn" disabled={busy || !token}>{busy ? 'Saving...' : 'Reset password'}</button>
        </form>
      )}
      <div className="auth-links"><Link to="/login">Back to login</Link></div>
    </AuthCard>
  );
}
