import { Router } from 'express';
import { eventController } from '../controllers/event.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { Role, CreateEventSchema, UpdateEventSchema } from '@codexclub/shared';

const router = Router();

// Public / Member list and get
router.get('/', (req, res, next) => eventController.list(req, res, next));
router.get('/:id', (req, res, next) => eventController.getById(req, res, next));

// Member registration for event
router.post('/:id/register', requireAuth, (req, res, next) => eventController.register(req, res, next));

// Admin & Volunteer event management
router.post(
  '/',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(CreateEventSchema),
  (req, res, next) => eventController.create(req, res, next)
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(UpdateEventSchema),
  (req, res, next) => eventController.update(req, res, next)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  (req, res, next) => eventController.delete(req, res, next)
);

// Event photo gallery management
router.post(
  '/:id/images',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  (req, res, next) => eventController.addImage(req, res, next)
);

router.delete(
  '/:id/images/:imageKey',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  (req, res, next) => eventController.removeImage(req, res, next)
);

export default router;

