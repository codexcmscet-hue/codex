import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const activitySchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    type: { type: String, required: true, index: true },
    description: { type: String, required: true },
    points: { type: Number, default: 10 },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type ActivityType = InferSchemaType<typeof activitySchema>;
export type ActivityDocument = HydratedDocument<ActivityType>;
export const ActivityModel = model<ActivityDocument>('Activity', activitySchema);
