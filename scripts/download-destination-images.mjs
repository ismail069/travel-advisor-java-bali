import fs from 'fs';
import path from 'path';
import { localImagePath, parseCsv, remoteImageUrl } from './image-data.mjs';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/download-destination-images.mjs <destinations_rows.csv>');
  process.exit(1);
}

const csv = fs.readFileSync(csvPath, 'utf8');
const rows = parseCsv(csv);
const outputDir = path.join(process.cwd(), 'client', 'public', 'images', 'destinations');
fs.mkdirSync(outputDir, { recursive: true });

for (const row of rows) {
  const publicPath = localImagePath(row);
  const filePath = path.join(process.cwd(), 'client', 'public', publicPath.replace(/^\//, ''));
  const svgPath = filePath.replace(/\.jpg$/, '.svg');
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1024) {
    console.log(`skip ${publicPath}`);
    continue;
  }
  if (fs.existsSync(svgPath) && fs.statSync(svgPath).size > 1024) {
    console.log(`skip ${localImagePath(row, 'svg')}`);
    continue;
  }

  const url = remoteImageUrl(row);
  console.log(`download ${row.id} ${row.name}`);
  const response = await fetchWithRetry(url, row);
  if (!response) {
    fs.writeFileSync(svgPath, fallbackSvg(row));
    console.warn(`fallback ${row.id} ${row.name}`);
    continue;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
  await sleep(1200);
}

console.log(`Done. Images are in ${outputDir}`);

async function fetchWithRetry(url, row) {
  for (let attempt = 1; attempt <= 4; attempt += 1) {
    const response = await fetch(url);
    if (response.ok) return response;
    const wait = response.status === 429 ? attempt * 3500 : attempt * 1000;
    console.warn(`retry ${attempt} ${row.id} ${row.name}: ${response.status}, wait ${wait}ms`);
    await sleep(wait);
  }
  return null;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function fallbackSvg(row) {
  const title = escapeXml(row.name);
  const location = escapeXml([row.city, row.province].filter(Boolean).join(', '));
  const category = escapeXml(row.category_en || row.category_key || 'Travel');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#a742f5"/>
      <stop offset="55%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#14b8a6"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#020617" stop-opacity=".05"/>
      <stop offset="100%" stop-color="#020617" stop-opacity=".82"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <circle cx="930" cy="170" r="95" fill="#fde68a" opacity=".85"/>
  <path d="M0 540 C170 390 270 460 390 330 C520 190 650 440 780 290 C930 130 1010 420 1200 260 L1200 800 L0 800 Z" fill="#172554" opacity=".78"/>
  <path d="M0 610 C210 500 330 600 500 470 C650 350 820 590 980 460 C1080 380 1140 430 1200 390 L1200 800 L0 800 Z" fill="#022c22" opacity=".72"/>
  <path d="M0 640 C190 690 310 600 470 660 C650 735 830 600 1010 660 C1100 690 1160 680 1200 665 L1200 800 L0 800 Z" fill="#f8fafc" opacity=".18"/>
  <rect width="1200" height="800" fill="url(#shade)"/>
  <text x="72" y="560" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="62" font-weight="800">${title}</text>
  <text x="74" y="625" fill="#f3e8ff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700">${category}</text>
  <text x="74" y="680" fill="#e0f2fe" font-family="Inter, Arial, sans-serif" font-size="30">${location}</text>
</svg>`;
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
