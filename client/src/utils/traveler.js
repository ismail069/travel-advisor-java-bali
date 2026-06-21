const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function getCookie(name) {
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')
    .slice(1)
    .join('=');
}

export function setCookie(name, value) {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function createTravelerId() {
  if (crypto.randomUUID) return crypto.randomUUID();
  return `traveler-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function getTravelerFromCookies() {
  const consent = getCookie('jb_cookie_consent') === 'yes';
  const id = getCookie('jb_traveler_id');
  const name = getCookie('jb_traveler_name');
  if (!consent || !id) return null;
  return {
    id: decodeURIComponent(id),
    name: name ? decodeURIComponent(name) : 'Traveler'
  };
}

export function saveTravelerToCookies(name) {
  const id = createTravelerId();
  setCookie('jb_cookie_consent', 'yes');
  setCookie('jb_traveler_id', id);
  setCookie('jb_traveler_name', name || 'Traveler');
  return { id, name: name || 'Traveler' };
}
