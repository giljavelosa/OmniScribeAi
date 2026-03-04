import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { requireSuperAdminWithMfa } from "@/lib/auth/current-user";
import { isAuthzError } from "@/lib/auth/errors";
import { prisma } from "@/lib/db";
import { appLog, scrubError } from "@/lib/logger";
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
    appLog("error", "AdminUsersPage", "Admin users page guard failed", { error: scrubError(error) });
    redirect("/dashboard");
  }
}

export default async function AdminUsersPage() {
  await guardPage();

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      isActive: true,
      mfaEnabled: true,
      organizationId: true,
      organization: { select: { name: true } },
      lastLoginAt: true,
      _count: { select: { visits: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-6xl">
          <h1 className="text-2xl font-bold text-gray-900">Admin Users</h1>
          <p className="mt-2 text-sm text-gray-500">
            SUPER_ADMIN view with tenant context and MFA status.
          </p>
          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Organization</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">MFA</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Visits</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Last Login</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{user.name || "Unnamed user"}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{user.role}</td>
                    <td className="px-4 py-3 text-gray-700">{user.organization?.name ?? "Unassigned"}</td>
                    <td className="px-4 py-3 text-gray-700">{user.mfaEnabled ? "Enabled" : "Disabled"}</td>
                    <td className="px-4 py-3 text-gray-700">{user.isActive ? "Active" : "Suspended"}</td>
                    <td className="px-4 py-3 text-gray-700">{user._count.visits}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {user.lastLoginAt ? user.lastLoginAt.toLocaleString() : "Never"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
