import { Router } from 'express';
import { memberController } from '../controllers/member.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { Role, UpdateMemberProfileSchema, AdminUpdateMemberSchema } from '@codexclub/shared';

const router = Router();

// Member self operations
router.get('/me', requireAuth, (req, res, next) => memberController.getMe(req, res, next));
router.patch('/me', requireAuth, validate(UpdateMemberProfileSchema), (req, res, next) => memberController.updateMe(req, res, next));
router.get('/me/performance', requireAuth, (req, res, next) => memberController.getPerformance(req, res, next));

// List and search (Admin & Volunteers)
router.get('/', requireAuth, requireRole(Role.ADMIN, Role.VOLUNTEER), (req, res, next) => memberController.list(req, res, next));
router.get('/:id', requireAuth, requireRole(Role.ADMIN, Role.VOLUNTEER), (req, res, next) => memberController.getById(req, res, next));
router.get('/:id/performance', requireAuth, requireRole(Role.ADMIN, Role.VOLUNTEER), (req, res, next) => memberController.getPerformance(req, res, next));

// Admin management
router.patch('/:id', requireAuth, requireRole(Role.ADMIN), validate(AdminUpdateMemberSchema), (req, res, next) => memberController.adminUpdate(req, res, next));
router.delete('/:id', requireAuth, requireRole(Role.ADMIN), (req, res, next) => memberController.delete(req, res, next));

export default router;

