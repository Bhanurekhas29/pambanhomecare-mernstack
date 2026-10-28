import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import AuthCard from '../components/AuthCard.jsx';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await api.post('/admin/forgot-password', { email });
      setMessage(res.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Forgot password" subtitle="Enter your account email and we will send a reset link">
      {error && <div className="alert alert-error">{error}</div>}
      {message ? (
        <div className="alert alert-success">{message}</div>
      ) : (
        <form onSubmit={submit}>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" autoFocus required value={email}
              onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="btn" disabled={busy}>{busy ? 'Sending...' : 'Send reset link'}</button>
        </form>
      )}
      <div className="auth-links"><Link to="/login">Back to login</Link></div>
    </AuthCard>
  );
}
