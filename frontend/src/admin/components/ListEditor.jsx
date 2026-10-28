import IconPicker from './IconPicker.jsx';
import './ListEditor.css';

// Editable list of small records (e.g. hero badges).
// `fields` = [{ name, label, icon?, wide? }]; a field flagged `icon` uses the icon picker.
export default function ListEditor({ label, hint, itemName = 'Item', items = [], fields, onChange, addLabel, max }) {
  const update = (index, name, value) =>
    onChange(items.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
  const remove = (index) => onChange(items.filter((_, i) => i !== index));
  const emptyValue = (f) => (f.type === 'checkbox' ? !!f.default : f.type === 'select' ? f.options[0].value : '');
  const add = () => onChange([...items, Object.fromEntries(fields.map((f) => [f.name, emptyValue(f)]))]);

  // picking a new position moves the item there
  const moveTo = (index, position) => {
    const next = [...items];
    next.splice(position - 1, 0, next.splice(index, 1)[0]);
    onChange(next);
  };

  return (
    <div className="field">
      <label>{label}</label>
      {hint && <span className="hint">{hint}</span>}
      <div className="list-editor">
        {items.map((item, index) => (
          <div key={index} className="list-row">
            <div className="list-row-head">
              <strong>{itemName} {index + 1}</strong>
              {items.length > 1 && (
                <label className="list-order">
                  Order
                  <select value={index + 1} onChange={(e) => moveTo(index, Number(e.target.value))}>
                    {items.map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)}
                  </select>
                </label>
              )}
              <button type="button" className="list-remove" onClick={() => remove(index)}>Remove</button>
            </div>
            <div className="list-fields">
              {fields.map((f) => (
                <div className={`list-field ${f.wide ? 'wide' : ''} ${f.type === 'checkbox' ? 'list-check' : ''}`} key={f.name}>
                  {f.type === 'checkbox' ? (
                    <label>
                      <input type="checkbox" checked={!!item[f.name]} onChange={(e) => update(index, f.name, e.target.checked)} />
                      {f.label}
                    </label>
                  ) : (
                    <span>{f.label}</span>
                  )}
                  {f.type === 'checkbox' ? null : f.type === 'select' ? (
                    <select value={item[f.name] || f.options[0].value} onChange={(e) => update(index, f.name, e.target.value)}>
                      {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : f.icon ? (
                    <IconPicker value={item[f.name]} onChange={(v) => update(index, f.name, v)} />
                  ) : f.multiline ? (
                    <textarea rows={3} value={item[f.name] || ''} onChange={(e) => update(index, f.name, e.target.value)} />
                  ) : (
                    <input type="text" value={item[f.name] || ''} onChange={(e) => update(index, f.name, e.target.value)} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {(!max || items.length < max) && (
          <button type="button" className="btn btn-outline btn-sm list-add" onClick={add}>+ {addLabel || `Add ${itemName.toLowerCase()}`}</button>
        )}
      </div>
    </div>
  );
}
