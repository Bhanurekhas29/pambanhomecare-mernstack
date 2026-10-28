import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { useToast } from './Toast.jsx';
import IconPicker from './IconPicker.jsx';
import ImageUpload from './ImageUpload.jsx';
import './ResourceForm.css';

const initialValues = (fields) =>
  Object.fromEntries(fields.map((f) => [f.name, f.default ?? (f.type === 'checkbox' ? false : '')]));

const isBlank = (v) => v === undefined || v === null || String(v).trim() === '';

// Field options: required, requiredOnCreate, showIf(values) to show only in some cases, hint
export default function ResourceForm({ config, path }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const isNew = !id;
  const [values, setValues] = useState(initialValues(config.fields));
  const [loading, setLoading] = useState(!isNew);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isNew) return setValues(initialValues(config.fields));
    setLoading(true);
    api.get(`${config.endpoint}/${id}`)
      .then((row) => setValues({ ...initialValues(config.fields), ...row, password: '' }))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id, config]);

  const set = (name, value) => setValues((v) => ({ ...v, [name]: value }));
  const visible = (f) => !f.showIf || f.showIf(values);
  const mustFill = (f) => visible(f) && (f.required || (f.requiredOnCreate && isNew));

  const submit = async (e) => {
    e.preventDefault();
    const missing = config.fields.find((f) => mustFill(f) && f.type !== 'checkbox' && isBlank(values[f.name]));
    if (missing) return toast.error(`${typeof missing.label === 'function' ? missing.label(values) : missing.label} is required`);

    setBusy(true);
    try {
      const body = { ...values };
      config.fields.forEach((f) => {
        if ((f.secret && !body[f.name]) || f.type === 'readonly') delete body[f.name];
      });
      if (isNew) await api.post(config.endpoint, body);
      else await api.put(`${config.endpoint}/${id}`, body);
      toast.success(`${config.singular} ${isNew ? 'added' : 'updated'}`);
      navigate(`/${path}`);
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <div className="alert alert-error">{error}</div>;

  const renderField = (field) => {
    // label and hint may be functions of the current values (e.g. they change with the chosen icon type)
    const f = {
      ...field,
      label: typeof field.label === 'function' ? field.label(values) : field.label,
      hint: typeof field.hint === 'function' ? field.hint(values) : field.hint,
    };
    const required = mustFill(f);
    const label = <>{f.label}{required && <span className="req"> *</span>}</>;

    if (f.type === 'checkbox') {
      return (
        <div key={f.name} className="field check">
          <input id={f.name} type="checkbox" checked={!!values[f.name]} onChange={(e) => set(f.name, e.target.checked)} />
          <label htmlFor={f.name}>{f.label}</label>
          {f.hint && <span className="hint">{f.hint}</span>}
        </div>
      );
    }
    if (f.type === 'readonly') {
      const shown = f.format ? f.format(values[f.name], values) : values[f.name];
      return (
        <div key={f.name} className="field">
          <label>{f.label}</label>
          <div className="readonly-value">{isBlank(shown) ? '-' : shown}</div>
        </div>
      );
    }
    if (f.type === 'select') {
      return (
        <div key={f.name} className="field">
          <label htmlFor={f.name}>{label}</label>
          <select id={f.name} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)}>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {f.hint && <span className="hint">{f.hint}</span>}
        </div>
      );
    }
    if (f.type === 'image') {
      return <ImageUpload key={f.name} label={f.label} hint={f.hint} value={values[f.name]} onChange={(v) => set(f.name, v)} />;
    }
    if (f.type === 'icon') {
      return (
        <div key={f.name} className="field">
          <label>{label}</label>
          <IconPicker value={values[f.name]} onChange={(v) => set(f.name, v)} />
          {f.hint && <span className="hint">{f.hint}</span>}
        </div>
      );
    }
    return (
      <div key={f.name} className="field">
        <label htmlFor={f.name}>{label}</label>
        {f.type === 'textarea' ? (
          <textarea id={f.name} rows={4} required={required} value={values[f.name] ?? ''} onChange={(e) => set(f.name, e.target.value)} />
        ) : (
          <input
            id={f.name}
            type={f.type}
            value={values[f.name] ?? ''}
            required={required}
            minLength={f.type === 'password' ? 8 : undefined}
            autoComplete={f.type === 'password' ? 'new-password' : undefined}
            onChange={(e) => set(f.name, f.type === 'number' ? Number(e.target.value) : e.target.value)}
          />
        )}
        {f.hint && <span className="hint">{f.hint}</span>}
      </div>
    );
  };

  return (
    <>
      <div className="page-head">
        <h1>{isNew ? `Add ${config.singular.toLowerCase()}` : config.editTitle || `Edit ${config.singular.toLowerCase()}`}</h1>
      </div>
      <form className="card form-card" onSubmit={submit}>
        {config.fields.filter(visible).map(renderField)}
        <div className="form-actions">
          <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save'}</button>
          <Link to={`/${path}`} className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  );
}
