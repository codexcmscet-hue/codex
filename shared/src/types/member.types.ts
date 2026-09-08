export interface MemberProfile {
  id: string;
  authUserId: string;
  username: string;
  email: string;
  phone: string;
  registrationNumber: string;
  displayName: string;
  avatarUrl?: string;
  githubUrl?: string;
  bio?: string;
  squadId?: string;
  squadName?: string;
  isActive: boolean;
  creditScore: number;
  activitiesCompleted: number;
  eventsParticipated: number;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberPerformance {
  creditScore: number;
  activityPoints: number;
  eventsParticipated: number;
  completedActivities: number;
  projectCount: number;
  performanceTrend: { date: string; score: number; points: number }[];
  rank?: number;
}
