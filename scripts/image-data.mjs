export function slugify(value) {
  return String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function localImagePath(row, extension = 'jpg') {
  return `/images/destinations/${row.id}-${slugify(row.name)}.${extension}`;
}

export function remoteImageUrl(row) {
  const prompt = [
    'realistic travel photography',
    row.name,
    row.city,
    row.province,
    row.island,
    'Indonesia',
    row.category_en || row.category_key,
    'clear daylight',
    'wide angle',
    'no text'
  ].filter(Boolean).join(', ');

  const params = new URLSearchParams({
    width: '1200',
    height: '800',
    seed: String(row.id),
    model: 'flux',
    nologo: 'true'
  });

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params.toString()}`;
}

export function parseCsv(input) {
  const rows = [];
  let row = [];
  let value = '';
  let inQuotes = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      row.push(value);
      value = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(value);
      if (row.some((cell) => cell !== '')) rows.push(row);
      row = [];
      value = '';
    } else {
      value += char;
    }
  }

  if (value || row.length) {
    row.push(value);
    rows.push(row);
  }

  const [headers, ...data] = rows;
  return data.map((cells) => Object.fromEntries(headers.map((header, index) => [header, cells[index] || ''])));
}
