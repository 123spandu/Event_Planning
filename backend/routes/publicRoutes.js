import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { asyncHandler as h } from '../middleware/errorHandler.js';
import { validateEnquiry } from '../middleware/validate.js';
import { createEnquiry } from '../controllers/enquiryController.js';
import * as services from '../controllers/serviceController.js';
import * as packages from '../controllers/packageController.js';
import * as gallery from '../controllers/galleryController.js';

const router = Router();

const enquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Too many enquiries from this device. Please try again later or contact us on WhatsApp.' },
});

router.get('/services', h(services.listPublic));
router.get('/packages', h(packages.listPublic));
router.get('/gallery', h(gallery.listPublic));
router.post('/enquiries', enquiryLimiter, validateEnquiry, h(createEnquiry));

export default router;
