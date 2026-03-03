import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
import Link from "next/link";
import { redirect } from "next/navigation";
import { BillingAdminClient } from "./BillingAdminClient";

export const dynamic = "force-dynamic";

async function guardPage() {
  try {
    await requireSuperAdminWithMfa();
  } catch (error) {
    if (isAuthzError(error) && error.code === "MFA_REQUIRED") {
      redirect("/admin/setup-mfa");
    }
    if (isAuthzError(error)) {
      redirect("/dashboard");
    }
    appLog("error", "AdminBillingPage", "Admin billing page guard failed", {
      error: scrubError(error),
    });
    redirect("/dashboard");
  }
}

export default async function AdminBillingPage() {
  await guardPage();

  const [prices, discounts, configRows] = await Promise.all([
    prisma.priceConfig.findMany({
      orderBy: [{ planCode: "asc" }, { billingInterval: "asc" }],
    }),
    prisma.discountCode.findMany({
      orderBy: { createdAt: "desc" },
    }).then((rows) =>
      rows.map((r) => ({
        ...r,
        validFrom: r.validFrom.toISOString(),
        validTo: r.validTo?.toISOString() ?? null,
      })),
    ),
    prisma.billingConfig.findMany({
      where: {
        key: {
          in: [
            "annual_discount_percent",
            "referral_discount_percent",
            "post_trial_discount_percent",
            "post_trial_discount_months",
          ],
        },
      },
    }),
  ]);

  const config: Record<string, string> = {};
  for (const c of configRows) {
    config[c.key] = c.value;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
              <p className="mt-2 text-sm text-gray-500">
                Edit prices, discount codes, and global config. No code changes required.
              </p>
            </div>
            <Link
              href="/admin"
              className="text-sm text-[#0d9488] hover:underline"
            >
              Back to Admin
            </Link>
          </div>

          <BillingAdminClient
            initialPrices={prices}
            initialDiscounts={discounts}
            initialConfig={config}
          />
        </div>
      </main>
    </div>
  );
}
