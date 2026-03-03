import type { Role } from "@prisma/client";
import { isPrivilegedAdminRole } from "@/lib/auth/role-permissions";

export type PatientActor = {
  id: string;
  role: Role | string;
  organizationId?: string | null;
};

export type PatientRecord = {
  id: string;
  organizationId?: string | null;
  visits?: Array<{ userId: string }>;
};

export type PatientAccessResult = {
  allowed: boolean;
  reason: "admin" | "organization" | "visit_owner" | "no_matching_policy";
};

export function canAccessPatient(patient: PatientRecord, actor: PatientActor): PatientAccessResult {
  if (isPrivilegedAdminRole(actor.role)) return { allowed: true, reason: "admin" };

  if (
    patient.organizationId &&
    actor.organizationId &&
    patient.organizationId === actor.organizationId
  ) {
    return { allowed: true, reason: "organization" };
  }

  if (Array.isArray(patient.visits) && patient.visits.some((visit) => visit.userId === actor.id)) {
    return { allowed: true, reason: "visit_owner" };
  }

  return { allowed: false, reason: "no_matching_policy" };
}
