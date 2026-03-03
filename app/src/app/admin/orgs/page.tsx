import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AdminOrgsClient from "./AdminOrgsClient";
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
    appLog("error", "AdminOrgsPage", "Admin orgs page guard failed", { error: scrubError(error) });
    redirect("/dashboard");
  }
}

export default async function AdminOrgsPage() {
  await guardPage();

  const organizations = await prisma.organization.findMany({
    select: {
      id: true,
      name: true,
      npi: true,
      createdAt: true,
      _count: {
        select: {
          users: true,
          patients: true,
          visits: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-6xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
              <p className="mt-2 text-sm text-gray-500">
                SUPER_ADMIN tenant inventory across all organizations.
              </p>
            </div>
            <AdminOrgsClient />
          </div>
          <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">NPI</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Users</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Patients</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Visits</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {organizations.map((org) => (
                  <tr key={org.id}>
                    <td className="px-4 py-3 text-gray-900 font-medium">{org.name}</td>
                    <td className="px-4 py-3 text-gray-700">{org.npi || "N/A"}</td>
                    <td className="px-4 py-3 text-gray-700">{org._count.users}</td>
                    <td className="px-4 py-3 text-gray-700">{org._count.patients}</td>
                    <td className="px-4 py-3 text-gray-700">{org._count.visits}</td>
                    <td className="px-4 py-3 text-gray-700">{org.createdAt.toLocaleDateString()}</td>
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
