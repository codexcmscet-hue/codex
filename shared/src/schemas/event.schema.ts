import { z } from 'zod';
import { EventStatus } from '../types/event.types';

export const CreateEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150).trim(),
  description: z.string().min(10, 'Description must be at least 10 characters').trim(),
  venue: z.string().min(2, 'Venue is required').max(200).trim(),
  organizer: z.string().min(2, 'Organizer is required').max(100).trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be HH:MM'),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be HH:MM'),
  registrationDeadline: z.string().min(1, 'Registration deadline is required'),
  status: z.nativeEnum(EventStatus).optional().default(EventStatus.UPCOMING),
  category: z.string().min(2).max(50).trim(),
  maxParticipants: z.number().int().positive().optional(),
});

export const UpdateEventSchema = CreateEventSchema.partial().extend({
  report: z.string().optional(),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
