import { Router } from 'express';
import { blogController } from '../controllers/blog.controller';
import { requireAuth, requireRole } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';
import {
  Role,
  CreateBlogSchema,
  UpdateBlogSchema,
  CreateProjectBlogSchema,
} from '@codexclub/shared';

const router = Router();

// Public blogs
router.get('/', (req, res, next) => blogController.list(req, res, next));
router.get('/slug/:slug', (req, res, next) => blogController.getBySlug(req, res, next));

// Project blogs
router.get('/projects', (req, res, next) => blogController.listProjectBlogs(req, res, next));
router.get('/projects/slug/:slug', (req, res, next) => blogController.getProjectBlogBySlug(req, res, next));
router.post(
  '/projects',
  requireAuth,
  validate(CreateProjectBlogSchema),
  (req, res, next) => blogController.createProjectBlog(req, res, next)
);

// Admin & Volunteer blog management
router.post(
  '/',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(CreateBlogSchema),
  (req, res, next) => blogController.create(req, res, next)
);

router.patch(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  validate(UpdateBlogSchema),
  (req, res, next) => blogController.update(req, res, next)
);

router.delete(
  '/:id',
  requireAuth,
  requireRole(Role.ADMIN, Role.VOLUNTEER),
  (req, res, next) => blogController.delete(req, res, next)
);

export default router;

