import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api, clearToken } from '../api/client';
import Sidebar from './Sidebar.jsx';
import ConfirmDialog from './ConfirmDialog.jsx';
import { useToast } from './Toast.jsx';
import './AdminLayout.css';

export default function AdminLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [title, setTitle] = useState('');
  const [askLogout, setAskLogout] = useState(false);
  const mainRef = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  // on phones the sidebar slides over the page; close it after choosing a page
  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    api.get('/admin/me').then(setAdmin).catch(() => {});
  }, []);

  // the page heading moves up into the top bar, so every page gets one heading in the same place
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return undefined;
    const sync = () => {
      const h1 = main.querySelector('.page-head h1');
      if (h1) h1.classList.add('in-topbar');
      setTitle(h1 ? h1.textContent : '');
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(main, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [pathname]);

  const logout = () => {
    setAskLogout(false);
    clearToken();
    navigate('/login', { replace: true });
    toast.success('You have been logged out successfully. Thank you, visit again!');
  };

  const name = !admin ? '' : admin.username === 'admin' ? 'Administrator' : admin.username;

  return (
    <div className="admin-shell">
      <header className="mobile-bar">
        <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <strong>Pamban Swami Home Care</strong>
      </header>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      {menuOpen && <div className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}

      <div className="admin-content">
        <header className="topbar">
          <h1 className="topbar-title">{title}</h1>
          <div className="topbar-user">
            <span className="topbar-avatar" aria-hidden="true">{(name || 'A').charAt(0).toUpperCase()}</span>
            <span className="topbar-who">
              <strong>{name}</strong>
              <small>Admin</small>
            </span>
            <button type="button" className="topbar-logout" onClick={() => setAskLogout(true)}>
              <span className="material-symbols-outlined" aria-hidden="true">logout</span>
              Log out
            </button>
          </div>
        </header>

        <main className="admin-main" ref={mainRef}>
          <Outlet context={{ admin, name }} />
        </main>
      </div>

      {askLogout && (
        <ConfirmDialog
          title="Log out?"
          message="Are you sure you want to log out of the admin panel?"
          confirmLabel="Yes, log out"
          onConfirm={logout}
          onCancel={() => setAskLogout(false)}
        />
      )}
    </div>
  );
}
