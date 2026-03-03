import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { requireSuperAdmin } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { appLog, scrubError } from "@/lib/logger";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function guardPage() {
  try {
    const user = await requireSuperAdmin();
    if (user.mfaEnabled) {
      redirect("/admin");
    }
  } catch (error) {
    if (isAuthzError(error)) {
      redirect("/dashboard");
    }
    appLog("error", "AdminSetupMfaPage", "Admin setup-mfa guard failed", { error: scrubError(error) });
    redirect("/dashboard");
  }
}

export default async function AdminSetupMfaPage() {
  await guardPage();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900">Enable MFA Required</h1>
          <p className="mt-2 text-sm text-gray-600">
            SUPER_ADMIN access requires MFA before opening admin routes.
          </p>
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
            <p className="text-sm text-amber-900">
              Enable MFA for your account, then return to <code>/admin</code>.
              If your security page does not support MFA enrollment yet, complete MFA setup in the
              account security flow before requesting admin access.
            </p>
            <div className="mt-4">
              <Link
                href="/settings/security"
                className="inline-flex rounded-lg bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f766e]"
              >
                Go to Security Settings
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
