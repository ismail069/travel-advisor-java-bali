import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { destinations } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data');
const dbPath = path.join(dataDir, 'jawabali.sqlite');

if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

export const db = new sqlite3.Database(dbPath);

export function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function onRun(error) {
      if (error) reject(error);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
}

export function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (error, row) => (error ? reject(error) : resolve(row)));
  });
}

export function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (error, rows) => (error ? reject(error) : resolve(rows)));
  });
}

export async function initDatabase() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await new Promise((resolve, reject) => db.exec(schema, (error) => (error ? reject(error) : resolve())));
  const row = await get('SELECT COUNT(*) AS total FROM destinations');
  if (row.total === 0) {
    const placeholders = destinations.map(() => '(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)').join(',');
    await run(
      `INSERT INTO destinations (
        name,island,province,city,category_key,category_id,category_en,short_description_id,short_description_en,
        description_id,description_en,image_url,address,latitude,longitude,google_maps_url,activities_id,activities_en,
        best_time_to_visit_id,best_time_to_visit_en,travel_notes_id,travel_notes_en,seed_rating,seed_review_count
      ) VALUES ${placeholders}`,
      destinations.flat()
    );
  }
}
