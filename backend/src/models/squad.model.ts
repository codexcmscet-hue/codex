import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const squadSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, index: true, trim: true },
    description: { type: String, required: true, trim: true },
    leaderId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    memberIds: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    project: { type: String, default: '', trim: true },
    goal: { type: String, default: '', trim: true },
    score: { type: Number, default: 0, min: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

export type SquadType = InferSchemaType<typeof squadSchema>;
export type SquadDocument = HydratedDocument<SquadType>;
export const SquadModel = model<SquadDocument>('Squad', squadSchema);
