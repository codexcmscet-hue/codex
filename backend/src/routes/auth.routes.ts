import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { loginLimiter, passwordResetLimiter } from '../middleware/rateLimiter';
import {
  LoginSchema,
  AdminLoginSchema,
  RegisterMemberSchema,
  ForgotPasswordSchema,
  ResetPasswordSchema,
  VerifyEmailSchema,
} from '@codexclub/shared';

const router = Router();

router.post('/register', validate(RegisterMemberSchema), (req, res, next) => authController.register(req, res, next));
router.post('/login', loginLimiter, validate(LoginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/admin/login', loginLimiter, validate(AdminLoginSchema), (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refreshToken(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/forgot-password', passwordResetLimiter, validate(ForgotPasswordSchema), (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', validate(ResetPasswordSchema), (req, res, next) => authController.resetPassword(req, res, next));
router.post('/verify-email', validate(VerifyEmailSchema), (req, res, next) => authController.verifyEmail(req, res, next));
router.get('/me', requireAuth, (req, res, next) => authController.getMe(req, res, next));

export default router;

