import { beforeEach, describe, expect, it } from "vitest";
import { enforceApiRateLimit, evaluateCsrf } from "@/lib/request-guards";

describe("middleware security guards", () => {
  let runId = 0;

  beforeEach(() => {
    runId += 1;
  });

  describe("csrf guard", () => {
    it("rejects state-changing admin API request without Origin/Referer", () => {
      const result = evaluateCsrf({
        pathname: "/api/admin/users",
        method: "POST",
        origin: null,
        referer: null,
        host: "localhost:3000",
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toBe("missing_headers");
      }
    });

    it("rejects cross-origin mutating API request", () => {
      const result = evaluateCsrf({
        pathname: "/api/admin/users",
        method: "PATCH",
        origin: "https://evil.example",
        referer: null,
        host: "localhost:3000",
      });

      expect(result.allowed).toBe(false);
      if (!result.allowed) {
        expect(result.reason).toBe("cross_origin");
      }
    });

    it("accepts same-origin mutating API request", () => {
      const result = evaluateCsrf({
        pathname: "/api/admin/users",
        method: "DELETE",
        origin: "http://localhost:3000",
        referer: null,
        host: "localhost:3000",
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe("rate limit guard", () => {
    it("uses general API tier for admin APIs", () => {
      const id = `admin-api-${runId}`;
      for (let i = 0; i < 120; i++) {
        const allowed = enforceApiRateLimit("/api/admin/users", id);
        expect(allowed.allowed).toBe(true);
      }

      const blocked = enforceApiRateLimit("/api/admin/users", id);
      expect(blocked.allowed).toBe(false);
      expect(blocked.limit).toBe(120);
    });

    it("uses stricter AI tier for generation APIs", () => {
      const id = `ai-api-${runId}`;
      for (let i = 0; i < 30; i++) {
        const allowed = enforceApiRateLimit("/api/generate-note", id);
        expect(allowed.allowed).toBe(true);
      }

      const blocked = enforceApiRateLimit("/api/generate-note", id);
      expect(blocked.allowed).toBe(false);
      expect(blocked.limit).toBe(30);
    });
  });
});

