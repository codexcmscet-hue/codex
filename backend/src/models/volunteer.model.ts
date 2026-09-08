import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const volunteerSchema = new Schema(
  {
    authUserId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, index: true, trim: true },
    email: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    phone: { type: String, default: '', trim: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    department: { type: String, default: 'General' },
    assignedMemberIds: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
    isActive: { type: Boolean, default: true, index: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export type VolunteerType = InferSchemaType<typeof volunteerSchema>;
export type VolunteerDocument = HydratedDocument<VolunteerType>;
export const VolunteerModel = model<VolunteerDocument>('Volunteer', volunteerSchema);
