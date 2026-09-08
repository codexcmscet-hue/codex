export interface VolunteerProfile {
  id: string;
  authUserId: string;
  username: string;
  email: string;
  phone?: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  department?: string;
  assignedMemberIds: string[];
  isActive: boolean;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
