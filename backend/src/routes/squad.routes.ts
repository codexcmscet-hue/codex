import { Router } from 'express';
import { squadController } from '../controllers/squad.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import { RegisterSquadSchema, UpdateSquadSchema } from '@codexclub/shared';

const router = Router();

router.get('/', requireAuth, (req, res, next) => squadController.list(req, res, next));
router.get('/:id', requireAuth, (req, res, next) => squadController.getById(req, res, next));
router.post('/', requireAuth, validate(RegisterSquadSchema), (req, res, next) => squadController.register(req, res, next));
router.patch('/:id', requireAuth, validate(UpdateSquadSchema), (req, res, next) => squadController.update(req, res, next));

export default router;

