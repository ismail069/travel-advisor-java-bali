import fs from 'fs';
import { seedDestinations } from './server/db/seed.js';

fs.writeFileSync('client/lib/fallback-destinations.json', JSON.stringify(seedDestinations, null, 2));
console.log('Fallback destinations created.');
