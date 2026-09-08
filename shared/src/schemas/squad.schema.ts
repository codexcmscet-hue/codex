import { z } from 'zod';

export const RegisterSquadSchema = z.object({
  name: z.string().min(2, 'Squad name must be at least 2 characters').max(50, 'Squad name too long').trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500).trim(),
  project: z.string().max(200).trim().optional(),
  goal: z.string().max(500).trim().optional(),
  memberIds: z.array(z.string()).max(5, 'A squad can have at most 5 additional members (6 total)').optional().default([]),
});

export const UpdateSquadSchema = z.object({
  name: z.string().min(2).max(50).trim().optional(),
  description: z.string().min(10).max(500).trim().optional(),
  project: z.string().max(200).trim().optional(),
  goal: z.string().max(500).trim().optional(),
  memberIds: z.array(z.string()).max(6).optional(),
  score: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
});

export type RegisterSquadInput = z.infer<typeof RegisterSquadSchema>;
export type UpdateSquadInput = z.infer<typeof UpdateSquadSchema>;
