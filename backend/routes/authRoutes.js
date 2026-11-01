import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler as h } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { login, me } from '../controllers/authController.js';

const router = Router();
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many login attempts. Please wait 15 minutes and try again.' },
});

router.post('/login', loginLimiter, h(login));
router.get('/me', requireAdmin, h(me));

export default router;
