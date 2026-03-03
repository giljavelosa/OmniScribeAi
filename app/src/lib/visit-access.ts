import type { Role, VisitVisibility, VisitShareGrant } from "@prisma/client";
import { isOfficeStaffRole, isPrivilegedAdminRole } from "@/lib/auth/role-permissions";

export type VisitActor = {
  id: string;
  role: Role | string;
  organizationId?: string | null;
};

export type VisitAccessReason =
  | "admin"
  | "owner"
  | "organization_visibility"
  | "active_grant"
  | "no_matching_policy";

export type VisitAccessResult = {
  allowed: boolean;
  reason: VisitAccessReason;
};

type VisitAuthShape = {
  userId: string;
  organizationId?: string | null;
  visibility?: VisitVisibility;
};

type GrantAuthShape = Pick<VisitShareGrant, "granteeUserId" | "revokedAt" | "permission">;

export const SHARE_AUDIT_ACTIONS = {
  setVisibility: "NOTE_SHARE_SET",
  grantAccess: "NOTE_SHARE_GRANTED",
  revokeAccess: "NOTE_SHARE_REVOKED",
  viewShared: "NOTE_SHARE_VIEWED",
  denyShared: "NOTE_SHARE_DENIED",
} as const;

export function canEditVisit(visit: VisitAuthShape, actor: VisitActor): VisitAccessResult {
  if (isOfficeStaffRole(actor.role)) return { allowed: false, reason: "no_matching_policy" };
  if (isPrivilegedAdminRole(actor.role)) return { allowed: true, reason: "admin" };
  if (visit.userId === actor.id) return { allowed: true, reason: "owner" };
  return { allowed: false, reason: "no_matching_policy" };
}

export function canManageSharing(visit: VisitAuthShape, actor: VisitActor): VisitAccessResult {
  return canEditVisit(visit, actor);
}

export function hasActiveGrant(grants: GrantAuthShape[] | undefined, actorId: string): boolean {
  if (!Array.isArray(grants) || grants.length === 0) return false;
  return grants.some((grant) => grant.granteeUserId === actorId && grant.revokedAt === null);
}

export function hasCommentGrant(grants: GrantAuthShape[] | undefined, actorId: string): boolean {
  if (!Array.isArray(grants) || grants.length === 0) return false;
  return grants.some(
    (grant) =>
      grant.granteeUserId === actorId &&
      grant.revokedAt === null &&
      grant.permission === "comment",
  );
}

export function canViewVisit(
  visit: VisitAuthShape,
  actor: VisitActor,
  grants?: GrantAuthShape[],
): VisitAccessResult {
  if (isPrivilegedAdminRole(actor.role)) return { allowed: true, reason: "admin" };
  if (visit.userId === actor.id) return { allowed: true, reason: "owner" };

  if (
    visit.visibility === "organization" &&
    Boolean(visit.organizationId) &&
    Boolean(actor.organizationId) &&
    visit.organizationId === actor.organizationId
  ) {
    return { allowed: true, reason: "organization_visibility" };
  }

  if (visit.visibility === "restricted" && hasActiveGrant(grants, actor.id)) {
    return { allowed: true, reason: "active_grant" };
  }

  return { allowed: false, reason: "no_matching_policy" };
}

export function canCommentVisit(
  visit: VisitAuthShape,
  actor: VisitActor,
  grants?: GrantAuthShape[],
): VisitAccessResult {
  if (isOfficeStaffRole(actor.role)) return { allowed: false, reason: "no_matching_policy" };
  if (isPrivilegedAdminRole(actor.role)) return { allowed: true, reason: "admin" };
  if (visit.userId === actor.id) return { allowed: true, reason: "owner" };
  if (visit.visibility === "organization" && visit.organizationId && actor.organizationId && visit.organizationId === actor.organizationId) {
    return { allowed: true, reason: "organization_visibility" };
  }
  if (visit.visibility === "restricted" && hasCommentGrant(grants, actor.id)) {
    return { allowed: true, reason: "active_grant" };
  }
  return { allowed: false, reason: "no_matching_policy" };
}

