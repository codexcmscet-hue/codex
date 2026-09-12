"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCreditScoreSchema = exports.CreditScoreSchema = void 0;
const zod_1 = require("zod");
exports.CreditScoreSchema = zod_1.z
    .number({
    required_error: 'Credit score is required',
    invalid_type_error: 'Credit score must be a number',
})
    .int('Credit score must be an integer')
    .min(0, 'Credit score must be at least 0')
    .max(10, 'Credit score cannot exceed 10');
exports.UpdateCreditScoreSchema = zod_1.z.object({
    score: exports.CreditScoreSchema,
    reason: zod_1.z.string().min(3, 'Reason must be at least 3 characters').max(500, 'Reason too long').trim(),
});
//# sourceMappingURL=credit.schema.js.map