import React from 'react';
import ReactDOM from 'react-dom/client';

// The website and the admin (/admin) are two apps in one build. Only the one being visited is
// downloaded, so their styles never mix.
const isAdmin = window.location.pathname === '/admin' || window.location.pathname.startsWith('/admin/');
const entry = isAdmin ? import('./admin/AdminEntry.jsx') : import('./SiteEntry.jsx');

entry.then(({ default: Root }) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <Root />
    </React.StrictMode>
  );
});
