import { Router } from 'express';
import { asyncHandler as h } from '../middleware/errorHandler.js';
import { requireAdmin } from '../middleware/auth.js';
import { validateEnquiryUpdate, validateService, validatePackage } from '../middleware/validate.js';
import { uploadImage } from '../middleware/upload.js';
import * as enquiries from '../controllers/enquiryController.js';
import * as services from '../controllers/serviceController.js';
import * as packages from '../controllers/packageController.js';
import * as gallery from '../controllers/galleryController.js';

const router = Router();

// Every admin route requires a valid JWT – customer data is never public.
router.use(requireAdmin);

router.param('id', (req, res, next, id) => {
  if (!/^\d+$/.test(id)) return res.status(400).json({ message: 'Invalid id.' });
  next();
});

router.get('/stats', h(enquiries.stats));

router.get('/enquiries', h(enquiries.listEnquiries));
router.get('/enquiries/:id', h(enquiries.getEnquiry));
router.patch('/enquiries/:id', validateEnquiryUpdate, h(enquiries.updateEnquiry));
router.delete('/enquiries/:id', h(enquiries.deleteEnquiry));

router.get('/services', h(services.listAll));
router.post('/services', validateService, h(services.create));
router.put('/services/:id', validateService, h(services.update));
router.delete('/services/:id', h(services.remove));

router.get('/packages', h(packages.listAll));
router.post('/packages', validatePackage, h(packages.create));
router.put('/packages/:id', validatePackage, h(packages.update));
router.delete('/packages/:id', h(packages.remove));

router.get('/gallery', h(gallery.listAll));
router.post('/gallery', uploadImage, h(gallery.upload));
router.patch('/gallery/:id', h(gallery.update));
router.delete('/gallery/:id', h(gallery.remove));

export default router;
