import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from '../client/node_modules/sharp/lib/index.js';

const repo = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const selections = [
  { slug: 'tegallalang-rice-terrace', title: 'File:Tegallalang Rice Terraces Bali.jpg' },
  { slug: 'sacred-monkey-forest-ubud', title: 'File:Temple in the Ubud Monkey Forest.jpg' },
  { slug: 'tirta-empul-temple', title: 'File:Pura Tirta Empul, Ubud, Bali, Indonesia.JPG' },
  { slug: 'campuhan-ridge-walk', title: 'File:Campuhan ridge walk Ubud Bali 20120827b.jpg', group: 'phase-4' },
  { slug: 'goa-gajah', title: 'File:Goa Gajah temple, Bedulu, Bali, Indonesia, 20220824 0929 0544.jpg', group: 'phase-4' },
  { slug: 'jatiluwih-rice-terraces', title: 'File:Jatiluwih rice terraces SF0001.jpg', group: 'phase-4' },
  { slug: 'ulun-danu-beratan-temple', title: 'File:Iconic Fifty Thousand Indonesian Rupiah, Pura Ulun Danu Beratan.jpg', group: 'phase-4' },
  { slug: 'sekumpul-waterfall', title: 'File:Air Terjun Sekumpul.jpg', group: 'phase-4' },
  { slug: 'lovina-beach', title: 'File:Morning of Lovina Beach 200507-6.jpg', group: 'phase-4' },
  { slug: 'munduk', title: 'File:Munduk, Bali.jpg', group: 'phase-4' },
  { slug: 'kelingking-beach', title: 'File:Kelingking Beach (T-Rex Bay) of Nusa Penida, Bali (2025) - img 08.jpg', group: 'phase-4' },
  { slug: 'broken-beach', title: 'File:Broken Beach.jpg', group: 'phase-4' },
  { slug: 'angels-billabong', title: "File:Angel's Billabong, Nusa Penida.jpg", group: 'phase-4' },
  { slug: 'bali-botanic-garden', title: 'File:Sang Waringin - Kebun Raya Bedugul, Tabanan-Bali. Photo by Pratamanese.jpg', group: 'phase-4' },
  { slug: 'handara-gate', title: 'File:Bali gate.jpg', group: 'phase-4' },
  { slug: 'banyumala-twin-waterfalls', title: 'File:Banyumala Waterfall.jpg', group: 'phase-4' },
  { slug: 'banjar-hot-springs', title: 'File:The famous Banjar Hot Springs in Bali (36380213925).jpg', group: 'phase-4' },
  { slug: 'brahmavihara-arama', title: 'File:Brahmavihara Arama Bali.jpg', group: 'phase-4' },
  { slug: 'ubud-palace', title: 'File:Ubud Palace, Bali, Indonesia, 20220822 0904 9820.jpg', group: 'phase-4' },
  { slug: 'ubud-art-market', title: 'File:Ubud Market, Ubud, Bali (15009558597).jpg', group: 'phase-4' },
  { slug: 'blanco-renaissance-museum', title: 'File:Blanco Renaissance Museum Ubud Bali 20120827a.jpg', group: 'phase-4' },
  { slug: 'museum-puri-lukisan', title: 'File:Puri Lukisan Museum (17032156926).jpg', group: 'phase-4' },
  { slug: 'arma-museum', title: 'File:Pintu masuk Museum Seni Agung Rai.jpg', group: 'phase-4' },
];
const stripHtml = (value = '') => value.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();
await fs.mkdir(path.join(repo, 'client/public/images/destinations/golden'), { recursive: true });
await fs.mkdir(path.join(repo, 'client/public/images/destinations/phase-4'), { recursive: true });
const attributions = [];
const attributionFile = path.join(repo, 'client/content/golden-image-attributions.json');
const previousAttributions = await fs.readFile(attributionFile, 'utf8').then(JSON.parse).catch(() => []);
for (const item of selections) {
  const previous = previousAttributions.find((entry) => entry.slug === item.slug);
  if (previous?.localPath && await fs.access(path.join(repo, 'client/public', previous.localPath)).then(() => true).catch(() => false)) {
    attributions.push(previous);
    continue;
  }
  const api = new URL('https://commons.wikimedia.org/w/api.php');
  api.search = new URLSearchParams({ action: 'query', titles: item.title, prop: 'imageinfo', iiprop: 'url|extmetadata|size', format: 'json', origin: '*' });
  const json = await fetch(api, { headers: { 'User-Agent': 'JawaBaliTrip/1.0 (iatechdigital069@gmail.com)' } }).then((response) => response.json());
  const page = Object.values(json.query.pages)[0];
  const info = page.imageinfo[0];
  const meta = info.extmetadata || {};
  const image = Buffer.from(await fetch(info.url, { headers: { 'User-Agent': 'JawaBaliTrip/1.0 (iatechdigital069@gmail.com)' } }).then((response) => response.arrayBuffer()));
  const group = item.group || 'golden';
  const localPath = `/images/destinations/${group}/${item.slug}.webp`;
  await sharp(image).resize(1600, 900, { fit: 'cover', position: 'attention' }).webp({ quality: 84 }).toFile(path.join(repo, 'client/public', localPath));
  attributions.push({ slug: item.slug, commonsTitle: page.title, sourcePage: `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replaceAll(' ', '_'))}`, sourceImage: info.url, artist: stripHtml(meta.Artist?.value) || 'Wikimedia Commons contributor', credit: stripHtml(meta.Credit?.value), license: meta.LicenseShortName?.value || meta.UsageTerms?.value || 'See source page', licenseUrl: meta.LicenseUrl?.value || '', originalWidth: info.width, originalHeight: info.height, localPath, changes: 'Cropped to 16:9, resized to 1600×900, and converted to WebP.' });
  console.log(`Downloaded ${item.slug}: ${page.title}`);
}

const enhancements = JSON.parse(await fs.readFile(path.join(repo, 'client/content/destination-enhancements.json'), 'utf8'));
for (const [id, slug] of [[134, 'uluwatu-temple'], [135, 'tanah-lot']]) {
  const existing = enhancements.find((item) => item.id === id)?.image_attribution;
  if (existing && !attributions.some((entry) => entry.slug === slug)) attributions.push({ ...existing, slug });
}
attributions.sort((a, b) => a.slug.localeCompare(b.slug));
await fs.writeFile(attributionFile, `${JSON.stringify(attributions, null, 2)}\n`);
