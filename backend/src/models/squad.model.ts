import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const squadSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, required: true, trim: true },
    leaderId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    project: { type: String, default: '', trim: true },
    goal: { type: String, default: '', trim: true },
    score: { type: Number, default: 0, min: 0, max: 10, index: true },
    status: { type: String, enum: ['ACTIVE', 'ARCHIVED'], default: 'ACTIVE', index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

squadSchema.index({ status: 1, score: -1, createdAt: -1 });
squadSchema.index({ isActive: 1, score: -1, createdAt: -1 });

export type SquadType = InferSchemaType<typeof squadSchema>;
export type SquadDocument = HydratedDocument<SquadType>;
export const SquadModel = model<SquadDocument>('Squad', squadSchema);

