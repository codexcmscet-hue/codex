"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUpdateVolunteerSchema = exports.AdminCreateVolunteerSchema = exports.UpdateVolunteerProfileSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.UpdateVolunteerProfileSchema = zod_1.z.object({
    displayName: zod_1.z.string().min(2).max(100).trim().optional(),
    phone: common_schema_1.PhoneSchema.optional(),
    bio: zod_1.z.string().max(500).trim().optional(),
    avatarUrl: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    department: zod_1.z.string().max(100).optional(),
});
exports.AdminCreateVolunteerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(30).trim(),
    email: zod_1.z.string().email().trim().toLowerCase(),
    password: zod_1.z.string().min(8),
    displayName: zod_1.z.string().min(2).max(100).trim(),
    phone: common_schema_1.PhoneSchema.optional(),
    department: zod_1.z.string().max(100).optional(),
});
exports.AdminUpdateVolunteerSchema = exports.UpdateVolunteerProfileSchema.extend({
    isActive: zod_1.z.boolean().optional(),
    assignedMemberIds: zod_1.z.array(zod_1.z.string()).optional(),
});
//# sourceMappingURL=volunteer.schema.js.map