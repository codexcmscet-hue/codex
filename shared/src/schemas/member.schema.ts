import { z } from 'zod';
import { PhoneSchema, GithubUrlSchema } from './common.schema';

export const UpdateMemberProfileSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters').max(100).trim().optional(),
  phone: PhoneSchema.optional(),
  bio: z.string().max(500, 'Bio must be under 500 characters').trim().optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional().or(z.literal('')),
  githubUrl: GithubUrlSchema,
});

export const AdminUpdateMemberSchema = UpdateMemberProfileSchema.extend({
  isActive: z.boolean().optional(),
  squadId: z.string().nullable().optional(),
});

export type UpdateMemberProfileInput = z.infer<typeof UpdateMemberProfileSchema>;
export type AdminUpdateMemberInput = z.infer<typeof AdminUpdateMemberSchema>;
