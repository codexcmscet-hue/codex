import { z } from 'zod';

export const CreditScoreSchema = z
  .number({
    required_error: 'Credit score is required',
    invalid_type_error: 'Credit score must be a number',
  })
  .int('Credit score must be an integer')
  .min(0, 'Credit score must be at least 0')
  .max(10, 'Credit score cannot exceed 10');

export const UpdateCreditScoreSchema = z.object({
  score: CreditScoreSchema,
  reason: z.string().min(3, 'Reason must be at least 3 characters').max(500, 'Reason too long').trim(),
});

export type UpdateCreditScoreInput = z.infer<typeof UpdateCreditScoreSchema>;
