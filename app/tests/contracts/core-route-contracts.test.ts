import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { mockAuth } = vi.hoisted(() => ({
  mockAuth: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  auth: mockAuth,
  handlers: {
    GET: vi.fn(async () => new Response(JSON.stringify({}), { status: 200 })),
    POST: vi.fn(async () => new Response(JSON.stringify({}), { status: 200 })),
  },
}));

import { GET as adminUsersGet } from "@/app/api/admin/users/route";
import { GET as templatesGet } from "@/app/api/templates/route";
import { GET as visitShareGet } from "@/app/api/visits/[id]/share/route";
import { GET as authSessionGet } from "@/app/api/auth/[...nextauth]/route";

describe("core route contracts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("admin/users unauthorized uses strict error envelope", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const response = await adminUsersGet(new NextRequest("http://localhost/api/admin/users"), undefined);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(typeof body.error.message).toBe("string");
  });

  it("templates unauthorized uses strict error envelope", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const response = await templatesGet(new NextRequest("http://localhost/api/templates"), undefined);
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(typeof body.error.message).toBe("string");
  });

  it("visits share unauthorized uses strict error envelope", async () => {
    mockAuth.mockResolvedValueOnce(null);
    const response = await visitShareGet(
      new NextRequest("http://localhost/api/visits/visit_1/share"),
      { params: Promise.resolve({ id: "visit_1" }) },
    );
    const body = await response.json();
    expect(response.status).toBe(401);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("UNAUTHORIZED");
    expect(typeof body.error.message).toBe("string");
  });

  it("auth/session route responds without server error", async () => {
    const response = await authSessionGet(new NextRequest("http://localhost/api/auth/session"));
    expect(response.status).toBeLessThan(500);
  });
});
