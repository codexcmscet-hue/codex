export enum ReportType {
  MEMBER = 'MEMBER',
  VOLUNTEER = 'VOLUNTEER',
  SQUAD = 'SQUAD',
  EVENT = 'EVENT',
  CLUB = 'CLUB',
  ACTIVITY = 'ACTIVITY',
  PERFORMANCE = 'PERFORMANCE',
}

export interface ReportFilter {
  type: ReportType;
  targetId?: string;
  startDate?: string;
  endDate?: string;
  format?: 'json' | 'pdf';
}
