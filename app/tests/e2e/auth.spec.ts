import { test, expect } from "@playwright/test";
import { loginWithPassword, logSafeFailureContext } from "./helpers";

const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD;

test.describe("write-flow smoke (non-prod with test credentials)", () => {
  test.skip(
    !TEST_USER_EMAIL || !TEST_USER_PASSWORD,
    "TEST_USER_EMAIL and TEST_USER_PASSWORD are required for write-flow smoke.",
  );

  test("login and open new visit flow", async ({ page }) => {
    try {
      await loginWithPassword(page, TEST_USER_EMAIL as string, TEST_USER_PASSWORD as string);

      await page.waitForLoadState("networkidle");
      await expect(page).toHaveURL(/\/dashboard|\/change-password|\/login/);

      if (page.url().includes("/change-password")) {
        test.skip(true, "Test user requires password change before write-flow testing.");
      }

      await page.goto("/visit/new");
      await expect(page.getByText("Patient & Provider")).toBeVisible();

      // Synthetic user input only; no PHI.
      await page.getByLabel("Patient Name").fill("Synthetic Patient Alpha");
      await page.getByRole("button", { name: "MD" }).first().click();

      // This smoke verifies route usability with human-like interaction.
      // Full audio generation is environment-dependent; assert key write-flow controls render.
      await expect(page.getByText("Documentation Template")).toBeVisible();
      await expect(page.getByText("Audio Input")).toBeVisible();
      await expect(page.getByText("Generate Clinical Note").first()).toBeVisible();
    } catch (error) {
      await logSafeFailureContext(page);
      throw error;
    }
  });
});
