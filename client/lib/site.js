export const SITE_URL = 'https://jawabalitrip.web.id';
export const SITE_NAME = 'JawaBali Trip';
export const OWNER_NAME = 'JawaBali Trip Team';
export const CONTACT_EMAIL = 'iatechdigital069@gmail.com';

export function absoluteUrl(path = '/') {
  return new URL(path, SITE_URL).toString();
}

export function slugify(value = '') {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function destinationSlug(destination) {
  return `${destination.id}-${slugify(destination.name_id || destination.name)}`;
}
