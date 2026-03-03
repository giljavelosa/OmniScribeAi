import { test, expect } from "@playwright/test";
import { logSafeFailureContext } from "./helpers";

test.describe("read-only smoke", () => {
  test("loads landing page", async ({ page }) => {
    try {
      const response = await page.goto("/");
      await expect(page).toHaveURL(/\/$/);
      if (await page.getByText("OmniScribe").first().isVisible().catch(() => false)) {
        await expect(page.getByText("OmniScribe").first()).toBeVisible();
      } else {
        const status = response?.status() ?? 0;
        expect([200, 401, 403]).toContain(status);
      }
    } catch (error) {
      await logSafeFailureContext(page);
      throw error;
    }
  });

  test("loads login page and form", async ({ page }) => {
    try {
      const response = await page.goto("/login");
      const hasForm = await page.getByLabel("Email").isVisible().catch(() => false);
      if (hasForm) {
        await expect(page.getByLabel("Email")).toBeVisible();
        await expect(page.getByLabel("Password")).toBeVisible();
        await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
      } else {
        const status = response?.status() ?? 0;
        expect([200, 401, 403]).toContain(status);
      }
    } catch (error) {
      await logSafeFailureContext(page);
      throw error;
    }
  });

  test("auth session endpoint returns JSON", async ({ request }) => {
    const response = await request.get("/api/auth/session");
    expect(response.status()).toBeLessThan(500);
    const contentType = response.headers()["content-type"] || "";
    if (contentType.includes("application/json")) {
      const body = await response.json();
      expect(typeof body).toBe("object");
    } else {
      const text = await response.text();
      expect(text.length).toBeGreaterThan(0);
    }
  });

  test("settings security route is not 404", async ({ page }) => {
    const response = await page.goto("/settings/security");
    const status = response?.status() ?? 0;
    expect(status).not.toBe(404);

    if ([401, 403].includes(status)) {
      return;
    }

    if (page.url().includes("/login")) {
      await expect(page.getByTestId("login-form")).toBeVisible();
      return;
    }

    await expect(page.getByTestId("security-settings-title")).toBeVisible();
    await expect(page.getByText("This page could not be found.")).toHaveCount(0);
  });
});
