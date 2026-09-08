import { Router } from 'express';
import { analyticsController } from '../controllers/analytics.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@codexclub/shared';

const router = Router();

router.get('/admin', requireAuth, requireRole(Role.ADMIN), (req, res, next) => analyticsController.getAdminStats(req, res, next));
router.get('/volunteer', requireAuth, requireRole(Role.VOLUNTEER), (req, res, next) => analyticsController.getVolunteerStats(req, res, next));
router.get('/member', requireAuth, (req, res, next) => analyticsController.getMemberStats(req, res, next));

export default router;

