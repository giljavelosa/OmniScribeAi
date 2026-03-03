import { expect, Page } from "@playwright/test";

function sanitize(text: string): string {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[REDACTED_EMAIL]")
    .replace(/\b(?:\+?1[-.\s]?)?(?:\(?\d{3}\)?[-.\s]?){2}\d{4}\b/g, "[REDACTED_PHONE]")
    .slice(0, 220);
}

export async function logSafeFailureContext(page: Page): Promise<void> {
  const url = page.url();
  const banner = page.getByRole("alert").first();
  let bannerText = "";
  if (await banner.isVisible().catch(() => false)) {
    bannerText = sanitize((await banner.textContent()) || "");
  }

  console.error(
    JSON.stringify({
      type: "e2e_failure_context",
      url,
      bannerText,
    }),
  );
}

export async function loginWithPassword(page: Page, email: string, password: string): Promise<void> {
  await page.goto("/login");
  await expect(page.getByLabel("Email")).toBeVisible();
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign In" }).click();
}
