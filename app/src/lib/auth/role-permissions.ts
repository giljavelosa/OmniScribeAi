export const ROLE = {
  ADMIN: "ADMIN",
  SUPER_ADMIN: "SUPER_ADMIN",
  ENTERPRISE_ADMIN: "ENTERPRISE_ADMIN",
  CLINICIAN: "CLINICIAN",
  SUPERVISOR: "SUPERVISOR",
  OFFICE_STAFF: "OFFICE_STAFF",
} as const;

export type AppRole = (typeof ROLE)[keyof typeof ROLE];

const PRIVILEGED_ADMIN_ROLES = new Set<string>([
  ROLE.ADMIN,
  ROLE.SUPER_ADMIN,
  ROLE.ENTERPRISE_ADMIN,
]);

export function isPrivilegedAdminRole(role: string | null | undefined): boolean {
  return Boolean(role && PRIVILEGED_ADMIN_ROLES.has(role));
}

export function isOfficeStaffRole(role: string | null | undefined): boolean {
  return role === ROLE.OFFICE_STAFF;
}
