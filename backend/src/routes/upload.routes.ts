import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();

router.post('/presign', requireAuth, (req, res, next) => uploadController.getPresignedUrl(req, res, next));
router.post('/delete', requireAuth, (req, res, next) => uploadController.deleteFile(req, res, next));

export default router;

