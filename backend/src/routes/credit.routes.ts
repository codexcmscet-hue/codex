import { Router } from 'express';
import { creditController } from '../controllers/credit.controller';
import { requireAuth, requireRole, requirePermission } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { Role, Permission, UpdateCreditScoreSchema } from '@codexclub/shared';

const router = Router();

router.patch(
  '/:memberId',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(UpdateCreditScoreSchema),
  (req, res, next) => creditController.update(req, res, next)
);

router.get(
  '/:memberId/history',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  (req, res, next) => creditController.getHistory(req, res, next)
);

export default router;

