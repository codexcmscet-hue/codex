export enum Role {
  ADMIN = 'ADMIN',
  VOLUNTEER = 'VOLUNTEER',
  MEMBER = 'MEMBER',
}

export const ROLES = [Role.ADMIN, Role.VOLUNTEER, Role.MEMBER] as const;

export type RoleType = (typeof ROLES)[number];
