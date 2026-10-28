import { useState } from 'react';
import { api, assetUrl } from '../api/client';
import './ImageUpload.css';

export default function ImageUpload({ label, value, onChange, hint }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const pick = async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    setError('');
    setBusy(true);
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="field">
      <label>{label}</label>
      <div className="image-upload">
        <div className="image-preview">
          {value ? <img src={assetUrl(value)} alt="" /> : <span>No image</span>}
        </div>
        <div className="image-actions">
          <label className="btn btn-outline btn-sm file-btn">
            {busy ? 'Uploading...' : value ? 'Replace' : 'Upload'}
            <input type="file" accept="image/*" onChange={pick} disabled={busy} hidden />
          </label>
          {value && <button type="button" className="btn btn-outline btn-sm" onClick={() => onChange('')}>Remove</button>}
        </div>
      </div>
      {hint && <span className="hint">{hint}</span>}
      {error && <span className="hint" style={{ color: 'var(--danger)' }}>{error}</span>}
    </div>
  );
}
