import fs from 'fs';
import path from 'path';
import { localImagePath, parseCsv } from './image-data.mjs';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/generate-image-url-updates.mjs <destinations_rows.csv>');
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(csv);
const output = [
  '-- Run this in Supabase SQL Editor to point image_url to local Vite public assets.',
  '-- First run: node scripts/download-destination-images.mjs <destinations_rows.csv>',
  'BEGIN;',
  ...rows.map((row) => {
    const imageUrl = resolveLocalImagePath(row);
    return `UPDATE destinations SET image_url = '${escapeSql(imageUrl)}' WHERE id = ${Number(row.id)};`;
  }),
  'COMMIT;',
  ''
].join('\n');

const outputPath = path.join(process.cwd(), 'server', 'db', 'update_image_urls.sql');
fs.writeFileSync(outputPath, output);
console.log(`Wrote ${rows.length} image URL updates to ${outputPath}`);

function escapeSql(value) {
  return String(value).replace(/'/g, "''");
}

function resolveLocalImagePath(row) {
  const jpgPath = path.join(process.cwd(), 'client', 'public', localImagePath(row).replace(/^\//, ''));
  if (fs.existsSync(jpgPath)) return localImagePath(row);
  return localImagePath(row, 'svg');
}
