"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubUrlSchema = exports.RegistrationNumberSchema = exports.PhoneSchema = exports.EmailSchema = exports.PasswordSchema = exports.UsernameSchema = void 0;
const zod_1 = require("zod");
exports.UsernameSchema = zod_1.z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must not exceed 30 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
    .trim();
exports.PasswordSchema = zod_1.z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must not exceed 128 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');
exports.EmailSchema = zod_1.z
    .string()
    .email('Invalid email address structure')
    .max(255, 'Email too long')
    .trim()
    .toLowerCase();
exports.PhoneSchema = zod_1.z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Use E.164 (e.g. +1234567890)')
    .trim();
exports.RegistrationNumberSchema = zod_1.z
    .string()
    .min(3, 'Registration number must be at least 3 characters')
    .max(50, 'Registration number too long')
    .regex(/^[a-zA-Z0-9\-_/]+$/, 'Registration number contains invalid characters')
    .trim()
    .toUpperCase();
exports.GithubUrlSchema = zod_1.z
    .string()
    .url('Must be a valid URL')
    .regex(/^https:\/\/github\.com\/[a-zA-Z0-9_-]+$/, 'Must be a valid GitHub profile URL (e.g. https://github.com/username)')
    .optional()
    .or(zod_1.z.literal(''));
//# sourceMappingURL=common.schema.js.map