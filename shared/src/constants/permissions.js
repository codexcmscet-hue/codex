"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROLE_PERMISSIONS = exports.Permission = void 0;
exports.hasPermission = hasPermission;
const roles_1 = require("./roles");
var Permission;
(function (Permission) {
    // Member management
    Permission["VIEW_ALL_MEMBERS"] = "VIEW_ALL_MEMBERS";
    Permission["VIEW_MEMBER"] = "VIEW_MEMBER";
    Permission["EDIT_MEMBER"] = "EDIT_MEMBER";
    Permission["DELETE_MEMBER"] = "DELETE_MEMBER";
    Permission["ACTIVATE_MEMBER"] = "ACTIVATE_MEMBER";
    // Volunteer management
    Permission["VIEW_ALL_VOLUNTEERS"] = "VIEW_ALL_VOLUNTEERS";
    Permission["CREATE_VOLUNTEER"] = "CREATE_VOLUNTEER";
    Permission["EDIT_VOLUNTEER"] = "EDIT_VOLUNTEER";
    Permission["DELETE_VOLUNTEER"] = "DELETE_VOLUNTEER";
    Permission["ACTIVATE_VOLUNTEER"] = "ACTIVATE_VOLUNTEER";
    // Credit score
    Permission["CREDIT_SCORE_VIEW"] = "CREDIT_SCORE_VIEW";
    Permission["CREDIT_SCORE_UPDATE"] = "CREDIT_SCORE_UPDATE";
    // Squad management
    Permission["VIEW_ALL_SQUADS"] = "VIEW_ALL_SQUADS";
    Permission["CREATE_SQUAD"] = "CREATE_SQUAD";
    Permission["MANAGE_SQUAD"] = "MANAGE_SQUAD";
    Permission["DELETE_SQUAD"] = "DELETE_SQUAD";
    // Event management
    Permission["VIEW_EVENTS"] = "VIEW_EVENTS";
    Permission["CREATE_EVENT"] = "CREATE_EVENT";
    Permission["EDIT_EVENT"] = "EDIT_EVENT";
    Permission["DELETE_EVENT"] = "DELETE_EVENT";
    Permission["MANAGE_EVENT_PHOTOS"] = "MANAGE_EVENT_PHOTOS";
    // Blog management
    Permission["VIEW_BLOGS"] = "VIEW_BLOGS";
    Permission["CREATE_BLOG"] = "CREATE_BLOG";
    Permission["EDIT_BLOG"] = "EDIT_BLOG";
    Permission["DELETE_BLOG"] = "DELETE_BLOG";
    Permission["MODERATE_BLOG"] = "MODERATE_BLOG";
    Permission["CREATE_PROJECT_BLOG"] = "CREATE_PROJECT_BLOG";
    // Reports
    Permission["GENERATE_REPORTS"] = "GENERATE_REPORTS";
    Permission["VIEW_REPORTS"] = "VIEW_REPORTS";
    // Analytics
    Permission["VIEW_ANALYTICS"] = "VIEW_ANALYTICS";
    Permission["VIEW_OWN_ANALYTICS"] = "VIEW_OWN_ANALYTICS";
    // Audit
    Permission["VIEW_AUDIT_LOGS"] = "VIEW_AUDIT_LOGS";
    // Security / Admin
    Permission["MANAGE_SECURITY"] = "MANAGE_SECURITY";
    Permission["MANAGE_SETTINGS"] = "MANAGE_SETTINGS";
})(Permission || (exports.Permission = Permission = {}));
/**
 * Permission matrix mapping roles to their allowed permissions.
 */
exports.ROLE_PERMISSIONS = {
    [roles_1.Role.ADMIN]: Object.values(Permission), // Admin has all permissions
    [roles_1.Role.VOLUNTEER]: [
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
    [roles_1.Role.MEMBER]: [
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
function hasPermission(role, permission) {
    return exports.ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}
//# sourceMappingURL=permissions.js.map