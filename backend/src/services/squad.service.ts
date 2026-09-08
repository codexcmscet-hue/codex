import { SquadModel } from '../models/squad.model';
import { MemberModel } from '../models/member.model';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  RegisterSquadInput,
  UpdateSquadInput,
  AuditAction,
  Role,
} from '@codexclub/shared';

export class SquadService {
  async listSquads(params: { search?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = { isActive: true };
    if (params.search) {
      const regex = new RegExp(params.search, 'i');
      query.$or = [{ name: regex }, { description: regex }, { project: regex }, { goal: regex }];
    }

    const [squads, total] = await Promise.all([
      SquadModel.find(query)
        .populate('leaderId', 'displayName username email avatarUrl registrationNumber')
        .populate('memberIds', 'displayName username email avatarUrl registrationNumber creditScore')
        .sort({ score: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SquadModel.countDocuments(query),
    ]);

    return {
      squads: squads.map((s: any) => ({
        id: s._id.toString(),
        name: s.name,
        description: s.description,
        leaderId: s.leaderId?._id?.toString() || s.leaderId,
        leader: s.leaderId,
        memberIds: s.memberIds?.map((m: any) => m._id?.toString() || m),
        members: s.memberIds,
        memberCount: (s.memberIds?.length || 0) + 1, // members + leader
        project: s.project,
        goal: s.goal,
        score: s.score,
        isActive: s.isActive,
        createdAt: s.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getSquadById(id: string) {
    const squad = await SquadModel.findById(id)
      .populate('leaderId', 'displayName username email avatarUrl registrationNumber creditScore githubUrl')
      .populate('memberIds', 'displayName username email avatarUrl registrationNumber creditScore githubUrl')
      .lean();

    if (!squad) {
      throw new AppError('Squad not found', 404);
    }
    return squad;
  }

  async registerSquad(input: RegisterSquadInput, memberAuthUserId: string) {
    const leader = await MemberModel.findOne({ authUserId: memberAuthUserId });
    if (!leader) {
      throw new AppError('Member profile not found', 404);
    }

    if (leader.squadId) {
      throw new AppError('You are already a member of a squad. You cannot create another squad.', 400);
    }

    // Check squad name uniqueness
    const existingSquad = await SquadModel.findOne({ name: input.name });
    if (existingSquad) {
      throw new AppError('A squad with this name already exists', 409);
    }

    // Verify additional members are valid and not in any squad
    const memberObjectIds = [];
    if (input.memberIds && input.memberIds.length > 0) {
      const membersToAdd = await MemberModel.find({ _id: { $in: input.memberIds } });
      for (const m of membersToAdd) {
        if (m.squadId) {
          throw new AppError(`Member ${m.displayName} is already part of another squad`, 400);
        }
        memberObjectIds.push(m._id);
      }
    }

    const squad = await SquadModel.create({
      name: input.name,
      description: input.description,
      leaderId: leader._id,
      memberIds: memberObjectIds,
      project: input.project || '',
      goal: input.goal || '',
      score: 0,
    });

    // Link leader and members to this squad
    leader.squadId = squad._id as any;
    await leader.save();

    if (memberObjectIds.length > 0) {
      await MemberModel.updateMany({ _id: { $in: memberObjectIds } }, { squadId: squad._id });
    }

    await auditService.log({
      actorId: memberAuthUserId,
      actorRole: Role.MEMBER,
      actorName: leader.username,
      action: AuditAction.SQUAD_CREATE,
      resourceType: 'squad',
      resourceId: squad._id.toString(),
      details: { name: squad.name },
    });

    return squad;
  }

  async updateSquad(
    id: string,
    input: UpdateSquadInput,
    actorInfo: { id: string; role: string; username: string }
  ) {
    const squad = await SquadModel.findById(id);
    if (!squad) {
      throw new AppError('Squad not found', 404);
    }

    // If role is MEMBER, must be the squad leader
    if (actorInfo.role === Role.MEMBER) {
      const member = await MemberModel.findOne({ authUserId: actorInfo.id });
      if (!member || squad.leaderId.toString() !== member._id.toString()) {
        throw new AppError('Only the squad leader or an admin can update squad details', 403);
      }
    }

    if (input.name !== undefined) squad.name = input.name;
    if (input.description !== undefined) squad.description = input.description;
    if (input.project !== undefined) squad.project = input.project;
    if (input.goal !== undefined) squad.goal = input.goal;
    if (input.score !== undefined && actorInfo.role === Role.ADMIN) squad.score = input.score;
    if (input.isActive !== undefined && actorInfo.role === Role.ADMIN) squad.isActive = input.isActive;

    await squad.save();

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.SQUAD_UPDATE,
      resourceType: 'squad',
      resourceId: squad._id.toString(),
      details: input,
    });

    return squad;
  }
}

export const squadService = new SquadService();

