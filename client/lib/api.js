import enhancements from '@/content/destination-enhancements.json';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const enhancementMap = new Map(enhancements.map((item) => [item.id, item]));

function applyEnhancement(destination) {
  return destination ? { ...destination, ...enhancementMap.get(destination.id) } : destination;
}

async function apiFetch(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
    next: options.next || { revalidate: 3600 }
  });
  if (!response.ok) throw new Error(`API request failed (${response.status})`);
  return response.json();
}
import fallbackDestinations from './fallback-destinations.json' with { type: "json" };

export async function getDestinations() {
  try {
    const data = await apiFetch('/destinations');
    return (data.destinations || []).map(applyEnhancement);
  } catch {
    console.warn('API request failed, using fallback destinations.');
    return fallbackDestinations.map(applyEnhancement);
  }
}

export async function getDestination(id) {
  try {
    const data = await apiFetch(`/destinations/${id}`);
    return applyEnhancement(data.destination || null);
  } catch {
    console.warn(`API request failed, using fallback destination for id ${id}.`);
    const destination = fallbackDestinations.find(d => d.id === Number(id));
    return destination ? applyEnhancement(destination) : null;
  }
}

export { API_URL };
