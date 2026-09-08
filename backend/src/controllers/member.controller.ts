import { Request, Response, NextFunction } from 'express';
import { memberService } from '../services/member.service';
import { ApiResponse } from '@codexclub/shared';

export class MemberController {
  async list(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const { page, limit, search, squadId, isActive, sortBy, sortOrder } = req.query;
      const result = await memberService.listMembers({
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
        search: search as string,
        squadId: squadId as string,
        isActive: isActive !== undefined ? isActive === 'true' : undefined,
        sortBy: sortBy as string,
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.json({
        success: true,
        data: result.members,
        meta: result.meta,
      });
    } catch (err) {
      next(err);
    }
  }

  async getById(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const member = await memberService.getMemberById(req.params.id);
      res.json({
        success: true,
        data: member,
      });
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const member = await memberService.getMemberByAuthUserId(req.user!.userId);
      res.json({
        success: true,
        data: member,
      });
    } catch (err) {
      next(err);
    }
  }

  async updateMe(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const updated = await memberService.updateMemberProfile(req.user!.userId, req.body);
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
      const updated = await memberService.adminUpdateMember(
        req.params.id,
        req.body,
        { id: req.user!.userId, role: req.user!.role, username: req.user!.username }
      );
      res.json({
        success: true,
        message: 'Member updated successfully',
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  }

  async delete(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await memberService.deleteMember(req.params.id, {
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

  async getPerformance(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      let memberId = req.params.id;
      if (!memberId) {
        const member = await memberService.getMemberByAuthUserId(req.user!.userId);
        memberId = member._id.toString();
      }

      const performance = await memberService.getMemberPerformance(memberId);
      res.json({
        success: true,
        data: performance,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const memberController = new MemberController();

