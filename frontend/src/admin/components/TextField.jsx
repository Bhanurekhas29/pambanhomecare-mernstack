// Labelled text input (or textarea when `rows` is given) bound to values[name]
export default function TextField({ label, name, values, set, hint, rows, required }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}{required && <span className="req"> *</span>}</label>
      {rows ? (
        <textarea id={name} rows={rows} required={required} value={values[name] || ''} onChange={(e) => set(name, e.target.value)} />
      ) : (
        <input id={name} type="text" required={required} value={values[name] || ''} onChange={(e) => set(name, e.target.value)} />
      )}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}
