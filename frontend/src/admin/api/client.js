// in production the API is served from the same address as the admin; in development it runs on port 5000
export const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? 'http://localhost:5000' : '');
export const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin;

const TOKEN_KEY = 'pamban_admin_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// absolute URL for an uploaded file such as /uploads/123.png
export const assetUrl = (path) => (path ? (path.startsWith('http') ? path : `${API_URL}${path}`) : '');

async function request(method, path, body) {
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const isForm = body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';

  const res = await fetch(`${API_URL}/api${path}`, {
    method,
    headers,
    body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
  });
  const data = await res.json().catch(() => ({}));

  // an expired token on a protected call sends the user back to login
  if (res.status === 401 && token && !path.startsWith('/admin/login')) {
    clearToken();
    window.location.href = '/admin/login';
  }
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  put: (path, body) => request('PUT', path, body),
  delete: (path) => request('DELETE', path),
  upload: async (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('POST', '/admin/upload', form);
  },
};
