export interface Squad {
  id: string;
  name: string;
  description: string;
  leaderId: string;
  leaderName?: string;
  memberIds: string[];
  members?: { id: string; username: string; displayName: string; avatarUrl?: string }[];
  project?: string;
  goal?: string;
  score: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
