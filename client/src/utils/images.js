export function destinationImageUrl(destination, extension = 'jpg') {
  const slug = String(destination.name || 'destination')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);

  return `/images/destinations/${destination.id || slug}-${slug}.${extension}`;
}
