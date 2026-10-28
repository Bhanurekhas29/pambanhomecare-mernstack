// in production the API is served from the same address as the website; in development it runs on port 5000
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');

// absolute URL for an uploaded file such as /uploads/123.png
export const assetUrl = (path) => (path ? (path.startsWith('http') ? path : `${API_URL}${path}`) : '');

async function request(method, path, body) {
  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.');
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
};

// everything the page needs, fetched together
export async function loadSite() {
  const keys = {
    settings: '/site-settings',
    menu: '/menu',
    hero: '/hero',
    about: '/about',
    servicesSection: '/services-section',
    services: '/services',
    physioSection: '/physiotherapy-section',
    physio: '/physiotherapy',
    whyChoose: '/why-choose-us',
    professionalCare: '/professional-care',
    promises: '/promises',
    howItWorks: '/how-it-works',
    google: '/google-business',
    contact: '/contact-us',
    footer: '/footer',
    floatingIcons: '/floating-icons',
    seo: '/seo',
  };
  const entries = await Promise.all(Object.entries(keys).map(async ([k, path]) => [k, await api.get(path)]));
  return Object.fromEntries(entries);
}
