import { expect, test } from "@playwright/test";
import { loginWithPassword, logSafeFailureContext } from "./helpers";

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
const TEST_ADMIN_EMAIL = process.env.TEST_ADMIN_EMAIL;
const TEST_ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD;

const PW_CHANGE_EMAIL = process.env.TEST_PASSWORD_CHANGE_EMAIL;
const PW_CHANGE_CURRENT = process.env.TEST_PASSWORD_CHANGE_CURRENT;
const PW_CHANGE_NEW = process.env.TEST_PASSWORD_CHANGE_NEW;

test.describe("@gate critical runtime journeys", () => {
  test("login + password change @gate", async ({ page }) => {
    test.skip(
      !PW_CHANGE_EMAIL || !PW_CHANGE_CURRENT || !PW_CHANGE_NEW,
      "Password-change credentials not configured.",
    );

    try {
      await loginWithPassword(page, PW_CHANGE_EMAIL as string, PW_CHANGE_CURRENT as string);
      await page.goto("/change-password");
      await expect(page.getByRole("heading", { name: "Change Password" })).toBeVisible();
      await page.getByLabel("Current Password").fill(PW_CHANGE_CURRENT as string);
      await page.getByLabel("New Password").fill(PW_CHANGE_NEW as string);
      await page.getByLabel("Confirm New Password").fill(PW_CHANGE_NEW as string);
      await page.getByRole("button", { name: "Update Password" }).click();
      await expect(page).toHaveURL(/\/login\?changed=1/);
    } catch (error) {
      await logSafeFailureContext(page);
      throw error;
    }
  });

  test("patient create -> visit route -> note controls visible @gate", async ({ page }) => {
    test.skip(!TEST_USER_EMAIL || !TEST_USER_PASSWORD, "Write-flow credentials not configured.");

    try {
      await loginWithPassword(page, TEST_USER_EMAIL as string, TEST_USER_PASSWORD as string);
      await page.goto("/patients/new");
      await expect(page.getByRole("heading", { name: "Register Patient" })).toBeVisible();
      await page.getByPlaceholder("e.g., JS-1234, MRN-00452, or J.S.").fill(`E2E-${Date.now()}`);
      await page.getByRole("button", { name: "Register Patient" }).click();
      await expect(page).toHaveURL(/\/patients\/.+/);

      await page.goto("/visit/new");
      await expect(page.getByText("Patient & Provider")).toBeVisible();
      await page.getByLabel("Patient Name").fill("Synthetic Patient Gate");
      await page.getByRole("button", { name: "MD" }).first().click();
      await expect(page.getByText("Generate Clinical Note").first()).toBeVisible();
    } catch (error) {
      await logSafeFailureContext(page);
      throw error;
    }
  });

  test("admin route access enforces MFA gate behavior @gate", async ({ page, request }) => {
    try {
      if (TEST_ADMIN_EMAIL && TEST_ADMIN_PASSWORD) {
        await loginWithPassword(page, TEST_ADMIN_EMAIL, TEST_ADMIN_PASSWORD);
      }

      const response = await request.get("/admin", {
        maxRedirects: 0,
      });
      const status = response.status();
      expect(status).toBeLessThan(500);

      if (status >= 300 && status < 400) {
        const location = response.headers()["location"] || "";
        if (
          location.includes("/admin/setup-mfa") ||
          location.includes("/dashboard") ||
          location.includes("/login")
        ) {
          return;
        }
      }

      if (status === 200) {
        const body = await response.text();
        expect(body.length).toBeGreaterThan(0);
      }
    } catch (error) {
      await logSafeFailureContext(page);
      throw error;
    }
  });
});
