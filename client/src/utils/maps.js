export function exactGoogleMapsUrl(destination) {
  const query = destination?.name_id || destination?.name;
  if (!query) return destination?.google_maps_url || '#';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsEmbedUrl(destination) {
  const latitude = Number(destination?.latitude);
  const longitude = Number(destination?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return '';
  }

  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
}
