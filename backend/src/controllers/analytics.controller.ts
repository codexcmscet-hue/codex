import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service';
import { ApiResponse } from '@codexclub/shared';

export class AnalyticsController {
  async getAdminStats(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsService.getAdminStats();
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  async getVolunteerStats(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsService.getVolunteerStats(req.user!.userId);
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMemberStats(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const stats = await analyticsService.getMemberDashboardData(req.user!.userId);
      res.json({
        success: true,
        data: stats,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const analyticsController = new AnalyticsController();

