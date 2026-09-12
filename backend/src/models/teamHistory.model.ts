import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const teamHistorySchema = new Schema(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Squad', required: true, index: true },
    teamName: { type: String, required: true, trim: true },
    action: { type: String, required: true, index: true },
    actorId: { type: String, required: true },
    actorRole: { type: String, required: true },
    actorName: { type: String, required: true },
    previousValue: { type: Schema.Types.Mixed, default: null },
    newValue: { type: Schema.Types.Mixed, default: null },
    reason: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

teamHistorySchema.index({ teamId: 1, createdAt: -1 });

export type TeamHistoryType = InferSchemaType<typeof teamHistorySchema>;
export type TeamHistoryDocument = HydratedDocument<TeamHistoryType>;
export const TeamHistoryModel = model<TeamHistoryDocument>('TeamHistory', teamHistorySchema);

