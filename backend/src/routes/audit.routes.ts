import { Router } from 'express';
import { auditController } from '../controllers/audit.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { Role } from '@codexclub/shared';

const router = Router();

router.get('/', requireAuth, requireRole(Role.ADMIN), (req, res, next) =>
  auditController.list(req, res, next)
);

export default router;

