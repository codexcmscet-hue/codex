"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyEmailSchema = exports.ChangePasswordSchema = exports.ResetPasswordSchema = exports.ForgotPasswordSchema = exports.RegisterVolunteerSchema = exports.RegisterMemberSchema = exports.AdminLoginSchema = exports.LoginSchema = void 0;
const zod_1 = require("zod");
const common_schema_1 = require("./common.schema");
exports.LoginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1, 'Username or email is required').trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
    rememberMe: zod_1.z.boolean().optional().default(false),
});
exports.AdminLoginSchema = zod_1.z.object({
    identifier: zod_1.z.string().min(1, 'Username or email is required').trim(),
    password: zod_1.z.string().min(1, 'Password is required'),
    rememberMe: zod_1.z.boolean().optional().default(false),
});
exports.RegisterMemberSchema = zod_1.z
    .object({
    username: common_schema_1.UsernameSchema,
    password: common_schema_1.PasswordSchema,
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your password'),
    email: common_schema_1.EmailSchema,
    phone: common_schema_1.PhoneSchema,
    registrationNumber: common_schema_1.RegistrationNumberSchema,
    displayName: zod_1.z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.RegisterVolunteerSchema = zod_1.z
    .object({
    username: common_schema_1.UsernameSchema,
    password: common_schema_1.PasswordSchema,
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your password'),
    email: common_schema_1.EmailSchema,
    phone: common_schema_1.PhoneSchema.optional(),
    displayName: zod_1.z.string().min(2).max(100).trim(),
    department: zod_1.z.string().max(100).optional(),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.ForgotPasswordSchema = zod_1.z.object({
    email: common_schema_1.EmailSchema,
});
exports.ResetPasswordSchema = zod_1.z
    .object({
    token: zod_1.z.string().min(1, 'Reset token is required'),
    password: common_schema_1.PasswordSchema,
    confirmPassword: zod_1.z.string().min(1, 'Please confirm your password'),
})
    .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});
exports.ChangePasswordSchema = zod_1.z
    .object({
    currentPassword: zod_1.z.string().min(1, 'Current password is required'),
    newPassword: common_schema_1.PasswordSchema,
    confirmNewPassword: zod_1.z.string().min(1, 'Please confirm your new password'),
})
    .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
})
    .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
});
exports.VerifyEmailSchema = zod_1.z.object({
    token: zod_1.z.string().min(1, 'Verification token is required'),
});
//# sourceMappingURL=auth.schema.js.map