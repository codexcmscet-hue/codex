import { SquadModel } from '../models/squad.model';
import { MemberModel } from '../models/member.model';
import { TeamHistoryModel } from '../models/teamHistory.model';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  RegisterSquadInput,
  CreateTeamInput,
  UpdateSquadInput,
  AuditAction,
  Role,
} from '@codexclub/shared';

export class SquadService {
  async getLeaderboard(params: {
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 50));
    const skip = (page - 1) * limit;

    const query: Record<string, any> = {};
    if (params.status && params.status !== 'ALL') {
      query.status = params.status;
      if (params.status === 'ACTIVE') {
        query.isActive = true;
      }
    } else if (!params.status) {
      query.status = 'ACTIVE';
      query.isActive = true;
    }

    if (params.search) {
      const regex = new RegExp(params.search, 'i');
      query.$or = [{ name: regex }, { description: regex }, { project: regex }, { goal: regex }];
    }

    const sortOption: Record<string, any> = {};
    if (params.sortBy === 'name') {
      sortOption.name = params.sortOrder === 'asc' ? 1 : -1;
    } else if (params.sortBy === 'createdAt') {
      sortOption.createdAt = params.sortOrder === 'asc' ? 1 : -1;
    } else {
      // Primary: score descending, Secondary: deterministic createdAt
      sortOption.score = params.sortOrder === 'asc' ? 1 : -1;
      sortOption.createdAt = 1;
    }

    const [rawSquads, total] = await Promise.all([
      SquadModel.find(query)
        .populate('leaderId', 'displayName username email avatarUrl registrationNumber creditScore activityPoints')
        .populate('memberIds', 'displayName username email avatarUrl registrationNumber creditScore activityPoints')
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
      SquadModel.countDocuments(query),
    ]);

    const formattedLeaderboard = rawSquads.map((s: any, index: number) => {
      const leader = s.leaderId
        ? {
            id: s.leaderId._id?.toString() || s.leaderId.id,
            username: s.leaderId.username,
            displayName: s.leaderId.displayName,
            avatarUrl: s.leaderId.avatarUrl,
            registrationNumber: s.leaderId.registrationNumber,
            creditScore: s.leaderId.creditScore ?? 5,
            activityPoints: s.leaderId.activityPoints ?? 0,
          }
        : undefined;

      const members = (s.memberIds || []).map((m: any) => ({
        id: m._id?.toString() || m.id,
        username: m.username,
        displayName: m.displayName,
        avatarUrl: m.avatarUrl,
        registrationNumber: m.registrationNumber,
        creditScore: m.creditScore ?? 5,
        activityPoints: m.activityPoints ?? 0,
      }));

      // Calculate average member score
      const allMembers = leader ? [leader, ...members] : members;
      const avgScore =
        allMembers.length > 0
          ? Number((allMembers.reduce((acc: number, curr: any) => acc + (curr.creditScore || 5), 0) / allMembers.length).toFixed(1))
          : s.score;

      // Deterministic performance rating category
      let performanceRating: 'EXCEPTIONAL' | 'ADVANCED' | 'PROFICIENT' | 'DEVELOPING' = 'PROFICIENT';
      if (s.score >= 9.0) performanceRating = 'EXCEPTIONAL';
      else if (s.score >= 7.5) performanceRating = 'ADVANCED';
      else if (s.score >= 6.0) performanceRating = 'PROFICIENT';
      else performanceRating = 'DEVELOPING';

      return {
        id: s._id.toString(),
        name: s.name,
        description: s.description,
        rank: skip + index + 1,
        score: Number(s.score ?? 0),
        memberCount: (s.memberIds?.length || 0) + (s.leaderId ? 1 : 0),
        leader,
        members,
        averageMemberScore: avgScore,
        project: s.project || '',
        goal: s.goal || '',
        status: s.status || (s.isActive ? 'ACTIVE' : 'ARCHIVED'),
        performanceRating,
        createdAt: s.createdAt,
      };
    });

    return {
      leaderboard: formattedLeaderboard,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async listSquads(params: { search?: string; status?: string; page?: number; limit?: number }) {
    return this.getLeaderboard(params);
  }

  async getSquadById(id: string) {
    const squad: any = await SquadModel.findById(id)
      .populate('leaderId', 'displayName username email avatarUrl registrationNumber creditScore githubUrl activityPoints')
      .populate('memberIds', 'displayName username email avatarUrl registrationNumber creditScore githubUrl activityPoints')
      .lean();

    if (!squad) {
      throw new AppError('Team not found', 404);
    }

    const leader = squad.leaderId
      ? {
          id: squad.leaderId._id?.toString() || squad.leaderId.id,
          username: squad.leaderId.username,
          displayName: squad.leaderId.displayName,
          avatarUrl: squad.leaderId.avatarUrl,
          registrationNumber: squad.leaderId.registrationNumber,
          creditScore: squad.leaderId.creditScore ?? 5,
          githubUrl: squad.leaderId.githubUrl,
          activityPoints: squad.leaderId.activityPoints ?? 0,
        }
      : null;

    const members = (squad.memberIds || []).map((m: any) => ({
      id: m._id?.toString() || m.id,
      username: m.username,
      displayName: m.displayName,
      avatarUrl: m.avatarUrl,
      registrationNumber: m.registrationNumber,
      creditScore: m.creditScore ?? 5,
      githubUrl: m.githubUrl,
      activityPoints: m.activityPoints ?? 0,
    }));

    // Calculate rank
    const higherScoreCount = await SquadModel.countDocuments({
      status: 'ACTIVE',
      score: { $gt: squad.score },
    });

    const allMembers = leader ? [leader, ...members] : members;
    const avgScore =
      allMembers.length > 0
        ? Number((allMembers.reduce((acc: number, curr: any) => acc + (curr.creditScore || 5), 0) / allMembers.length).toFixed(1))
        : squad.score;

    return {
      id: squad._id.toString(),
      name: squad.name,
      description: squad.description,
      leaderId: leader?.id,
      leader,
      memberIds: members.map((m: any) => m.id),
      members,
      memberCount: allMembers.length,
      project: squad.project || '',
      goal: squad.goal || '',
      score: Number(squad.score ?? 0),
      rank: higherScoreCount + 1,
      averageMemberScore: avgScore,
      status: squad.status || (squad.isActive ? 'ACTIVE' : 'ARCHIVED'),
      isActive: squad.isActive,
      createdAt: squad.createdAt,
      updatedAt: squad.updatedAt,
    };
  }

  async createTeam(
    input: CreateTeamInput,
    actorInfo: { id: string; role: string; username: string }
  ) {
    // Only VOLUNTEER or ADMIN can create teams
    if (actorInfo.role !== Role.VOLUNTEER && actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Volunteers and Admins can create teams', 403);
    }

    // Check name uniqueness
    const existing = await SquadModel.findOne({ name: input.name });
    if (existing) {
      throw new AppError('A team with this name already exists', 409);
    }

    // Leader validation
    if (!input.leaderId) {
      throw new AppError('Team leader is required', 400);
    }

    const leader = await MemberModel.findById(input.leaderId);
    if (!leader) {
      throw new AppError('Selected leader does not exist as a member', 404);
    }

    if (leader.squadId) {
      throw new AppError(`Leader ${leader.displayName} is already assigned to another team`, 400);
    }

    // Member validation
    const memberObjectIds = [];
    if (input.memberIds && input.memberIds.length > 0) {
      const distinctMemberIds = Array.from(new Set(input.memberIds)).filter(
        (id) => id !== input.leaderId
      );

      const membersToAdd = await MemberModel.find({ _id: { $in: distinctMemberIds } });
      if (membersToAdd.length !== distinctMemberIds.length) {
        throw new AppError('One or more selected members do not exist', 404);
      }

      for (const m of membersToAdd) {
        if (m.squadId) {
          throw new AppError(`Member ${m.displayName} is already assigned to another team`, 400);
        }
        memberObjectIds.push(m._id);
      }
    }

    const score = Number(input.creditScore ?? 0);
    if (isNaN(score) || score < 0 || score > 10) {
      throw new AppError('Team credit score must be a number between 0 and 10', 400);
    }

    const team = await SquadModel.create({
      name: input.name,
      description: input.description,
      leaderId: leader._id,
      memberIds: memberObjectIds,
      project: input.project || '',
      goal: input.goal || '',
      score,
      status: 'ACTIVE',
      isActive: true,
    });

    // Update members and leader with squadId
    leader.squadId = team._id as any;
    await leader.save();

    if (memberObjectIds.length > 0) {
      await MemberModel.updateMany({ _id: { $in: memberObjectIds } }, { squadId: team._id });
    }

    // History & Audit Logging
    await TeamHistoryModel.create({
      teamId: team._id,
      teamName: team.name,
      action: 'TEAM_CREATED',
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      newValue: {
        name: team.name,
        leaderId: leader._id.toString(),
        memberCount: memberObjectIds.length + 1,
        score: team.score,
      },
      reason: 'Initial team creation',
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_CREATED,
      resourceType: 'team',
      resourceId: team._id.toString(),
      details: { name: team.name, leader: leader.username, score: team.score },
    });

    return this.getSquadById(team._id.toString());
  }

  async registerSquad(input: RegisterSquadInput, memberAuthUserId: string) {
    const leader = await MemberModel.findOne({ authUserId: memberAuthUserId });
    if (!leader) {
      throw new AppError('Member profile not found', 404);
    }

    return this.createTeam(
      {
        ...input,
        leaderId: leader._id.toString(),
      },
      { id: memberAuthUserId, role: Role.MEMBER, username: leader.username }
    );
  }

  async updateSquad(
    id: string,
    input: UpdateSquadInput,
    actorInfo: { id: string; role: string; username: string }
  ) {
    const team = await SquadModel.findById(id);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Members cannot edit teams unless they are leader and only updating description/project/goal
    if (actorInfo.role === Role.MEMBER) {
      const member = await MemberModel.findOne({ authUserId: actorInfo.id });
      if (!member || team.leaderId.toString() !== member._id.toString()) {
        throw new AppError('Only team leaders, volunteers, or admins can update team details', 403);
      }
    }

    const previousState = {
      name: team.name,
      description: team.description,
      project: team.project,
      goal: team.goal,
      status: team.status,
    };

    if (input.name !== undefined && (actorInfo.role === Role.ADMIN || actorInfo.role === Role.VOLUNTEER)) {
      if (input.name !== team.name) {
        const existing = await SquadModel.findOne({ name: input.name, _id: { $ne: team._id } });
        if (existing) throw new AppError('A team with this name already exists', 409);
        team.name = input.name;
      }
    }

    if (input.description !== undefined) team.description = input.description;
    if (input.project !== undefined) team.project = input.project;
    if (input.goal !== undefined) team.goal = input.goal;

    if (input.status !== undefined && (actorInfo.role === Role.ADMIN || actorInfo.role === Role.VOLUNTEER)) {
      team.status = input.status;
      team.isActive = input.status === 'ACTIVE';
    }

    await team.save();

    await TeamHistoryModel.create({
      teamId: team._id,
      teamName: team.name,
      action: 'TEAM_UPDATED',
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      previousValue: previousState,
      newValue: input,
      reason: 'Team information updated',
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_UPDATED,
      resourceType: 'team',
      resourceId: team._id.toString(),
      details: input,
    });

    return this.getSquadById(team._id.toString());
  }

  async addMember(
    teamId: string,
    memberId: string,
    actorInfo: { id: string; role: string; username: string }
  ) {
    if (actorInfo.role !== Role.VOLUNTEER && actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Volunteers and Admins can add members to a team', 403);
    }

    const team = await SquadModel.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw new AppError('Member profile not found', 404);
    }

    // Strict rule: 1 member to 1 active team
    if (member.squadId) {
      if (member.squadId.toString() === team._id.toString()) {
        throw new AppError('Member is already part of this team', 400);
      }
      throw new AppError('This member is already assigned to another team.', 400);
    }

    if (team.memberIds.some((m) => m.toString() === member._id.toString()) || team.leaderId.toString() === member._id.toString()) {
      throw new AppError('Member is already part of this team', 400);
    }

    team.memberIds.push(member._id);
    await team.save();

    member.squadId = team._id as any;
    await member.save();

    await TeamHistoryModel.create({
      teamId: team._id,
      teamName: team.name,
      action: 'TEAM_MEMBER_ADDED',
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      newValue: { memberId: member._id.toString(), memberName: member.displayName },
      reason: `Member ${member.displayName} added to team`,
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_MEMBER_ADDED,
      resourceType: 'team',
      resourceId: team._id.toString(),
      details: { memberId: member._id.toString(), memberName: member.displayName },
    });

    return this.getSquadById(team._id.toString());
  }

  async removeMember(
    teamId: string,
    memberId: string,
    actorInfo: { id: string; role: string; username: string }
  ) {
    if (actorInfo.role !== Role.VOLUNTEER && actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Volunteers and Admins can remove members from a team', 403);
    }

    const team = await SquadModel.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const member = await MemberModel.findById(memberId);
    if (!member) {
      throw new AppError('Member profile not found', 404);
    }

    const isMember = team.memberIds.some((m) => m.toString() === member._id.toString());
    const isLeader = team.leaderId.toString() === member._id.toString();

    if (!isMember && !isLeader) {
      throw new AppError('Member does not belong to this team', 400);
    }

    if (isMember) {
      team.memberIds = team.memberIds.filter((m) => m.toString() !== member._id.toString());
    }

    if (isLeader) {
      // If leader is removed, promote next member if available or clear leader
      if (team.memberIds.length > 0) {
        const nextLeaderId = team.memberIds[0];
        team.memberIds = team.memberIds.slice(1);
        team.leaderId = nextLeaderId;
      }
    }

    await team.save();

    member.squadId = undefined as any;
    await member.save();

    await TeamHistoryModel.create({
      teamId: team._id,
      teamName: team.name,
      action: 'TEAM_MEMBER_REMOVED',
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      previousValue: { memberId: member._id.toString(), memberName: member.displayName },
      reason: `Member ${member.displayName} removed from team`,
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_MEMBER_REMOVED,
      resourceType: 'team',
      resourceId: team._id.toString(),
      details: { memberId: member._id.toString(), memberName: member.displayName },
    });

    return this.getSquadById(team._id.toString());
  }

  async changeLeader(
    teamId: string,
    newLeaderId: string,
    actorInfo: { id: string; role: string; username: string }
  ) {
    if (actorInfo.role !== Role.VOLUNTEER && actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Volunteers and Admins can change team leaders', 403);
    }

    const team = await SquadModel.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const newLeader = await MemberModel.findById(newLeaderId);
    if (!newLeader) {
      throw new AppError('Member not found', 404);
    }

    // Leader must belong to this team
    const isMember = team.memberIds.some((m) => m.toString() === newLeader._id.toString());
    const isAlreadyLeader = team.leaderId.toString() === newLeader._id.toString();

    if (!isMember && !isAlreadyLeader) {
      throw new AppError('The new leader must be a member of this team', 400);
    }

    if (!isAlreadyLeader) {
      const oldLeaderId = team.leaderId;
      team.memberIds = team.memberIds.filter((m) => m.toString() !== newLeader._id.toString());
      if (oldLeaderId) {
        team.memberIds.push(oldLeaderId);
      }
      team.leaderId = newLeader._id;
      await team.save();

      await TeamHistoryModel.create({
        teamId: team._id,
        teamName: team.name,
        action: 'TEAM_LEADER_CHANGED',
        actorId: actorInfo.id,
        actorRole: actorInfo.role,
        actorName: actorInfo.username,
        previousValue: { leaderId: oldLeaderId.toString() },
        newValue: { leaderId: newLeader._id.toString(), leaderName: newLeader.displayName },
        reason: `Team leader changed to ${newLeader.displayName}`,
      });

      await auditService.log({
        actorId: actorInfo.id,
        actorRole: actorInfo.role,
        actorName: actorInfo.username,
        action: AuditAction.TEAM_LEADER_CHANGED,
        resourceType: 'team',
        resourceId: team._id.toString(),
        details: { newLeader: newLeader.displayName },
      });
    }

    return this.getSquadById(team._id.toString());
  }

  async updateScore(
    teamId: string,
    score: number,
    reason: string,
    actorInfo: { id: string; role: string; username: string }
  ) {
    if (actorInfo.role !== Role.VOLUNTEER && actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Volunteers and Admins can update team scores', 403);
    }

    const numScore = Number(score);
    if (isNaN(numScore) || numScore < 0 || numScore > 10) {
      throw new AppError('Team credit score must be a number between 0.0 and 10.0', 400);
    }

    const team = await SquadModel.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    const previousScore = team.score;
    team.score = numScore;
    await team.save();

    await TeamHistoryModel.create({
      teamId: team._id,
      teamName: team.name,
      action: 'TEAM_SCORE_UPDATED',
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      previousValue: { score: previousScore },
      newValue: { score: numScore },
      reason,
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_SCORE_UPDATED,
      resourceType: 'team',
      resourceId: team._id.toString(),
      details: { previousScore, newScore: numScore, reason },
    });

    return this.getSquadById(team._id.toString());
  }

  async getTeamHistory(teamId: string) {
    const history = await TeamHistoryModel.find({ teamId })
      .sort({ createdAt: -1 })
      .lean();

    return history.map((h: any) => ({
      id: h._id.toString(),
      teamId: h.teamId.toString(),
      teamName: h.teamName,
      action: h.action,
      actorId: h.actorId,
      actorRole: h.actorRole,
      actorName: h.actorName,
      previousValue: h.previousValue,
      newValue: h.newValue,
      reason: h.reason,
      createdAt: h.createdAt,
    }));
  }

  async archiveTeam(
    teamId: string,
    actorInfo: { id: string; role: string; username: string }
  ) {
    if (actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Administrators can archive teams', 403);
    }

    const team = await SquadModel.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    team.status = 'ARCHIVED';
    team.isActive = false;
    await team.save();

    // Detach members so they can be reassigned if needed
    await MemberModel.updateMany({ squadId: team._id }, { $unset: { squadId: 1 } });

    await TeamHistoryModel.create({
      teamId: team._id,
      teamName: team.name,
      action: 'TEAM_ARCHIVED',
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      reason: 'Team archived by Administrator',
    });

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_ARCHIVED,
      resourceType: 'team',
      resourceId: team._id.toString(),
    });

    return { message: 'Team archived successfully' };
  }

  async deleteTeam(
    teamId: string,
    actorInfo: { id: string; role: string; username: string }
  ) {
    if (actorInfo.role !== Role.ADMIN) {
      throw new AppError('Only Administrators can delete teams', 403);
    }

    const team = await SquadModel.findById(teamId);
    if (!team) {
      throw new AppError('Team not found', 404);
    }

    // Detach all members
    await MemberModel.updateMany({ squadId: team._id }, { $unset: { squadId: 1 } });
    await TeamHistoryModel.deleteMany({ teamId: team._id });
    await SquadModel.findByIdAndDelete(teamId);

    await auditService.log({
      actorId: actorInfo.id,
      actorRole: actorInfo.role,
      actorName: actorInfo.username,
      action: AuditAction.TEAM_DELETED,
      resourceType: 'team',
      resourceId: teamId,
      details: { name: team.name },
    });

    return { message: 'Team deleted permanently' };
  }

  async getMemberTeam(memberAuthUserId: string) {
    const member = await MemberModel.findOne({ authUserId: memberAuthUserId });
    if (!member || !member.squadId) {
      return null;
    }
    return this.getSquadById(member.squadId.toString());
  }
}

export const squadService = new SquadService();


