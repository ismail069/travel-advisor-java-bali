const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4');
const files = fs.readdirSync(dir);

for (const file of files) {
  const filePath = path.join(dir, file);
  if (fs.statSync(filePath).isDirectory()) continue;
  
  const buffer = Buffer.alloc(12);
  const fd = fs.openSync(filePath, 'r');
  fs.readSync(fd, buffer, 0, 12, 0);
  fs.closeSync(fd);
  
  let ext = '';
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) ext = '.jpg';
  else if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) ext = '.png';
  else if (buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) ext = '.webp';
  else {
    console.log(`Unknown magic bytes for ${file}:`, buffer.toString('hex'));
    continue;
  }
  
  const currentExt = path.extname(file).toLowerCase();
  if (currentExt !== ext) {
    const base = path.basename(file, currentExt);
    const newPath = path.join(dir, `${base}${ext}`);
    fs.renameSync(filePath, newPath);
    console.log(`Renamed ${file} -> ${base}${ext}`);
  }
}
