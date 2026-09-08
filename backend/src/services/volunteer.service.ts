import { VolunteerModel } from '../models/volunteer.model';
import { MemberModel } from '../models/member.model';
import { authRepository } from '../repositories/auth.repository';
import { hashPassword } from '../utils/password';
import { AppError } from '../middleware/errorHandler';
import { auditService } from './audit.service';
import {
  AdminCreateVolunteerInput,
  AdminUpdateVolunteerInput,
  UpdateVolunteerProfileInput,
  AuditAction,
  Role,
} from '@codexclub/shared';

export class VolunteerService {
  async listVolunteers(params: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
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
        { department: searchRegex },
      ];
    }
    if (params.isActive !== undefined) {
      query.isActive = params.isActive;
    }

    const [volunteers, total] = await Promise.all([
      VolunteerModel.find(query)
        .populate('assignedMemberIds', 'displayName username email registrationNumber creditScore')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      VolunteerModel.countDocuments(query),
    ]);

    return {
      volunteers: volunteers.map((v: any) => ({
        id: v._id.toString(),
        authUserId: v.authUserId,
        username: v.username,
        email: v.email,
        phone: v.phone,
        displayName: v.displayName,
        avatarUrl: v.avatarUrl,
        bio: v.bio,
        department: v.department,
        assignedMembers: v.assignedMemberIds,
        assignedCount: v.assignedMemberIds?.length || 0,
        isActive: v.isActive,
        joinedAt: v.joinedAt,
        createdAt: v.createdAt,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getVolunteerById(id: string) {
    const volunteer = await VolunteerModel.findById(id)
      .populate('assignedMemberIds', 'displayName username email registrationNumber creditScore squadId avatarUrl')
      .lean();
    if (!volunteer) {
      throw new AppError('Volunteer not found', 404);
    }
    return volunteer;
  }

  async getVolunteerByAuthUserId(authUserId: string) {
    const volunteer = await VolunteerModel.findOne({ authUserId })
      .populate('assignedMemberIds', 'displayName username email registrationNumber creditScore squadId avatarUrl')
      .lean();
    if (!volunteer) {
      throw new AppError('Volunteer profile not found', 404);
    }
    return volunteer;
  }

  async createVolunteer(
    input: AdminCreateVolunteerInput,
    adminInfo: { id: string; role: string; username: string }
  ) {
    const [existingEmail, existingUsername] = await Promise.all([
      authRepository.findByEmail(input.email),
      authRepository.findByUsername(input.username),
    ]);

    if (existingEmail) {
      throw new AppError('Email already registered', 409);
    }
    if (existingUsername) {
      throw new AppError('Username already taken', 409);
    }

    const passwordHash = await hashPassword(input.password);

    const authUser = await authRepository.createUser({
      username: input.username,
      email: input.email,
      passwordHash,
      role: Role.VOLUNTEER,
      emailVerified: true,
    });

    const volunteer = await VolunteerModel.create({
      authUserId: authUser.id,
      username: input.username,
      email: input.email,
      phone: input.phone || '',
      displayName: input.displayName,
      department: input.department || 'General',
    });

    await auditService.log({
      actorId: adminInfo.id,
      actorRole: adminInfo.role,
      actorName: adminInfo.username,
      action: AuditAction.VOLUNTEER_CREATE,
      resourceType: 'volunteer',
      resourceId: volunteer._id.toString(),
      details: { username: input.username, email: input.email },
    });

    return volunteer;
  }

  async updateVolunteerProfile(authUserId: string, input: UpdateVolunteerProfileInput) {
    const volunteer = await VolunteerModel.findOne({ authUserId });
    if (!volunteer) {
      throw new AppError('Volunteer profile not found', 404);
    }

    if (input.displayName !== undefined) volunteer.displayName = input.displayName;
    if (input.phone !== undefined) volunteer.phone = input.phone;
    if (input.bio !== undefined) volunteer.bio = input.bio;
    if (input.avatarUrl !== undefined) volunteer.avatarUrl = input.avatarUrl;
    if (input.department !== undefined) volunteer.department = input.department;

    await volunteer.save();
    return volunteer;
  }

  async adminUpdateVolunteer(
    id: string,
    input: AdminUpdateVolunteerInput,
    adminInfo: { id: string; role: string; username: string }
  ) {
    const volunteer = await VolunteerModel.findById(id);
    if (!volunteer) {
      throw new AppError('Volunteer not found', 404);
    }

    if (input.displayName !== undefined) volunteer.displayName = input.displayName;
    if (input.phone !== undefined) volunteer.phone = input.phone;
    if (input.bio !== undefined) volunteer.bio = input.bio;
    if (input.avatarUrl !== undefined) volunteer.avatarUrl = input.avatarUrl;
    if (input.department !== undefined) volunteer.department = input.department;
    if (input.isActive !== undefined) volunteer.isActive = input.isActive;
    if (input.assignedMemberIds !== undefined) {
      volunteer.assignedMemberIds = input.assignedMemberIds as any;
    }

    await volunteer.save();

    await auditService.log({
      actorId: adminInfo.id,
      actorRole: adminInfo.role,
      actorName: adminInfo.username,
      action: AuditAction.VOLUNTEER_UPDATE,
      resourceType: 'volunteer',
      resourceId: volunteer._id.toString(),
      details: input,
    });

    return volunteer;
  }

  async deleteVolunteer(id: string, adminInfo: { id: string; role: string; username: string }) {
    const volunteer = await VolunteerModel.findById(id);
    if (!volunteer) {
      throw new AppError('Volunteer not found', 404);
    }

    if (volunteer.authUserId) {
      await authRepository.deleteUserSessions(volunteer.authUserId);
      const { pgPool } = await import('../config/postgres');
      await pgPool.query('DELETE FROM auth.users WHERE id = $1', [volunteer.authUserId]);
    }

    await VolunteerModel.findByIdAndDelete(id);

    await auditService.log({
      actorId: adminInfo.id,
      actorRole: adminInfo.role,
      actorName: adminInfo.username,
      action: AuditAction.VOLUNTEER_DELETE,
      resourceType: 'volunteer',
      resourceId: id,
      details: { username: volunteer.username },
    });

    return { message: 'Volunteer deleted successfully' };
  }
}

export const volunteerService = new VolunteerService();

