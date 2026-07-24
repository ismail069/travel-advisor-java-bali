const fs = require('fs');
const path = require('path');

const src = 'C:\\Users\\iarif\\.gemini\\antigravity-ide\\brain\\a67ddfe0-47a0-4d34-af6c-db0f971223ad\\mas_village_carving_1784861329615.png';
const dest = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4', 'mas-village.png');
const oldJpg = path.join(__dirname, 'client', 'public', 'images', 'destinations', 'phase-4', 'mas-village.jpg');

try { fs.unlinkSync(oldJpg); } catch(e) {}
fs.copyFileSync(src, dest);
console.log('Copied successfully!');
