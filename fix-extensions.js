const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4');
const files = fs.readdirSync(dir);

for (const file of files) {
  if (file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')) {
    const base = path.parse(file).name;
    const dest = path.join(dir, `${base}.webp`);
    fs.renameSync(path.join(dir, file), dest);
    console.log(`Renamed ${file} to ${base}.webp`);
  }
}

// Redownload blue-lagoon-beach from Unsplash
try {
  const url = "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
  const destPath = path.join(dir, 'blue-lagoon-beach.webp');
  // Use node's https to avoid curl escaping issues on windows
  const https = require('https');
  const file = fs.createWriteStream(destPath);
  https.get(url, function(response) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();  
      console.log('Blue lagoon downloaded.');
    });
  }).on('error', function(err) {
    fs.unlink(destPath);
    console.error('Error downloading blue lagoon', err.message);
  });
} catch (e) {
  console.log(e);
}
