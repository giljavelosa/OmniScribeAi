import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { ClinicianStyleEventType } from "@prisma/client";

const { mockAuth, mockVisitFindUnique, mockCanEditVisit, mockRecordEvent, mockGetProfile, mockGetEvents } =
  vi.hoisted(() => ({
    mockAuth: vi.fn(),
    mockVisitFindUnique: vi.fn(),
    mockCanEditVisit: vi.fn(),
    mockRecordEvent: vi.fn(),
    mockGetProfile: vi.fn(),
    mockGetEvents: vi.fn(),
  }));

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    visit: {
      findUnique: mockVisitFindUnique,
    },
  },
}));

vi.mock("@/lib/visit-access", () => ({
  canEditVisit: mockCanEditVisit,
}));

vi.mock("@/lib/style-learning", () => ({
  recordStyleFeedbackEvent: mockRecordEvent,
  getStyleProfileForUser: mockGetProfile,
  getRecentStyleFeedbackEvents: mockGetEvents,
}));

import { POST as postStyleEvent } from "@/app/api/style-learning/events/route";
import { GET as getStyleProfile } from "@/app/api/style-learning/profile/route";

describe("style-learning routes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects unauthenticated feedback event writes", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const response = await postStyleEvent(
      new NextRequest("http://localhost/api/style-learning/events", { method: "POST", body: JSON.stringify({}) }),
    );
    expect(response.status).toBe(401);
  });

  it("returns 400 for invalid event payload", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user_1", role: "CLINICIAN", organizationId: null } });
    const response = await postStyleEvent(
      new NextRequest("http://localhost/api/style-learning/events", {
        method: "POST",
        body: JSON.stringify({ eventType: "invalid_type" }),
      }),
    );
    expect(response.status).toBe(400);
  });

  it("enforces visit access before writing event", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user_1", role: "CLINICIAN", organizationId: null } });
    mockVisitFindUnique.mockResolvedValueOnce({
      id: "visit_1",
      userId: "user_2",
      organizationId: null,
      visibility: "private",
      templateId: null,
    });
    mockCanEditVisit.mockReturnValueOnce({ allowed: false, reason: "no_matching_policy" });

    const response = await postStyleEvent(
      new NextRequest("http://localhost/api/style-learning/events", {
        method: "POST",
        body: JSON.stringify({ eventType: ClinicianStyleEventType.section_edit, visitId: "visit_1" }),
      }),
    );

    expect(response.status).toBe(403);
    expect(mockRecordEvent).not.toHaveBeenCalled();
  });

  it("returns profile and events for authenticated user", async () => {
    mockAuth.mockResolvedValueOnce({ user: { id: "user_1" } });
    mockGetProfile.mockResolvedValueOnce({
      userId: "user_1",
      version: 2,
      profileJson: { counters: { totalEvents: 3 } },
      createdAt: new Date("2026-03-01T00:00:00.000Z"),
      updatedAt: new Date("2026-03-01T01:00:00.000Z"),
    });
    mockGetEvents.mockResolvedValueOnce([{ id: "evt_1", eventType: ClinicianStyleEventType.section_edit }]);

    const response = await getStyleProfile();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.profile.version).toBe(2);
    expect(body.recentEvents).toHaveLength(1);
  });
});

