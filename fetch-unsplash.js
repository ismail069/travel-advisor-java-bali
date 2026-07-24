const https = require('https');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4');

const downloads = [
  { slug: 'candidasa', url: 'https://images.unsplash.com/photo-1544256673-9836340bd496?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { slug: 'padangbai', url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { slug: 'tulamben', url: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' }
];

for (const dl of downloads) {
  // Remove the old invalid webp files
  try { fs.unlinkSync(path.join(dir, `${dl.slug}.webp`)); } catch (e) {}
  
  const destPath = path.join(dir, `${dl.slug}.jpg`);
  const file = fs.createWriteStream(destPath);
  https.get(dl.url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();  
      console.log(`${dl.slug} downloaded.`);
    });
  }).on('error', function(err) {
    fs.unlink(destPath);
    console.error(`Error downloading ${dl.slug}`, err.message);
  });
}
