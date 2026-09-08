import { Role } from './roles';

export enum Permission {
  // Member management
  VIEW_ALL_MEMBERS = 'VIEW_ALL_MEMBERS',
  VIEW_MEMBER = 'VIEW_MEMBER',
  EDIT_MEMBER = 'EDIT_MEMBER',
  DELETE_MEMBER = 'DELETE_MEMBER',
  ACTIVATE_MEMBER = 'ACTIVATE_MEMBER',

  // Volunteer management
  VIEW_ALL_VOLUNTEERS = 'VIEW_ALL_VOLUNTEERS',
  CREATE_VOLUNTEER = 'CREATE_VOLUNTEER',
  EDIT_VOLUNTEER = 'EDIT_VOLUNTEER',
  DELETE_VOLUNTEER = 'DELETE_VOLUNTEER',
  ACTIVATE_VOLUNTEER = 'ACTIVATE_VOLUNTEER',

  // Credit score
  CREDIT_SCORE_VIEW = 'CREDIT_SCORE_VIEW',
  CREDIT_SCORE_UPDATE = 'CREDIT_SCORE_UPDATE',

  // Squad management
  VIEW_ALL_SQUADS = 'VIEW_ALL_SQUADS',
  CREATE_SQUAD = 'CREATE_SQUAD',
  MANAGE_SQUAD = 'MANAGE_SQUAD',
  DELETE_SQUAD = 'DELETE_SQUAD',

  // Event management
  VIEW_EVENTS = 'VIEW_EVENTS',
  CREATE_EVENT = 'CREATE_EVENT',
  EDIT_EVENT = 'EDIT_EVENT',
  DELETE_EVENT = 'DELETE_EVENT',
  MANAGE_EVENT_PHOTOS = 'MANAGE_EVENT_PHOTOS',

  // Blog management
  VIEW_BLOGS = 'VIEW_BLOGS',
  CREATE_BLOG = 'CREATE_BLOG',
  EDIT_BLOG = 'EDIT_BLOG',
  DELETE_BLOG = 'DELETE_BLOG',
  MODERATE_BLOG = 'MODERATE_BLOG',
  CREATE_PROJECT_BLOG = 'CREATE_PROJECT_BLOG',

  // Reports
  GENERATE_REPORTS = 'GENERATE_REPORTS',
  VIEW_REPORTS = 'VIEW_REPORTS',

  // Analytics
  VIEW_ANALYTICS = 'VIEW_ANALYTICS',
  VIEW_OWN_ANALYTICS = 'VIEW_OWN_ANALYTICS',

  // Audit
  VIEW_AUDIT_LOGS = 'VIEW_AUDIT_LOGS',

  // Security / Admin
  MANAGE_SECURITY = 'MANAGE_SECURITY',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
}

/**
 * Permission matrix mapping roles to their allowed permissions.
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: Object.values(Permission), // Admin has all permissions

  [Role.VOLUNTEER]: [
    Permission.VIEW_ALL_MEMBERS,
    Permission.VIEW_MEMBER,
    Permission.CREDIT_SCORE_VIEW,
    Permission.CREDIT_SCORE_UPDATE,
    Permission.VIEW_ALL_SQUADS,
    Permission.VIEW_EVENTS,
    Permission.CREATE_EVENT,
    Permission.EDIT_EVENT,
    Permission.MANAGE_EVENT_PHOTOS,
    Permission.VIEW_BLOGS,
    Permission.CREATE_BLOG,
    Permission.EDIT_BLOG,
    Permission.CREATE_PROJECT_BLOG,
    Permission.GENERATE_REPORTS,
    Permission.VIEW_REPORTS,
    Permission.VIEW_ANALYTICS,
    Permission.VIEW_OWN_ANALYTICS,
  ],

  [Role.MEMBER]: [
    Permission.VIEW_MEMBER,
    Permission.VIEW_EVENTS,
    Permission.VIEW_BLOGS,
    Permission.CREATE_PROJECT_BLOG,
    Permission.CREATE_SQUAD,
    Permission.VIEW_OWN_ANALYTICS,
    Permission.CREDIT_SCORE_VIEW,
  ],
};

/**
 * Check if a role has a specific permission.
 */
export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
