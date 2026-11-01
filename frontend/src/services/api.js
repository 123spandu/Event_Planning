import { siteConfig, isApiEnabled } from '../config/siteConfig.js';

const TOKEN_KEY = 'momentra_admin_token';

export const tokenStore = {
  get: () => {
    try { return sessionStorage.getItem(TOKEN_KEY); } catch { return null; }
  },
  set: (t) => {
    try { sessionStorage.setItem(TOKEN_KEY, t); } catch { /* ignore */ }
  },
  clear: () => {
    try { sessionStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
  },
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

/** Resolve an image path returned by the API (e.g. /uploads/x.jpg) to a full URL. */
export const resolveMediaUrl = (src) => {
  if (!src) return '';
  if (/^https?:\/\//i.test(src) || src.startsWith('data:')) return src;
  const origin = siteConfig.apiUrl.replace(/\/api$/, '');
  return `${origin}${src.startsWith('/') ? '' : '/'}${src}`;
};

export async function request(path, { method = 'GET', body, auth = false, signal } = {}) {
  if (!isApiEnabled()) throw new ApiError('Backend API is not configured.', 0);

  const headers = {};
  const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
  if (body && !isForm) headers['Content-Type'] = 'application/json';
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${siteConfig.apiUrl}${path}`, {
      method,
      headers,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError('Could not reach the server. Please check your connection and try again.', 0);
  }

  let data = null;
  const text = await res.text();
  if (text) {
    try { data = JSON.parse(text); } catch { data = { message: text }; }
  }

  if (!res.ok) {
    if (res.status === 401 && auth) {
      tokenStore.clear();
      window.dispatchEvent(new Event('momentra:unauthorized'));
    }
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.errors);
  }
  return data;
}

export const api = {
  // Public
  getServices: (o) => request('/services', o),
  getPackages: (o) => request('/packages', o),
  getGallery: (o) => request('/gallery', o),
  submitEnquiry: (payload) => request('/enquiries', { method: 'POST', body: payload }),

  // Admin
  login: (email, password) => request('/auth/login', { method: 'POST', body: { email, password } }),
  me: () => request('/auth/me', { auth: true }),
  stats: () => request('/admin/stats', { auth: true }),

  listEnquiries: (query = '') => request(`/admin/enquiries${query}`, { auth: true }),
  updateEnquiry: (id, body) => request(`/admin/enquiries/${id}`, { method: 'PATCH', body, auth: true }),
  deleteEnquiry: (id) => request(`/admin/enquiries/${id}`, { method: 'DELETE', auth: true }),

  adminServices: () => request('/admin/services', { auth: true }),
  createService: (body) => request('/admin/services', { method: 'POST', body, auth: true }),
  updateService: (id, body) => request(`/admin/services/${id}`, { method: 'PUT', body, auth: true }),
  deleteService: (id) => request(`/admin/services/${id}`, { method: 'DELETE', auth: true }),

  adminPackages: () => request('/admin/packages', { auth: true }),
  createPackage: (body) => request('/admin/packages', { method: 'POST', body, auth: true }),
  updatePackage: (id, body) => request(`/admin/packages/${id}`, { method: 'PUT', body, auth: true }),
  deletePackage: (id) => request(`/admin/packages/${id}`, { method: 'DELETE', auth: true }),

  adminGallery: () => request('/admin/gallery', { auth: true }),
  uploadGalleryImage: (formData) => request('/admin/gallery', { method: 'POST', body: formData, auth: true }),
  updateGalleryImage: (id, body) => request(`/admin/gallery/${id}`, { method: 'PATCH', body, auth: true }),
  deleteGalleryImage: (id) => request(`/admin/gallery/${id}`, { method: 'DELETE', auth: true }),
};
