export interface TeamMemberInfo {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  registrationNumber?: string;
  creditScore?: number;
  activityPoints?: number;
}

export interface Squad {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName?: string;
  leader?: TeamMemberInfo;
  memberIds: string[];
  members?: TeamMemberInfo[];
  memberCount?: number;
  project?: string;
  goal?: string;
  score: number;
  rank?: number;
  averageMemberScore?: number;
  status: 'ACTIVE' | 'ARCHIVED';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Team = Squad;

export interface TeamLeaderboardItem {
  id: string;
  name: string;
  description?: string;
  rank: number;
  score: number;
  memberCount: number;
  leader?: TeamMemberInfo;
  members?: TeamMemberInfo[];
  averageMemberScore: number;
  project?: string;
  goal?: string;
  status: 'ACTIVE' | 'ARCHIVED';
  performanceRating: 'EXCEPTIONAL' | 'ADVANCED' | 'PROFICIENT' | 'DEVELOPING';
  createdAt: Date;
}

export interface TeamHistoryEntry {
  id: string;
  teamId: string;
  teamName?: string;
  action: string;
  actorId: string;
  actorRole: string;
  actorName: string;
  previousValue?: any;
  newValue?: any;
  reason?: string;
  createdAt: Date;
}
