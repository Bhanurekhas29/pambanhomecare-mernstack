import { useState } from 'react';
import { api } from '../api/client';
import { useToast } from '../components/Toast.jsx';
import '../components/ResourceForm.css';

export default function ChangePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) return toast.error('New passwords do not match');
    setBusy(true);
    try {
      const res = await api.post('/admin/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success(res.message);
      setForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="page-head"><h1>Change Password</h1></div>
      <form className="card form-card" onSubmit={submit}>
        <div className="field">
          <label htmlFor="current">Current password</label>
          <input id="current" type="password" required autoComplete="current-password" value={form.currentPassword}
            onChange={(e) => set('currentPassword', e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="new">New password</label>
          <input id="new" type="password" required minLength={8} autoComplete="new-password" value={form.newPassword}
            onChange={(e) => set('newPassword', e.target.value)} />
          <span className="hint">At least 8 characters</span>
        </div>
        <div className="field">
          <label htmlFor="confirm">Confirm new password</label>
          <input id="confirm" type="password" required minLength={8} autoComplete="new-password" value={form.confirm}
            onChange={(e) => set('confirm', e.target.value)} />
        </div>
        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Change password'}</button>
        </div>
      </form>
    </>
  );
}
