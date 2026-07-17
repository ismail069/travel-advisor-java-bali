import fs from 'node:fs/promises';
import path from 'node:path';
import { GoogleGenerativeAI } from '../server/node_modules/@google/generative-ai/dist/index.mjs';

const envText = await fs.readFile('.env.local', 'utf8');
for (const line of envText.split(/\r?\n/)) {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
}
const ids = new Set([4,5,6,7,9,10,11,12,14,15,16,17,19,20,21,22,26,27,28,29,30,31,32,34,35,36,37,38,39,40]);
const rows = JSON.parse(await fs.readFile('exports/destinations.json', 'utf8')).filter((row) => ids.has(row.id));
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const modelNames = ['gemini-3.5-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash-lite', 'gemini-2.5-pro'];
const output = [];
for (let start = 0; start < rows.length; start += 5) {
  const input = rows.slice(start, start + 5).map(({ id, name, name_id, city, province, category_id, address }) => ({ id, name: name_id || name, city, province, category_id, address }));
  const prompt = `Anda editor perjalanan Indonesia. Buat draft unik, faktual, dan berguna untuk setiap destinasi berikut. Kembalikan HANYA JSON array valid tanpa markdown. Setiap objek wajib punya id, short_description_id (2 kalimat, 180-280 karakter), description_id (2 paragraf dipisah \\n\\n, total 450-700 karakter), activities_id (1-2 kalimat spesifik), best_time_to_visit_id (1-2 kalimat), travel_notes_id (2 kalimat praktis). Hindari harga, jam buka, angka yang mudah berubah, klaim superlatif, rating, dan fakta yang tidak yakin. Jangan memakai frasa template yang sama antardestinasi. Tulis Bahasa Indonesia natural. Data: ${JSON.stringify(input)}`;
  let response;
  let lastError;
  for (const modelName of modelNames) {
    try {
      response = await genAI.getGenerativeModel({ model: modelName }).generateContent(prompt);
      break;
    } catch (error) {
      lastError = error;
      console.warn(`${modelName} failed with ${error.status || 'error'}; trying fallback.`);
    }
  }
  if (!response) throw lastError;
  const text = response.response.text().replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  const parsed = JSON.parse(text);
  output.push(...parsed);
  console.log(`Generated ${start + 1}-${start + parsed.length}`);
}
await fs.writeFile('exports/content-text-batch-02.json', `${JSON.stringify(output, null, 2)}\n`);
