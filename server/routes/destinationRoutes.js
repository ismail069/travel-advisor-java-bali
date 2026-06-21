import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import { index, show } from '../controllers/destinationController.js';

const router = Router();
router.get('/', asyncHandler(index));
router.get('/:id', asyncHandler(show));
export default router;
