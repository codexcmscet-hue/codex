import { Request, Response, NextFunction } from 'express';
import { creditService } from '../services/credit.service';
import { ApiResponse } from '@codexclub/shared';

export class CreditController {
  async update(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const result = await creditService.updateCreditScore({
        memberId: req.params.memberId,
        newScore: req.body.score,
        reason: req.body.reason,
        modifiedBy: req.user!.userId,
        modifiedByRole: req.user!.role,
        modifiedByName: req.user!.username,
      });

      res.json({
        success: true,
        message: 'Credit score updated successfully',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  }

  async getHistory(req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> {
    try {
      const history = await creditService.getCreditScoreHistory(req.params.memberId);
      res.json({
        success: true,
        data: history,
      });
    } catch (err) {
      next(err);
    }
  }
}

export const creditController = new CreditController();

