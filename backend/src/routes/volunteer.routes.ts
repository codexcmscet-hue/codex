import { Router } from 'express';
import { volunteerController } from '../controllers/volunteer.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  Role,
  AdminCreateVolunteerSchema,
  AdminUpdateVolunteerSchema,
  UpdateVolunteerProfileSchema,
} from '@codexclub/shared';

const router = Router();

// Volunteer self operations
router.get('/me', requireAuth, requireRole(Role.VOLUNTEER), (req, res, next) => volunteerController.getMe(req, res, next));
router.patch('/me', requireAuth, requireRole(Role.VOLUNTEER), validate(UpdateVolunteerProfileSchema), (req, res, next) => volunteerController.updateMe(req, res, next));

// Admin only list, get, create, edit, delete
router.get('/', requireAuth, requireRole(Role.ADMIN), (req, res, next) => volunteerController.list(req, res, next));
router.get('/:id', requireAuth, requireRole(Role.ADMIN), (req, res, next) => volunteerController.getById(req, res, next));
router.post('/', requireAuth, requireRole(Role.ADMIN), validate(AdminCreateVolunteerSchema), (req, res, next) => volunteerController.create(req, res, next));
router.patch('/:id', requireAuth, requireRole(Role.ADMIN), validate(AdminUpdateVolunteerSchema), (req, res, next) => volunteerController.adminUpdate(req, res, next));
router.delete('/:id', requireAuth, requireRole(Role.ADMIN), (req, res, next) => volunteerController.delete(req, res, next));

export default router;

