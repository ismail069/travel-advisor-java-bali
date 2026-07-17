import fs from 'node:fs/promises';

const ids = new Set([4,5,6,7,9,10,11,12,14,15,16,17,19,20,21,22,26,27,28,29,30,31,32,34,35,36,37,38,39,40]);
const base = JSON.parse(await fs.readFile('exports/destinations.json', 'utf8')).filter((row) => ids.has(row.id));
const text = new Map(JSON.parse(await fs.readFile('exports/content-text-batch-02.json', 'utf8')).map((row) => [row.id, row]));
const images = new Map(JSON.parse(await fs.readFile('exports/image-attributions-batch-02.json', 'utf8')).map((row) => [row.destinationId, row]));
const today = '2026-07-16';
const drafts = base.map((row) => ({ ...row, ...text.get(row.id), image_url: images.get(row.id).localPath, image_attribution: images.get(row.id), editorial_status: 'draft_needs_fact_check', author: 'Ismail', updated_at_draft: today }));
const enhancements = drafts.map(({ id, short_description_id, description_id, activities_id, best_time_to_visit_id, travel_notes_id, image_url, image_attribution, editorial_status, author, updated_at_draft }) => ({ id, short_description_id, description_id, activities_id, best_time_to_visit_id, travel_notes_id, image_url, image_attribution, editorial_status, author, updated_at_draft }));

const current = JSON.parse(await fs.readFile('client/content/destination-enhancements.json', 'utf8'));
const merged = [...current.filter((row) => !ids.has(row.id)), ...enhancements].sort((a, b) => a.id - b.id);
await fs.writeFile('client/content/destination-enhancements.json', `${JSON.stringify(merged, null, 2)}\n`);
await fs.writeFile('exports/content-drafts-batch-02.json', `${JSON.stringify(drafts, null, 2)}\n`);

const fields = ['id','name_id','province','city','short_description_id','description_id','activities_id','best_time_to_visit_id','travel_notes_id','image_url','editorial_status','author','updated_at_draft'];
const csv = [fields.join(','), ...drafts.map((row) => fields.map((field) => `"${String(row[field] ?? '').replaceAll('"', '""')}"`).join(','))].join('\n');
await fs.writeFile('exports/content-drafts-batch-02.csv', `${csv}\n`);

const sqlValue = (value) => `'${String(value).replaceAll("'", "''")}'`;
const sql = [`-- REVIEW DRAFT ONLY. Do not run before editorial fact-check.`, 'begin;', ...drafts.map((row) => `update public.destinations set\n  short_description_id = ${sqlValue(row.short_description_id)},\n  description_id = ${sqlValue(row.description_id)},\n  activities_id = ${sqlValue(row.activities_id)},\n  best_time_to_visit_id = ${sqlValue(row.best_time_to_visit_id)},\n  travel_notes_id = ${sqlValue(row.travel_notes_id)},\n  image_url = ${sqlValue(row.image_url)}\nwhere id = ${row.id};`), 'commit;', ''];
await fs.writeFile('exports/update-destinations-batch-02.sql', sql.join('\n\n'));

const duplicates = (field) => drafts.filter((row, i) => drafts.findIndex((other) => other[field] === row[field]) !== i).map((row) => row.id);
const stats = drafts.map((row) => ({ id: row.id, short: row.short_description_id.length, description: row.description_id.length, total: ['short_description_id','description_id','activities_id','best_time_to_visit_id','travel_notes_id'].reduce((sum, field) => sum + row[field].length, 0) }));
const report = `# Batch 02 review\n\n- Destinations: ${drafts.length}\n- Local licensed images: ${images.size}\n- Status: draft_needs_fact_check\n- Supabase mutation: none\n- Duplicate descriptions: ${duplicates('description_id').length}\n- Duplicate activities: ${duplicates('activities_id').length}\n- Average editorial characters: ${Math.round(stats.reduce((sum, row) => sum + row.total, 0) / stats.length)}\n- Description length range: ${Math.min(...stats.map((row) => row.description))}-${Math.max(...stats.map((row) => row.description))}\n\nReview all time-sensitive operational claims, weather/sea conditions, access, and attraction availability before publishing.\n`;
await fs.writeFile('exports/batch-02-review.md', report);
console.log({ drafts: drafts.length, merged: merged.length, duplicateDescriptions: duplicates('description_id'), duplicateActivities: duplicates('activities_id') });
