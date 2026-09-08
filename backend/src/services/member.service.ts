import { MemberModel, MemberDocument } from '../models/member.model';
import { SquadModel } from '../models/squad.model';
import { ActivityModel } from '../models/activity.model';
import { CreditScoreHistoryModel } from '../models/creditScore.model';
import { authRepository } from '../repositories/auth.repository';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  UpdateMemberProfileInput,
  AdminUpdateMemberInput,
  AuditAction,
  Role,
} from '@codexclub/shared';

export class MemberService {
  async listMembers(params: {
    page?: number;
    limit?: number;
    search?: string;
    squadId?: string;
    isActive?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};

    if (params.search) {
      const searchRegex = new RegExp(params.search, 'i');
      query.$or = [
        { username: searchRegex },
        { displayName: searchRegex },
        { email: searchRegex },
        { registrationNumber: searchRegex },
        { phone: searchRegex },
      ];
    }

    if (params.squadId) {
      query.squadId = params.squadId;
    }

    if (params.isActive !== undefined) {
      query.isActive = params.isActive;
    }

    const sortField = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

    const [members, total] = await Promise.all([
      MemberModel.find(query)
        .populate('squadId', 'name')
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      MemberModel.countDocuments(query),
    ]);

    return {
      members: members.map((m: any) => ({
        id: m._id.toString(),
        authUserId: m.authUserId,
        username: m.username,
        email: m.email,
        phone: m.phone,
        registrationNumber: m.registrationNumber,
        displayName: m.displayName,
        avatarUrl: m.avatarUrl,
        githubUrl: m.githubUrl,
        bio: m.bio,
        squadId: m.squadId?._id?.toString() || m.squadId?.toString(),
        squadName: m.squadId?.name,
        isActive: m.isActive,
        creditScore: m.creditScore,
        activitiesCompleted: m.activitiesCompleted,
        eventsParticipated: m.eventsParticipated,
        joinedAt: m.joinedAt,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getMemberById(id: string) {
    const member = await MemberModel.findById(id).populate('squadId', 'name description score').lean();
    if (!member) {
      throw new AppError('Member not found', 404);
    }
    return member;
  }

  async getMemberByAuthUserId(authUserId: string) {
    const member = await MemberModel.findOne({ authUserId }).populate('squadId', 'name description score leaderId memberIds').lean();
    if (!member) {
      throw new AppError('Member profile not found', 404);
    }
    return member;
  }

  async updateMemberProfile(authUserId: string, input: UpdateMemberProfileInput) {
    const member = await MemberModel.findOne({ authUserId });
    if (!member) {
      throw new AppError('Member not found', 404);
    }

    if (input.displayName !== undefined) member.displayName = input.displayName;
    if (input.phone !== undefined) member.phone = input.phone;
    if (input.bio !== undefined) member.bio = input.bio;
    if (input.avatarUrl !== undefined) member.avatarUrl = input.avatarUrl;
    if (input.githubUrl !== undefined) member.githubUrl = input.githubUrl;

    await member.save();

    await auditService.log({
      actorId: authUserId,
      actorRole: Role.MEMBER,
      actorName: member.username,
      action: AuditAction.MEMBER_UPDATE,
      resourceType: 'member',
      resourceId: member._id.toString(),
      details: input,
    });

    return member;
  }

  async adminUpdateMember(
    id: string,
    input: AdminUpdateMemberInput,
    adminInfo: { id: string; role: string; username: string }
  ) {
    const member = await MemberModel.findById(id);
    if (!member) {
      throw new AppError('Member not found', 404);
    }

    if (input.displayName !== undefined) member.displayName = input.displayName;
    if (input.phone !== undefined) member.phone = input.phone;
    if (input.bio !== undefined) member.bio = input.bio;
    if (input.avatarUrl !== undefined) member.avatarUrl = input.avatarUrl;
    if (input.githubUrl !== undefined) member.githubUrl = input.githubUrl;
    if (input.isActive !== undefined) member.isActive = input.isActive;
    if (input.squadId !== undefined) {
      member.squadId = (input.squadId ? input.squadId : null) as any;
    }

    await member.save();

    await auditService.log({
      actorId: adminInfo.id,
      actorRole: adminInfo.role,
      actorName: adminInfo.username,
      action: AuditAction.MEMBER_UPDATE,
      resourceType: 'member',
      resourceId: member._id.toString(),
      details: input,
    });

    return member;
  }

  async deleteMember(id: string, adminInfo: { id: string; role: string; username: string }) {
    const member = await MemberModel.findById(id);
    if (!member) {
      throw new AppError('Member not found', 404);
    }

    // Delete auth user credentials and member record
    if (member.authUserId) {
      await authRepository.deleteUserSessions(member.authUserId);
      const { pgPool } = await import('../config/postgres');
      await pgPool.query('DELETE FROM auth.users WHERE id = $1', [member.authUserId]);
    }

    // If member was in a squad, pull from squad
    if (member.squadId) {
      await SquadModel.findByIdAndUpdate(member.squadId, {
        $pull: { memberIds: member._id },
      });
    }

    await MemberModel.findByIdAndDelete(id);

    await auditService.log({
      actorId: adminInfo.id,
      actorRole: adminInfo.role,
      actorName: adminInfo.username,
      action: AuditAction.MEMBER_DELETE,
      resourceType: 'member',
      resourceId: id,
      details: { username: member.username, email: member.email },
    });

    return { message: 'Member deleted successfully' };
  }

  async getMemberPerformance(memberId: string) {
    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw new AppError('Member not found', 404);
    }

    const [activities, creditHistory, squad] = await Promise.all([
      ActivityModel.find({ memberId: member._id }).sort({ createdAt: -1 }).limit(20).lean(),
      CreditScoreHistoryModel.find({ memberId: member._id }).sort({ createdAt: -1 }).limit(10).lean(),
      member.squadId ? SquadModel.findById(member.squadId).lean() : null,
    ]);

    // Calculate performance trend
    const totalPoints = activities.reduce((acc, act) => acc + (act.points || 0), 0);

    return {
      creditScore: member.creditScore,
      activityPoints: totalPoints,
      eventsParticipated: member.eventsParticipated,
      completedActivities: member.activitiesCompleted,
      recentActivities: activities,
      creditHistory,
      squad: squad
        ? {
            id: squad._id.toString(),
            name: squad.name,
            score: squad.score,
            description: squad.description,
            project: squad.project,
            goal: squad.goal,
          }
        : null,
    };
  }
}

export const memberService = new MemberService();

