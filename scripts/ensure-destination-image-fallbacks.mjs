import fs from 'fs';
import path from 'path';
import { localImagePath, parseCsv } from './image-data.mjs';

const csvPath = process.argv[2];
if (!csvPath) {
  console.error('Usage: node scripts/ensure-destination-image-fallbacks.mjs <destinations_rows.csv>');
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(csvPath, 'utf8'));
const outputDir = path.join(process.cwd(), 'client', 'public', 'images', 'destinations');
fs.mkdirSync(outputDir, { recursive: true });

let created = 0;
for (const row of rows) {
  const jpgPath = path.join(process.cwd(), 'client', 'public', localImagePath(row).replace(/^\//, ''));
  const svgPath = jpgPath.replace(/\.jpg$/, '.svg');
  if (fs.existsSync(jpgPath) || fs.existsSync(svgPath)) continue;
  fs.writeFileSync(svgPath, fallbackSvg(row));
  created += 1;
}

console.log(`Created ${created} SVG fallback images.`);

function fallbackSvg(row) {
  const title = escapeXml(row.name);
  const location = escapeXml([row.city, row.province].filter(Boolean).join(', '));
  const category = escapeXml(row.category_en || row.category_key || 'Travel');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="sky" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#a742f5"/>
      <stop offset="52%" stop-color="#2563eb"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
    <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#020617" stop-opacity=".04"/>
      <stop offset="100%" stop-color="#020617" stop-opacity=".86"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="800" fill="url(#sky)"/>
  <circle cx="930" cy="170" r="95" fill="#fde68a" opacity=".85"/>
  <path d="M0 540 C170 390 270 460 390 330 C520 190 650 440 780 290 C930 130 1010 420 1200 260 L1200 800 L0 800 Z" fill="#172554" opacity=".78"/>
  <path d="M0 610 C210 500 330 600 500 470 C650 350 820 590 980 460 C1080 380 1140 430 1200 390 L1200 800 L0 800 Z" fill="#022c22" opacity=".72"/>
  <path d="M0 640 C190 690 310 600 470 660 C650 735 830 600 1010 660 C1100 690 1160 680 1200 665 L1200 800 L0 800 Z" fill="#f8fafc" opacity=".18"/>
  <rect width="1200" height="800" fill="url(#shade)"/>
  <text x="72" y="550" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="58" font-weight="800">${title}</text>
  <text x="74" y="615" fill="#f3e8ff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="700">${category}</text>
  <text x="74" y="670" fill="#e0f2fe" font-family="Inter, Arial, sans-serif" font-size="30">${location}</text>
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
