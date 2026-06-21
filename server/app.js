import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import { initDatabase } from './db/db.js';
import destinationRoutes from './routes/destinationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import healthRoutes from './routes/healthRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config();

const app = express();
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'https://client-travel-advisor-java-bali.vercel.app'
].filter(Boolean);

let databaseReady;
function ensureDatabase() {
  if (!databaseReady) databaseReady = initDatabase();
  return databaseReady;
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.use(async (_req, _res, next) => {
  try {
    await ensureDatabase();
    next();
  } catch (error) {
    next(error);
  }
});

app.use('/api/health', healthRoutes);
app.use('/api/destinations', destinationRoutes);
app.use('/api/destinations', reviewRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/chat', chatRoutes);
app.use(errorHandler);

export { ensureDatabase };
export default app;
