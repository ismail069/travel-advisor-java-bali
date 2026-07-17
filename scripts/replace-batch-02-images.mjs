import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const manifestPath = path.join(root, 'exports/image-attributions-batch-02.json');
const replacements = new Map([
  [9, 'File:Cathedral of Jakarta - exterior (2025) - img 05.jpg'],
  [12, 'File:Jembatan Cinta (Love Bridge) - panoramio.jpg'],
  [19, 'File:Tampak Benteng Sisi Utara Keraton Surosowan.jpg'],
  [22, 'File:Masjid agung banten lama.jpg'],
  [35, 'File:Braga Street 2023.jpg'],
]);

const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
for (const item of manifest) {
  const title = replacements.get(item.destinationId);
  if (!title) continue;
  const url = new URL('https://commons.wikimedia.org/w/api.php');
  url.search = new URLSearchParams({ action: 'query', titles: title, prop: 'imageinfo', iiprop: 'url|extmetadata|size', format: 'json', origin: '*' });
  const response = await fetch(url, { headers: { 'User-Agent': 'JawaBaliTripContentAudit/1.0 (iatechdigital069@gmail.com)' } });
  const json = await response.json();
  const page = Object.values(json.query.pages)[0];
  const info = page.imageinfo[0];
  const meta = info.extmetadata;
  const imageResponse = await fetch(info.url, { headers: { 'User-Agent': 'JawaBaliTripContentAudit/1.0 (iatechdigital069@gmail.com)' } });
  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  const rawPath = path.join(root, 'exports/image-downloads-batch-02', `${item.destinationId}-${item.slug}${path.extname(new URL(info.url).pathname)}`);
  await fs.writeFile(rawPath, buffer);
  await sharp(buffer).resize(1200, 800, { fit: 'cover', position: 'attention' }).webp({ quality: 82 }).toFile(path.join(root, 'client/public', item.localPath));
  Object.assign(item, {
    commonsTitle: page.title,
    sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`,
    sourceImage: info.url,
    downloadUrl: info.url,
    artist: meta.Artist?.value?.replace(/<[^>]+>/g, '') || 'Wikimedia Commons contributor',
    credit: meta.Credit?.value?.replace(/<[^>]+>/g, '') || '',
    license: meta.LicenseShortName?.value || meta.UsageTerms?.value || 'See source page',
    licenseUrl: meta.LicenseUrl?.value || item.sourcePage,
    originalWidth: info.width,
    originalHeight: info.height,
  });
  console.log(`Replaced ${item.destinationId}: ${page.title}`);
}
await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
