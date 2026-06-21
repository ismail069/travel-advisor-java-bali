export function destinationImageUrl(destination, width = 1200, height = 800) {
  const prompt = [
    'realistic travel photography',
    destination.name,
    destination.city,
    destination.province,
    destination.island,
    'Indonesia',
    destination.category_en || destination.category_key,
    'clear daylight',
    'wide angle',
    'no text'
  ].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(destination.id || destination.name.length),
    model: 'flux',
    nologo: 'true'
  });

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}
