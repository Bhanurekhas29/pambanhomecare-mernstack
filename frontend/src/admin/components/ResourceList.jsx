import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, assetUrl } from '../api/client';
import { useToast } from './Toast.jsx';
import './ResourceList.css';

const renderCell = (row, col) => {
  const value = row[col.key];
  if (col.format) return col.format(value, row) ?? '';
  if (col.type === 'image') {
    return value
      ? <img className="thumb" src={assetUrl(value)} alt="" />
      : <span className="thumb thumb-empty" title="No photo yet">No photo</span>;
  }
  if (col.type === 'bool') return <span className={`pill ${value ? 'pill-on' : 'pill-off'}`}>{value ? 'Yes' : 'No'}</span>;
  if (col.type === 'date') return value ? new Date(value).toLocaleDateString() : '';
  if (col.type === 'datetime') return value ? new Date(value).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';
  if (col.type === 'status') return <span className={`pill pill-${value}`}>{value ? value[0].toUpperCase() + value.slice(1) : ''}</span>;
  return value ?? '';
};

export default function ResourceList({ config, path }) {
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [orders, setOrders] = useState({}); // id -> typed order number
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const load = () =>
    api.get(config.endpoint)
      .then((data) => {
        setRows(data);
        setOrders(Object.fromEntries(data.map((r, i) => [r.id, r.sortOrder ?? i + 1])));
      })
      .catch((e) => setError(e.message));

  useEffect(() => {
    setRows(null);
    load();
  }, [config.endpoint]);

  const remove = async (row) => {
    if (!window.confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    try {
      await api.delete(`${config.endpoint}/${row.id}`);
      setRows((current) => current.filter((r) => r.id !== row.id));
      toast.success(`${config.singular} deleted`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const orderChanged = rows?.some((r) => Number(orders[r.id]) !== r.sortOrder);

  const saveOrder = async () => {
    // lowest number first; equal numbers keep their current position
    const ids = rows
      .map((r, i) => ({ id: r.id, n: Number(orders[r.id]) || 0, i }))
      .sort((a, b) => a.n - b.n || a.i - b.i)
      .map((r) => r.id);
    setSaving(true);
    try {
      await api.put(`${config.endpoint}/reorder`, { ids });
      await load();
      toast.success('Order saved');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };

  const colSpan = config.columns.length + 1 + (config.reorderable ? 1 : 0);
  // the first text column links to the edit page (an image column cannot)
  const linkKey = (config.columns.find((c) => c.link) || config.columns.find((c) => c.type !== 'image'))?.key;

  return (
    <>
      <div className="page-head">
        <h1>{config.title}</h1>
        <div className="head-actions">
          {config.extraAction && <Link to={config.extraAction.to} className="btn btn-outline">{config.extraAction.label}</Link>}
          {config.reorderable && (
            <button type="button" className="btn btn-outline" onClick={saveOrder} disabled={!orderChanged || saving}>
              {saving ? 'Saving...' : 'Save order'}
            </button>
          )}
          {!config.noAdd && <Link to={`/${path}/new`} className="btn">+ Add {config.singular.toLowerCase()}</Link>}
        </div>
      </div>
      {error && <div className="alert alert-error">{error}</div>}
      {config.reorderable && rows?.length > 1 && (
        <p className="reorder-tip">Type a number in the Order column and click <strong>Save order</strong>. Lower numbers appear first on the website.</p>
      )}
      <div className="card table-card">
        <table className="data-table">
          <thead>
            <tr>
              {config.reorderable && <th className="order-col">Order</th>}
              {config.columns.map((c) => <th key={c.key} className={c.hideOnMobile ? 'hide-sm' : ''}>{c.label}</th>)}
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows === null && <tr><td colSpan={colSpan} className="empty">Loading...</td></tr>}
            {rows?.length === 0 && <tr><td colSpan={colSpan} className="empty">{config.emptyText || 'Nothing here yet.'}</td></tr>}
            {rows?.map((row) => (
              <tr key={row.id}>
                {config.reorderable && (
                  <td className="order-col">
                    <input
                      type="number" min="1" className="order-input" aria-label={`Order of ${row.label || row.title || row.id}`}
                      value={orders[row.id] ?? ''}
                      onChange={(e) => setOrders((o) => ({ ...o, [row.id]: e.target.value }))}
                    />
                  </td>
                )}
                {config.columns.map((c) => (
                  <td key={c.key} className={`${c.hideOnMobile ? 'hide-sm' : ''} ${c.nowrap ? 'nowrap' : ''}`}>
                    {c.key === linkKey ? <Link to={`/${path}/${row.id}`}>{renderCell(row, c)}</Link> : renderCell(row, c)}
                  </td>
                ))}
                <td className="actions-col">
                  <Link to={`/${path}/${row.id}`} className="btn btn-outline btn-sm">{config.editLabel || 'Edit'}</Link>
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(row)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
