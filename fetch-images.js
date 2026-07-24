import fs from 'fs';
import path from 'path';

const destinations = [
  { slug: 'tegenungan-waterfall', search: 'Tegenungan Waterfall' },
  { slug: 'bali-zoo', search: 'Bali Zoo' },
  { slug: 'sukawati-art-market', search: 'Sukawati Market' },
  { slug: 'celuk-village', search: 'Celuk silver' },
  { slug: 'mas-village', search: 'Mas wood carving Bali' },
  { slug: 'kemenuh-butterfly-park', search: 'Bali butterfly' },
  { slug: 'kanto-lampo-waterfall', search: 'Kanto Lampo' },
  { slug: 'bali-reptile-park', search: 'Komodo dragon Bali' },
  { slug: 'bali-bird-park', search: 'Bali Bird Park' },
  { slug: 'penglipuran-village', search: 'Penglipuran' },
  { slug: 'kehen-temple', search: 'Pura Kehen' },
  { slug: 'besakih-temple', search: 'Pura Besakih' },
  { slug: 'tirta-gangga', search: 'Tirta Gangga' },
  { slug: 'virgin-beach', search: 'Virgin Beach Bali' },
  { slug: 'lempuyang-temple', search: 'Pura Lempuyang' },
  { slug: 'taman-ujung', search: 'Taman Ujung' },
  { slug: 'amed', search: 'Amed Bali' },
  { slug: 'candidasa', search: 'Candidasa' },
  { slug: 'mount-agung', search: 'Mount Agung' },
  { slug: 'tulamben', search: 'Tulamben shipwreck' },
  { slug: 'sidemen', search: 'Sidemen Bali' },
  { slug: 'kusamba-beach', search: 'Kusamba salt' },
  { slug: 'goa-lawah-temple', search: 'Goa Lawah' },
  { slug: 'puputan-klungkung-monument', search: 'Puputan Klungkung' },
  { slug: 'kerta-gosa', search: 'Kerta Gosa' },
  { slug: 'blue-lagoon-beach', search: 'Blue Lagoon Bali' },
  { slug: 'padangbai', search: 'Padangbai' }
];

async function fetchWikiImage(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(query)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TravelGuideApp/1.0' } });
    const parsed = await res.json();
    const pages = parsed.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      const info = pages[pageId].imageinfo?.[0];
      if (info && info.thumburl) {
        return {
          url: info.thumburl,
          title: pages[pageId].title
        };
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

async function downloadImage(url, destPath) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'TravelGuideApp/1.0' } });
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    fs.writeFileSync(destPath, Buffer.from(arrayBuffer));
    return true;
  } catch (e) {
    return false;
  }
}

async function run() {
  const dir = path.join(process.cwd(), 'client', 'public', 'images', 'destinations', 'phase-4');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  
  const results = [];
  
  for (const dest of destinations) {
    console.log(`Searching image for ${dest.search}...`);
    const imgInfo = await fetchWikiImage(dest.search);
    if (imgInfo) {
      console.log(`Found: ${imgInfo.url}`);
      let ext = imgInfo.url.split('.').pop().split('?')[0].toLowerCase() || 'jpg';
      if (ext === 'jpeg') ext = 'jpg';
      // If extension is completely wrong, fallback to jpg
      if (!['jpg', 'png', 'webp', 'gif'].includes(ext)) ext = 'jpg';
      
      const destFile = path.join(dir, `${dest.slug}.${ext}`);
      const success = await downloadImage(imgInfo.url, destFile);
      if (success) {
        results.push({ 
          slug: dest.slug, 
          url: `/images/destinations/phase-4/${dest.slug}.${ext}`,
          attribution: `Wikimedia Commons (${imgInfo.title})`
        });
      } else {
        console.log(`Failed to download ${imgInfo.url}`);
      }
    } else {
      console.log(`No image found for ${dest.search}`);
    }
    await new Promise(r => setTimeout(r, 1000)); // Sleep 1s to respect API rate limits
  }
  
  fs.writeFileSync('wiki-images.json', JSON.stringify(results, null, 2));
  console.log(`Done. Saved ${results.length} images.`);
}

run();
