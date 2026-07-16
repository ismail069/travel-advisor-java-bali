const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    next: options.next || { revalidate: 3600 }
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}

export async function getDestinations() {
  try {
    const data = await apiFetch('/destinations');
    return data.destinations || [];
  } catch {
    return [];
  }
}

export async function getDestination(id) {
  try {
    const data = await apiFetch(`/destinations/${id}`);
    return data.destination || null;
  } catch {
    return null;
  }
}

export { API_URL };
