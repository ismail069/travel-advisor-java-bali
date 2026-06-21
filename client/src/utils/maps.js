export function exactGoogleMapsUrl(destination) {
  const latitude = Number(destination?.latitude);
  const longitude = Number(destination?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return destination?.google_maps_url || '#';
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

export function googleMapsEmbedUrl(destination) {
  const latitude = Number(destination?.latitude);
  const longitude = Number(destination?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return '';
  }

  return `https://maps.google.com/maps?q=${latitude},${longitude}&z=14&output=embed`;
}
