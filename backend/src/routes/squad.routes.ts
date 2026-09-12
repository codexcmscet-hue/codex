import { Router } from 'express';
import { squadController } from '../controllers/squad.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  CreateTeamSchema,
  UpdateSquadSchema,
  UpdateTeamScoreSchema,
  AddTeamMemberSchema,
  ChangeTeamLeaderSchema,
  Role,
} from '@codexclub/shared';

const router = Router();

// Leaderboard & lookup (Visible to ADMIN, VOLUNTEER, MEMBER)
router.get('/leaderboard', requireAuth, (req, res, next) => squadController.getLeaderboard(req, res, next));
router.get('/my-team', requireAuth, (req, res, next) => squadController.getMyTeam(req, res, next));
router.get('/:id/history', requireAuth, (req, res, next) => squadController.getHistory(req, res, next));
router.get('/', requireAuth, (req, res, next) => squadController.list(req, res, next));
router.get('/:id', requireAuth, (req, res, next) => squadController.getById(req, res, next));

// Team management (ADMIN and VOLUNTEER)
router.post(
  '/',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(CreateTeamSchema),
  (req, res, next) => squadController.create(req, res, next)
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(UpdateSquadSchema),
  (req, res, next) => squadController.update(req, res, next)
);

router.post(
  '/:id/members',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(AddTeamMemberSchema),
  (req, res, next) => squadController.addMember(req, res, next)
);

router.delete(
  '/:id/members/:memberId',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  (req, res, next) => squadController.removeMember(req, res, next)
);

router.patch(
  '/:id/leader',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(ChangeTeamLeaderSchema),
  (req, res, next) => squadController.changeLeader(req, res, next)
);

router.patch(
  '/:id/score',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(UpdateTeamScoreSchema),
  (req, res, next) => squadController.updateScore(req, res, next)
);

// Admin-only actions (Archive & Delete)
router.patch(
  '/:id/archive',
  requireAuth,
  requireRole(Role.ADMIN),
  (req, res, next) => squadController.archive(req, res, next)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN),
  (req, res, next) => squadController.delete(req, res, next)
);

export default router;


