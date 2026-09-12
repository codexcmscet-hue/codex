"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateEventSchema = exports.CreateEventSchema = void 0;
const zod_1 = require("zod");
const event_types_1 = require("../types/event.types");
exports.CreateEventSchema = zod_1.z.object({
    title: zod_1.z.string().min(3, 'Title must be at least 3 characters').max(150).trim(),
    description: zod_1.z.string().min(10, 'Description must be at least 10 characters').trim(),
    venue: zod_1.z.string().min(2, 'Venue is required').max(200).trim(),
    organizer: zod_1.z.string().min(2, 'Organizer is required').max(100).trim(),
    date: zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
    startTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be HH:MM'),
    endTime: zod_1.z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be HH:MM'),
    registrationDeadline: zod_1.z.string().min(1, 'Registration deadline is required'),
    status: zod_1.z.nativeEnum(event_types_1.EventStatus).optional().default(event_types_1.EventStatus.UPCOMING),
    category: zod_1.z.string().min(2).max(50).trim(),
    maxParticipants: zod_1.z.number().int().positive().optional(),
});
exports.UpdateEventSchema = exports.CreateEventSchema.partial().extend({
    report: zod_1.z.string().optional(),
});
//# sourceMappingURL=event.schema.js.map