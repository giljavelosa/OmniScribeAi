import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { appLog, scrubError } from "@/lib/logger";
import Link from "next/link";
import { redirect } from "next/navigation";

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
    appLog("error", "AdminDashboardPage", "Admin dashboard guard failed", { error: scrubError(error) });
    redirect("/dashboard");
  }
}

export default async function AdminDashboardPage() {
  await guardPage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-4xl">
          <h1 className="text-2xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-500">
            CEO/Site Owner controls with mandatory MFA and audit logging.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <Link
              href="/admin/users"
              className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 hover:border-[#0d9488]"
            >
              <h2 className="text-lg font-semibold">Users</h2>
              <p className="mt-1 text-sm text-gray-500">
                View all users and manage role or active status.
              </p>
            </Link>
            <Link
              href="/admin/orgs"
              className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 hover:border-[#0d9488]"
            >
              <h2 className="text-lg font-semibold">Organizations</h2>
              <p className="mt-1 text-sm text-gray-500">
                View cross-tenant organization inventory and counts.
              </p>
            </Link>
            <Link
              href="/admin/billing"
              className="rounded-xl border border-gray-200 bg-white p-5 text-gray-900 hover:border-[#0d9488]"
            >
              <h2 className="text-lg font-semibold">Billing</h2>
              <p className="mt-1 text-sm text-gray-500">
                Edit prices, discount codes, and global config.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
