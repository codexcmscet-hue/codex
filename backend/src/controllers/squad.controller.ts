import { Request, Response, NextFunction } from 'express';
import { squadService } from '../services/squad.service';
import { ApiResponse } from '@codexclub/shared';

export class SquadController {
  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { search, page, limit } = req.query;
      const result = await squadService.listSquads({
        search: search as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({
        success: true,
        data: result.squads,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const squad = await squadService.getSquadById(req.params.id);
      res.json({
        success: true,
        data: squad,
      });
    } catch (err) {
      next(err);
    }
  }

  async register(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const squad = await squadService.registerSquad(req.body, req.user!.userId);
      res.status(201).json({
        success: true,
        message: 'Squad registered successfully!',
        data: squad,
      });
    } catch (err) {
      next(err);
    }
  }

  async update(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await squadService.updateSquad(req.params.id, req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Squad updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const squadController = new SquadController();

