import { useEffect, useState } from 'react';
import { api, assetUrl } from '../api/client';
import './AuthCard.css';

export default function AuthCard({ title, subtitle, children }) {
  const [site, setSite] = useState(null);

  useEffect(() => {
    api.get('/site-settings').then(setSite).catch(() => {});
  }, []);

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          {site?.headerLogoUrl && <img className="auth-logo" src={assetUrl(site.headerLogoUrl)} alt="" />}
          <span className="auth-brand-text">
            <span className="auth-brand-name">{site?.siteName || 'Pamban Swami'}</span>
            <span className="auth-brand-tag">{site?.tagline || 'HOME CARE'}</span>
          </span>
        </div>
        <h1>{title}</h1>
        {subtitle && <p className="auth-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
