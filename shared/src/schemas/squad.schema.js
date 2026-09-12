"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamLeaderboardQuerySchema = exports.ChangeTeamLeaderSchema = exports.AddTeamMemberSchema = exports.UpdateTeamScoreSchema = exports.UpdateTeamSchema = exports.UpdateSquadSchema = exports.CreateTeamSchema = exports.RegisterSquadSchema = void 0;
const zod_1 = require("zod");
exports.RegisterSquadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, 'Team name must be at least 2 characters').max(50, 'Team name cannot exceed 50 characters').trim(),
    description: zod_1.z.string().min(5, 'Description must be at least 5 characters').max(500).trim(),
    project: zod_1.z.string().max(200).trim().optional(),
    goal: zod_1.z.string().max(500).trim().optional(),
    leaderId: zod_1.z.string().optional(),
    memberIds: zod_1.z.array(zod_1.z.string()).max(10, 'A team can have at most 10 additional members').optional().default([]),
    creditScore: zod_1.z.coerce.number().min(0, 'Score cannot be negative').max(10, 'Score cannot exceed 10').optional().default(0),
});
exports.CreateTeamSchema = exports.RegisterSquadSchema;
exports.UpdateSquadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(50).trim().optional(),
    description: zod_1.z.string().min(5).max(500).trim().optional(),
    project: zod_1.z.string().max(200).trim().optional(),
    goal: zod_1.z.string().max(500).trim().optional(),
    memberIds: zod_1.z.array(zod_1.z.string()).optional(),
    score: zod_1.z.coerce.number().min(0, 'Score cannot be negative').max(10, 'Score cannot exceed 10').optional(),
    status: zod_1.z.enum(['ACTIVE', 'ARCHIVED']).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.UpdateTeamSchema = exports.UpdateSquadSchema;
exports.UpdateTeamScoreSchema = zod_1.z.object({
    score: zod_1.z.coerce
        .number({ invalid_type_error: 'Credit score must be a number' })
        .min(0, 'Score cannot be below 0.0')
        .max(10, 'Score cannot exceed 10.0'),
    reason: zod_1.z.string().min(3, 'Reason must be at least 3 characters long').trim(),
});
exports.AddTeamMemberSchema = zod_1.z.object({
    memberId: zod_1.z.string().min(1, 'Member ID is required'),
});
exports.ChangeTeamLeaderSchema = zod_1.z.object({
    leaderId: zod_1.z.string().min(1, 'Leader ID is required'),
});
exports.TeamLeaderboardQuerySchema = zod_1.z.object({
    search: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['score', 'name', 'rank', 'createdAt']).optional().default('score'),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional().default('desc'),
    status: zod_1.z.enum(['ACTIVE', 'ARCHIVED', 'ALL']).optional().default('ACTIVE'),
    page: zod_1.z.coerce.number().int().min(1).optional().default(1),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional().default(50),
});
//# sourceMappingURL=squad.schema.js.map