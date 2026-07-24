const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const destinations = [
  { slug: 'batuan-village', search: 'Batuan Temple Bali' },
  { slug: 'virgin-beach', search: 'Virgin Beach Karangasem' },
  { slug: 'amed', search: 'Amed Bali' },
  { slug: 'candidasa', search: 'Candidasa' },
  { slug: 'tulamben', search: 'Tulamben' },
  { slug: 'kusamba-beach', search: 'Kusamba' },
  { slug: 'blue-lagoon-beach', search: 'Blue Lagoon Bali' },
  { slug: 'padangbai', search: 'Padangbai' },
  { slug: 'angels-billabong', search: 'Angel\'s Billabong' }
];

const outDir = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

for (const dest of destinations) {
  console.log(`Searching for ${dest.search}...`);
  try {
    const queryUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(dest.search)}&gsrnamespace=6&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json`;
    const response = execSync(`curl -sL -A "Mozilla/5.0" "${queryUrl}"`, { encoding: 'utf-8' });
    const data = JSON.parse(response);
    const pages = data.query?.pages;
    if (pages) {
      const pageId = Object.keys(pages)[0];
      const info = pages[pageId].imageinfo?.[0];
      if (info && info.thumburl) {
        let imgUrl = info.thumburl;
        console.log(`Found: ${imgUrl}`);
        let ext = imgUrl.split('.').pop().split('?')[0].toLowerCase();
        if (!['jpg', 'jpeg', 'png', 'webp'].includes(ext)) ext = 'jpg';
        if (ext === 'jpeg') ext = 'jpg';
        
        const destFile = path.join(outDir, `${dest.slug}.${ext}`);
        // Download with curl
        execSync(`curl -sL -A "Mozilla/5.0" "${imgUrl}" -o "${destFile}"`);
        
        // Also update golden-image-attributions.json if needed
        console.log(`Downloaded ${dest.slug}`);
      } else {
        console.log(`No image found for ${dest.search}`);
      }
    } else {
      console.log(`No results for ${dest.search}`);
    }
  } catch (e) {
    console.log(`Error processing ${dest.search}: ${e.message}`);
  }
}
