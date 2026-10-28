import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { groups } from '../nav';
import './Dashboard.css';

const tiles = [
  { key: 'newEnquiries', label: 'New enquiries' },
  { key: 'enquiries', label: 'Total enquiries' },
  { key: 'services', label: 'Services' },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/admin/stats').then(setStats).catch(() => {});
  }, []);

  return (
    <>
      <div className="page-head"><h1>Dashboard</h1></div>
      <div className="stat-grid">
        {tiles.map((t) => (
          <div className="card stat" key={t.key}>
            <span className="stat-value">{stats ? stats[t.key] : '-'}</span>
            <span className="stat-label">{t.label}</span>
          </div>
        ))}
      </div>

      {groups.map((group) => (
        <section className="card dash-group" key={group.heading}>
          <h2>{group.heading}</h2>
          <div className="dash-links">
            {group.items.map((item) => (
              <Link key={item.to} to={item.to} className="dash-link">
                <span className="material-symbols-outlined" aria-hidden="true">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
