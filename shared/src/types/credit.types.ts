export interface CreditScoreHistory {
  id: string;
  memberId: string;
  previousScore: number;
  newScore: number;
  modifiedBy: string;
  modifiedByRole: string;
  modifiedByName?: string;
  reason: string;
  createdAt: Date;
}
