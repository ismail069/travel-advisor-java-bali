const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.next') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      const ext = path.extname(file);
      if (['.js', '.jsx', '.ts', '.tsx', '.json', '.mdx', '.mjs', '.md'].includes(ext)) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'client')).concat(walk(path.join(__dirname, 'scripts')));
files.push(path.join(__dirname, 'migrate_static.js'));

let count = 0;
files.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('Ismail')) {
      const newContent = content.replace(/\bIsmail\b/g, 'JawaBali Trip Team');
      fs.writeFileSync(file, newContent, 'utf8');
      count++;
      console.log(`Updated: ${file}`);
    }
  }
});

console.log(`Replaced "Ismail" in ${count} files.`);
