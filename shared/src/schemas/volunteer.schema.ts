import { z } from 'zod';
import { PhoneSchema } from './common.schema';

export const UpdateVolunteerProfileSchema = z.object({
  displayName: z.string().min(2).max(100).trim().optional(),
  phone: PhoneSchema.optional(),
  bio: z.string().max(500).trim().optional(),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  department: z.string().max(100).optional(),
});

export const AdminCreateVolunteerSchema = z.object({
  username: z.string().min(3).max(30).trim(),
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(8),
  displayName: z.string().min(2).max(100).trim(),
  phone: PhoneSchema.optional(),
  department: z.string().max(100).optional(),
});

export const AdminUpdateVolunteerSchema = UpdateVolunteerProfileSchema.extend({
  isActive: z.boolean().optional(),
  assignedMemberIds: z.array(z.string()).optional(),
});

export type UpdateVolunteerProfileInput = z.infer<typeof UpdateVolunteerProfileSchema>;
export type AdminCreateVolunteerInput = z.infer<typeof AdminCreateVolunteerSchema>;
export type AdminUpdateVolunteerInput = z.infer<typeof AdminUpdateVolunteerSchema>;
