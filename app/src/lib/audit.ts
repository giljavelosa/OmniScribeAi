import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export async function auditLog(params: {
  userId?: string;
  adminId?: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  resource?: string;
  details?: Record<string, unknown>;
  ip?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const data: Prisma.AuditLogUncheckedCreateInput = {
    adminId: params.adminId ?? params.userId,
    userId: params.userId,
    action: params.action,
    targetType: params.targetType,
    targetId: params.targetId,
    metadata: params.metadata as Prisma.InputJsonValue,
    resource: params.resource,
    details: params.details as Prisma.InputJsonValue,
    ip: params.ip ?? params.ipAddress,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  };
  await prisma.auditLog.create({ data });
}
