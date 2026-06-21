const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export const api = {
  destinations: (params = {}) => request(`/destinations?${new URLSearchParams(params)}`),
  destination: (id) => request(`/destinations/${id}`),
  reviews: (id) => request(`/destinations/${id}/reviews`),
  addReview: (id, body) => request(`/destinations/${id}/reviews`, { method: 'POST', body: JSON.stringify(body) }),
  saved: () => request('/saved'),
  save: (destination_id) => request('/saved', { method: 'POST', body: JSON.stringify({ destination_id }) }),
  unsave: (id) => request(`/saved/${id}`, { method: 'DELETE' }),
  chat: (body) => request('/chat', { method: 'POST', body: JSON.stringify(body) })
};
