import fs from 'node:fs';
import path from 'node:path';

const csvPath = process.argv[2];

if (!csvPath) {
  console.error('Usage: node scripts/generate-latest-destination-sync.mjs <destinations.csv>');
  process.exit(1);
}

const outputPath = path.join('server', 'db', 'sync_latest_destinations.sql');
const nameIdOutputPath = path.join('server', 'db', 'add_name_id.sql');
const mapUrlOutputPath = path.join('server', 'db', 'update_google_maps_urls.sql');
const textColumns = [
  'name',
  'name_id',
  'island',
  'province',
  'city',
  'category_key',
  'category_id',
  'category_en',
  'short_description_id',
  'short_description_en',
  'description_id',
  'description_en',
  'image_url',
  'address',
  'google_maps_url',
  'activities_id',
  'activities_en',
  'best_time_to_visit_id',
  'best_time_to_visit_en',
  'travel_notes_id',
  'travel_notes_en',
  'source_name',
  'source_url'
];
const numberColumns = ['id', 'latitude', 'longitude', 'seed_rating', 'seed_review_count'];
const columns = [
  'id',
  ...textColumns.slice(0, 23),
  'latitude',
  'longitude',
  'seed_rating',
  'seed_review_count'
];

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];

    if (quoted) {
      if (char === '"' && next === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      quoted = true;
    } else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }

  if (field || row.length) {
    row.push(field.replace(/\r$/, ''));
    rows.push(row);
  }

  const [headers, ...records] = rows;
  return records
    .filter((record) => record.some((value) => value !== ''))
    .map((record) => Object.fromEntries(headers.map((header, index) => [header, record[index] ?? ''])));
}

function sqlValue(value, column) {
  if (value === undefined || value === '') return 'NULL';
  if (numberColumns.includes(column)) return Number.isFinite(Number(value)) ? String(Number(value)) : 'NULL';
  return `'${String(value).replace(/'/g, "''")}'`;
}

function exactGoogleMapsUrl(row) {
  const latitude = Number(row.latitude);
  const longitude = Number(row.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return row.google_maps_url || '';
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
for (const row of rows) {
  row.google_maps_url = exactGoogleMapsUrl(row);
}
const updateColumns = columns.filter((column) => column !== 'id');
const statements = rows.map((row) => {
  const values = columns.map((column) => sqlValue(row[column], column)).join(', ');
  const updates = updateColumns.map((column) => `${column} = EXCLUDED.${column}`).join(', ');
  return `INSERT INTO destinations (${columns.join(', ')}) VALUES (${values}) ON CONFLICT (id) DO UPDATE SET ${updates};`;
});

const sql = `-- Generated from latest destinations CSV. Run in Supabase SQL Editor to sync IDs and destination data.
BEGIN;

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS name_id TEXT;

${statements.join('\n')}

UPDATE destinations SET name_id = name WHERE name_id IS NULL;

COMMIT;
`;

fs.writeFileSync(outputPath, sql);

const nameIdSql = `-- Generated from latest destinations CSV. Run sync_latest_destinations.sql for full data sync.
BEGIN;

ALTER TABLE destinations ADD COLUMN IF NOT EXISTS name_id TEXT;

${rows.map((row) => `UPDATE destinations SET name_id = ${sqlValue(row.name_id || row.name, 'name_id')} WHERE id = ${sqlValue(row.id, 'id')};`).join('\n')}

UPDATE destinations SET name_id = name WHERE name_id IS NULL;

COMMIT;
`;

fs.writeFileSync(nameIdOutputPath, nameIdSql);

const mapUrlSql = `-- Generated from latest destinations CSV. Uses exact latitude/longitude only.
BEGIN;

${rows.map((row) => `UPDATE destinations SET google_maps_url = ${sqlValue(row.google_maps_url, 'google_maps_url')} WHERE id = ${sqlValue(row.id, 'id')};`).join('\n')}

COMMIT;
`;

fs.writeFileSync(mapUrlOutputPath, mapUrlSql);
console.log(`Generated ${outputPath} with ${rows.length} rows.`);
console.log(`Generated ${nameIdOutputPath} with ${rows.length} name_id updates.`);
console.log(`Generated ${mapUrlOutputPath} with ${rows.length} Google Maps URL updates.`);
