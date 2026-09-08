export enum EventStatus {
  DRAFT = 'DRAFT',
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface EventImage {
  key: string;
  url: string;
  caption?: string;
  uploadedAt: Date;
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  venue: string;
  organizer: string;
  date: string;
  startTime: string;
  endTime: string;
  registrationDeadline: string;
  status: EventStatus;
  category: string;
  images: EventImage[];
  participantIds: string[];
  maxParticipants?: number;
  report?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
