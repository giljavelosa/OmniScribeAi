"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { useBillingEntitlements } from "@/lib/billing/client";

function BillingContent() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "1";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { snapshot } = useBillingEntitlements();

  const handleOpenPortal = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to open billing portal");
        setLoading(false);
      }
    } catch {
      setError("Failed to open billing portal. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your subscription and payment methods.
          </p>

          {success && (
            <div className="mt-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              Payment successful. Your subscription has been updated.
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            {snapshot && (
              <div className="mb-6">
                <div className="text-sm font-medium text-gray-500">Current plan</div>
                <div className="text-lg font-semibold text-gray-900 mt-1">
                  {snapshot.planLabel}
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Notes: {snapshot.usage.monthly_notes}
                  {snapshot.quotas.monthly_notes === null
                    ? " / Unlimited"
                    : ` / ${snapshot.quotas.monthly_notes}`}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleOpenPortal}
              disabled={loading}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Opening..." : "Manage subscription"}
            </button>
            <p className="mt-3 text-xs text-gray-500">
              Update payment method, change plan, or cancel subscription.
            </p>
          </div>

          <div className="mt-6">
            <Link
              href="/pricing"
              className="text-blue-600 hover:underline text-sm font-medium"
            >
              View all plans
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AccountBillingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Sidebar />
        <main className="lg:ml-64 pt-16">
          <div className="p-6 md:p-8 max-w-2xl">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="animate-pulse h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </main>
      </div>
    }>
      <BillingContent />
    </Suspense>
  );
}
