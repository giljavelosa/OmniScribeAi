import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const {
  mockAuth,
  mockCanEditVisit,
  mockVisitFindUnique,
  mockVisitUpdate,
} = vi.hoisted(() => ({
  mockAuth: vi.fn(),
  mockCanEditVisit: vi.fn(),
  mockVisitFindUnique: vi.fn(),
  mockVisitUpdate: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    visit: {
      findUnique: mockVisitFindUnique,
      update: mockVisitUpdate,
    },
  },
}));

vi.mock("@/lib/audit", () => ({
  auditLog: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/visit-access", () => ({
  canEditVisit: mockCanEditVisit,
  canViewVisit: vi.fn(),
  SHARE_AUDIT_ACTIONS: {
    denyShared: "DENY_SHARED",
    viewShared: "VIEW_SHARED",
  },
}));

import { PATCH as patchVisit } from "@/app/api/visits/[id]/route";
import { POST as amendVisit } from "@/app/api/visits/[id]/amend/route";

describe("visit finalization and amendment guards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAuth.mockResolvedValue({
      user: { id: "user_1", role: "CLINICIAN", organizationId: null, name: "Test User" },
    });
    mockCanEditVisit.mockReturnValue({ allowed: true, reason: "owner" });
  });

  it("blocks PATCH updates to finalized visits even with finalize payload", async () => {
    mockVisitFindUnique.mockResolvedValueOnce({
      userId: "user_1",
      organizationId: null,
      visibility: "private",
      finalizedAt: new Date("2026-03-01T00:00:00.000Z"),
      status: "FINALIZED",
    });

    const request = new NextRequest("http://localhost/api/visits/visit_1", {
      method: "PATCH",
      body: JSON.stringify({
        status: "FINALIZED",
        noteData: [{ title: "Subjective", content: "Stable note" }],
        compliance: { missing: [] },
        validation: { documentedFactCount: 4, evidenceLinkedCount: 4 },
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await patchVisit(request, { params: Promise.resolve({ id: "visit_1" }) });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toContain("Finalized visits are read-only");
    expect(mockVisitUpdate).not.toHaveBeenCalled();
  });

  it("rejects amendments when target visit is not finalized", async () => {
    mockVisitFindUnique.mockResolvedValueOnce({
      id: "visit_1",
      userId: "user_1",
      organizationId: null,
      visibility: "private",
      finalizedAt: null,
      amendments: [],
      noteData: [{ title: "Subjective", content: "Initial note" }],
    });

    const request = new NextRequest("http://localhost/api/visits/visit_1/amend", {
      method: "POST",
      body: JSON.stringify({
        reason: "Correction",
        changes: [{ section: "Subjective", oldContent: "Initial note", newContent: "Updated note" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await amendVisit(request, { params: Promise.resolve({ id: "visit_1" }) });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Only finalized notes can be amended");
  });

  it("rejects amendment changes targeting non-existent sections", async () => {
    mockVisitFindUnique.mockResolvedValueOnce({
      id: "visit_1",
      userId: "user_1",
      organizationId: null,
      visibility: "private",
      finalizedAt: new Date("2026-03-01T00:00:00.000Z"),
      amendments: [],
      noteData: [{ title: "Subjective", content: "Initial note" }],
    });

    const request = new NextRequest("http://localhost/api/visits/visit_1/amend", {
      method: "POST",
      body: JSON.stringify({
        reason: "Correction",
        changes: [{ section: "Plan", oldContent: "", newContent: "New plan text" }],
      }),
      headers: { "Content-Type": "application/json" },
    });

    const response = await amendVisit(request, { params: Promise.resolve({ id: "visit_1" }) });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toContain('Section "Plan" does not exist');
    expect(mockVisitUpdate).not.toHaveBeenCalled();
  });
});

