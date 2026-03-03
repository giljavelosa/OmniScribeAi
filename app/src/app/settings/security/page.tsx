import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

const NEXT_PATH = "/settings/security";

export const dynamic = "force-dynamic";

export default async function SettingsSecurityPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/login?next=${encodeURIComponent(NEXT_PATH)}`);
  }

  const role = (session.user as { role?: string }).role ?? "CLINICIAN";
  const canAccessAdminMfa = role === "SUPER_ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-4xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900" data-testid="security-settings-title">
              Security Settings
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your account security controls. No clinical note content is shown here.
            </p>
          </div>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Change password</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update your password and rotate credentials when needed.
            </p>
            <Link
              href="/change-password"
              className="mt-4 inline-flex rounded-lg bg-[#0d9488] px-4 py-2 text-sm font-medium text-white hover:bg-[#0f766e]"
            >
              Open password settings
            </Link>
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Two-factor authentication (2FA)</h2>
            <p className="mt-1 text-sm text-gray-500">
              Additional verification is enforced for super admin access.
            </p>
            {canAccessAdminMfa ? (
              <Link
                href="/admin/setup-mfa"
                className="mt-4 inline-flex rounded-lg border border-[#0d9488] px-4 py-2 text-sm font-medium text-[#0d9488] hover:bg-[#0d9488]/5"
              >
                Configure MFA
              </Link>
            ) : (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                Not authorized for admin MFA setup on this account.
              </div>
            )}
          </section>

          <section className="rounded-xl border border-gray-200 bg-white p-5">
            <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
            <p className="mt-1 text-sm text-gray-500">
              Session management controls are available in a future update.
            </p>
            <button
              type="button"
              disabled
              className="mt-4 inline-flex cursor-not-allowed rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-400"
            >
              Revoke other sessions (coming soon)
            </button>
          </section>
        </div>
      </main>
    </div>
  );
}
