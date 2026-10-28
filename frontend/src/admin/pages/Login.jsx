import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { api, getToken, setToken } from '../api/client';
import AuthCard from '../components/AuthCard.jsx';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (getToken()) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const { token } = await api.post('/admin/login', form);
      setToken(token);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthCard title="Admin login" subtitle="Sign in to manage your website">
      {error && <div className="alert alert-error">{error}</div>}
      <form onSubmit={submit}>
        <div className="field">
          <label htmlFor="username">Username or email</label>
          <input id="username" type="text" autoFocus required value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })} />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })} />
        </div>
        <button className="btn" disabled={busy}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <div className="auth-links"><Link to="/forgot-password">Forgot password?</Link></div>
    </AuthCard>
  );
}
