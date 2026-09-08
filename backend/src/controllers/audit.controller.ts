import { Request, Response, NextFunction } from 'express';
import { auditService } from '../services/audit.service';
import { ApiResponse } from '@codexclub/shared';

export class AuditController {
  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { page, limit, action, actorRole, resourceType, startDate, endDate } = req.query;
      const result = await auditService.getLogs({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        action: action as string,
        actorRole: actorRole as string,
        resourceType: resourceType as string,
        startDate: startDate as string,
        endDate: endDate as string,
      });

      res.json({
        success: true,
        data: result.logs,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const auditController = new AuditController();

