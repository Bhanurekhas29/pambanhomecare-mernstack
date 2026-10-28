import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import './AdminLayout.css';

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // on phones the sidebar slides over the page; close it after choosing a page
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="admin-shell">
      <header className="mobile-bar">
        <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <strong>Pamban Swami Admin</strong>
      </header>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
