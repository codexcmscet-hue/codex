"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateMemberSchema = exports.UpdateMemberProfileSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.UpdateMemberProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100).trim().optional(),
    phone: common_schema_1.PhoneSchema.optional(),
    bio: zod_1.z.string().max(500, 'Bio must be under 500 characters').trim().optional(),
    avatarUrl: zod_1.z.string().url('Invalid avatar URL').optional().or(zod_1.z.literal('')),
    githubUrl: common_schema_1.GithubUrlSchema,
});
exports.AdminUpdateMemberSchema = exports.UpdateMemberProfileSchema.extend({
    isActive: zod_1.z.boolean().optional(),
    squadId: zod_1.z.string().nullable().optional(),
});
//# sourceMappingURL=member.schema.js.map