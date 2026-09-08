import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';
import { EventStatus } from '@codexclub/shared';

const eventImageSchema = new Schema(
  {
    key: { type: String, required: true },
    url: { type: String, required: true },
    caption: { type: String, default: '' },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    venue: { type: String, required: true, trim: true },
    organizer: { type: String, required: true, trim: true },
    date: { type: String, required: true, index: true }, // YYYY-MM-DD
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    registrationDeadline: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.UPCOMING,
      index: true,
    },
    category: { type: String, required: true, index: true },
    images: [eventImageSchema],
    participantIds: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    maxParticipants: { type: Number, default: null },
    report: { type: String, default: '' },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export type EventType = InferSchemaType<typeof eventSchema>;
export type EventDocument = HydratedDocument<EventType>;
export const EventModel = model<EventDocument>('Event', eventSchema);
