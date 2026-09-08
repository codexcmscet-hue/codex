import { MemberModel } from '../models/member.model';
import { CreditScoreHistoryModel } from '../models/creditScore.model';
import { ActivityModel } from '../models/activity.model';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import { AuditAction, Role } from '@codexclub/shared';

export class CreditService {
  async updateCreditScore(params: {
    memberId: string;
    newScore: number;
    reason: string;
    modifiedBy: string; // authUserId
    modifiedByRole: string;
    modifiedByName?: string;
  }) {
    if (params.newScore < 0 || params.newScore > 10 || !Number.isInteger(params.newScore)) {
      throw new AppError('Credit score must be an integer between 0 and 10', 400);
    }

    const member = await MemberModel.findById(params.memberId);
    if (!member) {
      throw new AppError('Member not found', 404);
    }

    const previousScore = member.creditScore;
    member.creditScore = params.newScore;
    await member.save();

    // Create history entry
    const history = await CreditScoreHistoryModel.create({
      memberId: member._id,
      previousScore,
      newScore: params.newScore,
      modifiedBy: params.modifiedBy,
      modifiedByRole: params.modifiedByRole,
      modifiedByName: params.modifiedByName || '',
      reason: params.reason,
    });

    // Create activity record
    await ActivityModel.create({
      memberId: member._id,
      type: 'CREDIT_SCORE_CHANGE',
      description: `Credit score updated from ${previousScore} to ${params.newScore}: ${params.reason}`,
      points: (params.newScore - previousScore) * 10,
      metadata: { previousScore, newScore: params.newScore, historyId: history._id },
    });

    // Audit log
    await auditService.log({
      actorId: params.modifiedBy,
      actorRole: params.modifiedByRole,
      actorName: params.modifiedByName,
      action: AuditAction.CREDIT_SCORE_CHANGE,
      resourceType: 'credit_score',
      resourceId: member._id.toString(),
      details: { previousScore, newScore: params.newScore, reason: params.reason },
    });

    return {
      memberId: member._id.toString(),
      previousScore,
      newScore: params.newScore,
      history,
    };
  }

  async getCreditScoreHistory(memberId: string) {
    const history = await CreditScoreHistoryModel.find({ memberId }).sort({ createdAt: -1 }).lean();
    return history;
  }
}

export const creditService = new CreditService();

