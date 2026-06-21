import { Router } from 'express';
import { create, destroy, index } from '../controllers/savedController.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireSaved } from '../middleware/validateRequest.js';

const router = Router();
router.get('/', asyncHandler(index));
router.post('/', requireSaved, asyncHandler(create));
router.delete('/:destinationId', asyncHandler(destroy));
export default router;
