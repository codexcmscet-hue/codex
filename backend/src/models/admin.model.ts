import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const adminSchema = new Schema(
  {
    authUserId: { type: String, required: true, unique: true, index: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    displayName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export type AdminType = InferSchemaType<typeof adminSchema>;
export type AdminDocument = HydratedDocument<AdminType>;
export const AdminModel = model<AdminDocument>('Admin', adminSchema);
