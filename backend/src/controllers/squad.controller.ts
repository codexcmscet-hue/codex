import { Request, Response, NextFunction } from 'express';
import { squadService } from '../services/squad.service';
import { ApiResponse } from '@codexclub/shared';

export class SquadController {
  async getLeaderboard(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { search, sortBy, sortOrder, status, page, limit } = req.query;
      const result = await squadService.getLeaderboard({
        search: search as string,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
        status: status as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      res.json({
        success: true,
        data: result.leaderboard,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    return this.getLeaderboard(req, res, next);
  }

  async getById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const team = await squadService.getSquadById(req.params.id);
      res.json({
        success: true,
        data: team,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const team = await squadService.createTeam(req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.status(201).json({
        success: true,
        message: 'Team created successfully!',
        data: team,
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
        message: 'Team updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async addMember(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { memberId } = req.body;
      const updated = await squadService.addMember(req.params.id, memberId, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Member added to team successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async removeMember(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await squadService.removeMember(req.params.id, req.params.memberId, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Member removed from team successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async changeLeader(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { leaderId } = req.body;
      const updated = await squadService.changeLeader(req.params.id, leaderId, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Team leader updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateScore(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { score, reason } = req.body;
      const updated = await squadService.updateScore(req.params.id, score, reason, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Team credit score updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const history = await squadService.getTeamHistory(req.params.id);
      res.json({
        success: true,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }

  async archive(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await squadService.archiveTeam(req.params.id, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await squadService.deleteTeam(req.params.id, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: result.message,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMyTeam(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const team = await squadService.getMemberTeam(req.user!.userId);
      res.json({
        success: true,
        data: team,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMemberTeam(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const team = await squadService.getSquadById(req.params.memberId);
      res.json({
        success: true,
        data: team,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const squadController = new SquadController();


