import fs from 'fs';
import path from 'path';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/generate-image-url-updates.mjs <destinations_rows.csv>');
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(csv);
const output = [
  '-- Run this in Supabase SQL Editor to replace broken loremflickr image URLs.',
  '-- Images are generated from destination name, province, island, and category.',
  'BEGIN;',
  ...rows.map((row) => {
    const imageUrl = buildImageUrl(row);
    return `UPDATE destinations SET image_url = '${escapeSql(imageUrl)}' WHERE id = ${Number(row.id)};`;
  }),
  'COMMIT;',
  ''
].join('\n');

const outputPath = path.join(process.cwd(), 'server', 'db', 'update_image_urls.sql');
fs.writeFileSync(outputPath, output);
console.log(`Wrote ${rows.length} image URL updates to ${outputPath}`);

function buildImageUrl(row) {
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

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function parseCsv(input) {
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
