import { Request, Response, NextFunction } from 'express';
import { volunteerService } from '../services/volunteer.service';
import { ApiResponse } from '@codexclub/shared';

export class VolunteerController {
  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, isActive } = req.query;
      const result = await volunteerService.listVolunteers({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
      });

      res.json({
        success: true,
        data: result.volunteers,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const volunteer = await volunteerService.getVolunteerById(req.params.id);
      res.json({
        success: true,
        data: volunteer,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const volunteer = await volunteerService.getVolunteerByAuthUserId(req.user!.userId);
      res.json({
        success: true,
        data: volunteer,
      });
    } catch (err) {
      next(err);
    }
  }

  async create(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const created = await volunteerService.createVolunteer(req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.status(201).json({
        success: true,
        message: 'Volunteer created successfully',
        data: created,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await volunteerService.updateVolunteerProfile(req.user!.userId, req.body);
      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async adminUpdate(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await volunteerService.adminUpdateVolunteer(req.params.id, req.body, {
        id: req.user!.userId,
        role: req.user!.role,
        username: req.user!.username,
      });
      res.json({
        success: true,
        message: 'Volunteer updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await volunteerService.deleteVolunteer(req.params.id, {
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
}

export const volunteerController = new VolunteerController();

