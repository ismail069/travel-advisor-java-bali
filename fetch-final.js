const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4');

const downloads = [
  { slug: 'candidasa', url: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80' },
  { slug: 'padangbai', url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800&q=80' },
  { slug: 'mas-village', url: 'https://images.unsplash.com/photo-1604928141064-207cea6f571f?w=800&q=80' },
  { slug: 'tulamben', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80' }
];

for (const dl of downloads) {
  const destPath = path.join(dir, `${dl.slug}.jpg`);
  
  // Clean up existing files that might conflict
  try { fs.unlinkSync(path.join(dir, `${dl.slug}.webp`)); } catch(e) {}
  try { fs.unlinkSync(path.join(dir, `${dl.slug}.png`)); } catch(e) {}
  try { fs.unlinkSync(destPath); } catch(e) {}

  console.log(`Downloading ${dl.slug}...`);
  try {
    execSync(`curl -sL "${dl.url}" -o "${destPath}"`, { stdio: 'inherit' });
    console.log(`Successfully downloaded ${dl.slug}.jpg`);
  } catch (err) {
    console.error(`Failed to download ${dl.slug}`);
  }
}
