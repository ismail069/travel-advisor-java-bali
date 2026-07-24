const fs = require('fs');
const path = require('path');

const srcDir = 'C:\\Users\\iarif\\.gemini\\antigravity-ide\\brain\\a67ddfe0-47a0-4d34-af6c-db0f971223ad';
const destDir = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4');

const generatedFiles = [
  { slug: 'tegenungan-waterfall', prefix: 'tegenungan_waterfall_' },
  { slug: 'bali-zoo', prefix: 'bali_zoo_' },
  { slug: 'sukawati-art-market', prefix: 'sukawati_art_market_' },
  { slug: 'celuk-village', prefix: 'celuk_village_' },
  { slug: 'mas-village', prefix: 'mas_village_' },
  { slug: 'kemenuh-butterfly-park', prefix: 'kemenuh_butterfly_park_' },
  { slug: 'kanto-lampo-waterfall', prefix: 'kanto_lampo_waterfall_' },
  { slug: 'bali-reptile-park', prefix: 'bali_reptile_park_' },
  { slug: 'bali-bird-park', prefix: 'bali_bird_park_' },
  { slug: 'penglipuran-village', prefix: 'penglipuran_village_' },
  { slug: 'kehen-temple', prefix: 'kehen_temple_' },
  { slug: 'besakih-temple', prefix: 'besakih_temple_' },
  { slug: 'tirta-gangga', prefix: 'tirta_gangga_' }
];

const fallbacks = [
  { slug: 'virgin-beach', fallback: 'angels-billabong.webp' },
  { slug: 'lempuyang-temple', fallback: 'batuan-temple.webp' },
  { slug: 'taman-ujung', fallback: 'ubud-palace.webp' },
  { slug: 'amed', fallback: 'angels-billabong.webp' },
  { slug: 'candidasa', fallback: 'angels-billabong.webp' },
  { slug: 'mount-agung', fallback: 'jatiluwih-rice-terraces.webp' },
  { slug: 'tulamben', fallback: 'angels-billabong.webp' },
  { slug: 'sidemen', fallback: 'jatiluwih-rice-terraces.webp' },
  { slug: 'kusamba-beach', fallback: 'angels-billabong.webp' },
  { slug: 'goa-lawah-temple', fallback: 'batuan-temple.webp' },
  { slug: 'puputan-klungkung-monument', fallback: 'ubud-palace.webp' },
  { slug: 'kerta-gosa', fallback: 'ubud-palace.webp' },
  { slug: 'blue-lagoon-beach', fallback: 'angels-billabong.webp' },
  { slug: 'padangbai', fallback: 'angels-billabong.webp' }
];

// Copy generated files
if (fs.existsSync(srcDir)) {
  const allFiles = fs.readdirSync(srcDir);
  for (const item of generatedFiles) {
    const file = allFiles.find(f => f.startsWith(item.prefix) && f.endsWith('.png'));
    if (file) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, `${item.slug}.webp`); // saving as .webp to match references
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to ${item.slug}.webp`);
    } else {
      console.log(`Generated file for ${item.slug} not found.`);
    }
  }
}

// Copy fallback files
for (const item of fallbacks) {
  const srcPath = path.join(destDir, item.fallback);
  const destPath = path.join(destDir, `${item.slug}.webp`);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
    console.log(`Copied fallback ${item.fallback} to ${item.slug}.webp`);
  } else {
    console.log(`Fallback file ${item.fallback} not found for ${item.slug}.`);
  }
}

console.log('Done.');
