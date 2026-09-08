import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { config } from '../config';
import { ApiResponse, AuthResponse } from '@codexclub/shared';

export class AuthController {
  async register(req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction): Promise<void> {
    try {
      const clientInfo = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      };
      const result = await authService.registerMember(req.body, clientInfo);
      res.status(201).json({
        success: true,
        message: result.message,
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
            emailVerified: result.user.emailVerified,
          },
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response<ApiResponse<AuthResponse>>, next: NextFunction): Promise<void> {
    try {
      const clientInfo = {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
      };
      const result = await authService.login(req.body, clientInfo);

      // Set cookies
      res.cookie('access_token', result.tokens.accessToken, {
        ...config.cookieSettings,
        maxAge: 15 * 60 * 1000, // 15 mins
      });

      res.cookie('refresh_token', result.tokens.refreshToken, {
        ...config.cookieSettings,
        maxAge: (req.body.rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: result.user.id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
            emailVerified: result.user.emailVerified,
          },
          tokens: result.tokens,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refresh_token || req.body?.refreshToken;
      if (!refreshToken) {
        res.status(401).json({ success: false, message: 'Refresh token missing' });
        return;
      }

      const clientInfo = { ip: req.ip, userAgent: req.headers['user-agent'] };
      const tokens = await authService.refreshToken(refreshToken, clientInfo);

      res.cookie('access_token', tokens.accessToken, {
        ...config.cookieSettings,
        maxAge: 15 * 60 * 1000,
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        ...config.cookieSettings,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({
        success: true,
        data: tokens,
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refresh_token;
      await authService.logout(refreshToken);

      res.clearCookie('access_token', config.cookieSettings);
      res.clearCookie('refresh_token', config.cookieSettings);

      res.json({ success: true, message: 'Logged out successfully' });
    } catch (err) {
      next(err);
    }
  }

  async forgotPassword(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      await authService.forgotPassword(req.body.email);
      // Always return 200 to prevent user enumeration
      res.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      });
    } catch (err) {
      next(err);
    }
  }

  async resetPassword(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      await authService.resetPassword(req.body.token, req.body.password);
      res.json({
        success: true,
        message: 'Password reset successful! You can now log in with your new password.',
      });
    } catch (err) {
      next(err);
    }
  }

  async verifyEmail(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      await authService.verifyEmail(req.body.token);
      res.json({
        success: true,
        message: 'Email verified successfully!',
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      res.json({
        success: true,
        data: {
          user: req.user,
        },
      });
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
