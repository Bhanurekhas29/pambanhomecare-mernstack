import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { api, assetUrl, SITE_URL } from '../api/client';
import { groups } from '../nav';
import './Sidebar.css';

const Icon = ({ name }) => <span className="material-symbols-outlined sidebar-icon" aria-hidden="true">{name}</span>;

export default function Sidebar({ open = false, onClose }) {
  const [site, setSite] = useState(null);

  useEffect(() => {
    api.get('/site-settings').then(setSite).catch(() => {});
  }, []);

  return (
    <aside
      className={`sidebar ${open ? 'open' : ''}`}
      onClick={(e) => { if (e.target.closest('a')) onClose?.(); }} // tapping any link closes the phone menu
    >
      <button type="button" className="sidebar-close" aria-label="Close menu" onClick={onClose}>
        <span className="material-symbols-outlined">close</span>
      </button>
      <NavLink to="/" className="sidebar-brand">
        {site?.headerLogoUrl && <img src={assetUrl(site.headerLogoUrl)} alt="" />}
        <span>
          <strong>Pamban Swami Home Care</strong>
          <small>Administration</small>
        </span>
      </NavLink>

      <nav className="sidebar-nav">
        <NavLink to="/" end className="sidebar-link"><Icon name="dashboard" />Dashboard</NavLink>
        <a href={SITE_URL} target="_blank" rel="noreferrer" className="sidebar-link"><Icon name="language" />View Website</a>
        {groups.map((group) => (
          <div className="sidebar-group" key={group.heading}>
            <div className="sidebar-heading">{group.heading}</div>
            {group.items.map((item) => (
              <NavLink key={item.to} to={item.to} className="sidebar-link"><Icon name={item.icon} />{item.label}</NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/change-password" className="sidebar-link"><Icon name="lock_reset" />Change Password</NavLink>
      </div>
    </aside>
  );
}
