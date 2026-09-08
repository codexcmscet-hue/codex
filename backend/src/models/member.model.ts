import { Schema, model, InferSchemaType, HydratedDocument, Types } from 'mongoose';

const memberSchema = new Schema(
  {
    authUserId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    phone: { type: String, required: true, index: true, trim: true },
    registrationNumber: { type: String, required: true, unique: true, index: true, trim: true, uppercase: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    squadId: { type: Schema.Types.ObjectId, ref: 'Squad', default: null, index: true },
    isActive: { type: Boolean, default: true, index: true },
    creditScore: { type: Number, default: 5, min: 0, max: 10, required: true },
    activitiesCompleted: { type: Number, default: 0 },
    eventsParticipated: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type MemberType = InferSchemaType<typeof memberSchema>;
export type MemberDocument = HydratedDocument<MemberType>;
export const MemberModel = model<MemberDocument>('Member', memberSchema);
