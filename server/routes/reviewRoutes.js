import { Router } from 'express';
import { create, index } from '../controllers/reviewController.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireReview } from '../middleware/validateRequest.js';

const router = Router({ mergeParams: true });
router.get('/:id/reviews', asyncHandler(index));
router.post('/:id/reviews', requireReview, asyncHandler(create));
export default router;
