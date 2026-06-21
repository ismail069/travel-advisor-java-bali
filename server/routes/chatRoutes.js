import { Router } from 'express';
import { create } from '../controllers/chatController.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { requireChat } from '../middleware/validateRequest.js';

const router = Router();
router.post('/', requireChat, asyncHandler(create));
export default router;
