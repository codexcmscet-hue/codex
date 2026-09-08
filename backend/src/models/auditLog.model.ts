import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';
import { AuditAction } from '@codexclub/shared';

const auditLogSchema = new Schema(
  {
    actorId: { type: String, required: true, index: true },
    actorRole: { type: String, required: true, index: true },
    actorName: { type: String, default: '' },
    action: { type: String, enum: Object.values(AuditAction), required: true, index: true },
    resourceType: { type: String, required: true, index: true },
    resourceId: { type: String, default: null, index: true },
    details: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    result: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS', index: true },
    timestamp: { type: Date, default: Date.now, index: true },
  },
  { timestamps: false }
);

export type AuditLogType = InferSchemaType<typeof auditLogSchema>;
export type AuditLogDocument = HydratedDocument<AuditLogType>;
export const AuditLogModel = model<AuditLogDocument>('AuditLog', auditLogSchema);
