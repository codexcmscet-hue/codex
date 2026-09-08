import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

const creditScoreHistorySchema = new Schema(
  {
    memberId: { type: Schema.Types.ObjectId, ref: 'Member', required: true, index: true },
    previousScore: { type: Number, required: true, min: 0, max: 10 },
    newScore: { type: Number, required: true, min: 0, max: 10 },
    modifiedBy: { type: String, required: true }, // authUserId
    modifiedByRole: { type: String, required: true },
    modifiedByName: { type: String, default: '' },
    reason: { type: String, required: true, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export type CreditScoreHistoryType = InferSchemaType<typeof creditScoreHistorySchema>;
export type CreditScoreHistoryDocument = HydratedDocument<CreditScoreHistoryType>;
export const CreditScoreHistoryModel = model<CreditScoreHistoryDocument>('CreditScoreHistory', creditScoreHistorySchema);
