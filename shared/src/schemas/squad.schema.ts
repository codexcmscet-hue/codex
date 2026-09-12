import { z } from 'zod';

export const RegisterSquadSchema = z.object({
  name: z.string().min(2, 'Team name must be at least 2 characters').max(50, 'Team name cannot exceed 50 characters').trim(),
  description: z.string().min(5, 'Description must be at least 5 characters').max(500).trim(),
  project: z.string().max(200).trim().optional(),
  goal: z.string().max(500).trim().optional(),
  leaderId: z.string().optional(),
  memberIds: z.array(z.string()).max(10, 'A team can have at most 10 additional members').optional().default([]),
  creditScore: z.coerce.number().min(0, 'Score cannot be negative').max(10, 'Score cannot exceed 10').optional().default(0),
});

export const CreateTeamSchema = RegisterSquadSchema;

export const UpdateSquadSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  description: z.string().min(5).max(500).trim().optional(),
  project: z.string().max(200).trim().optional(),
  goal: z.string().max(500).trim().optional(),
  memberIds: z.array(z.string()).optional(),
  score: z.coerce.number().min(0, 'Score cannot be negative').max(10, 'Score cannot exceed 10').optional(),
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
  isActive: z.boolean().optional(),
});

export const UpdateTeamSchema = UpdateSquadSchema;

export const UpdateTeamScoreSchema = z.object({
  score: z.coerce
    .number({ invalid_type_error: 'Credit score must be a number' })
    .min(0, 'Score cannot be below 0.0')
    .max(10, 'Score cannot exceed 10.0'),
  reason: z.string().min(3, 'Reason must be at least 3 characters long').trim(),
});

export const AddTeamMemberSchema = z.object({
  memberId: z.string().min(1, 'Member ID is required'),
});

export const ChangeTeamLeaderSchema = z.object({
  leaderId: z.string().min(1, 'Leader ID is required'),
});

export const TeamLeaderboardQuerySchema = z.object({
  search: z.string().optional(),
  sortBy: z.enum(['score', 'name', 'rank', 'createdAt']).optional().default('score'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  status: z.enum(['ACTIVE', 'ARCHIVED', 'ALL']).optional().default('ACTIVE'),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export type RegisterSquadInput = z.infer<typeof RegisterSquadSchema>;
export type CreateTeamInput = z.infer<typeof CreateTeamSchema>;
export type UpdateSquadInput = z.infer<typeof UpdateSquadSchema>;
export type UpdateTeamInput = z.infer<typeof UpdateTeamSchema>;
export type UpdateTeamScoreInput = z.infer<typeof UpdateTeamScoreSchema>;
export type AddTeamMemberInput = z.infer<typeof AddTeamMemberSchema>;
export type ChangeTeamLeaderInput = z.infer<typeof ChangeTeamLeaderSchema>;
export type TeamLeaderboardQueryInput = z.infer<typeof TeamLeaderboardQuerySchema>;

