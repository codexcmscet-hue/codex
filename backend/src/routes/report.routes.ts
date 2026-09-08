import { Router } from 'express';
import { reportController } from '../controllers/report.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@codexclub/shared';

const router = Router();

router.get('/member/:memberId', requireAuth, requireRole(Role.ADMIN, Role.VOLUNTEER), (req, res, next) =>
  reportController.getMemberReport(req, res, next)
);

router.get('/club', requireAuth, requireRole(Role.ADMIN), (req, res, next) =>
  reportController.getClubReport(req, res, next)
);

export default router;

