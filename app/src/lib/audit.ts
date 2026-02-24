import { prisma } from "./db";
import { Prisma } from "@prisma/client";

export async function auditLog(params: {
  userId?: string;
  action: string;
  resource?: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}) {
  const data: Prisma.AuditLogUncheckedCreateInput = {
    action: params.action,
    resource: params.resource,
    details: params.details as Prisma.InputJsonValue,
    ipAddress: params.ipAddress,
    userAgent: params.userAgent,
  };
  if (params.userId) data.userId = params.userId;
  await prisma.auditLog.create({ data });
}
