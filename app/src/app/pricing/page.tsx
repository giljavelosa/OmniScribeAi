"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

type PlanCode = "starter" | "professional" | "practice";
type BillingInterval = "monthly" | "annual";

type PlanData = {
  monthlyCents: number;
  annualCents: number;
  label: string;
};

const PLAN_ORDER: PlanCode[] = ["starter", "professional", "practice"];
const QUOTAS: Record<PlanCode, { notes: number; audio: number }> = {
  starter: { notes: 120, audio: 600 },
  professional: { notes: 500, audio: 3000 },
  practice: { notes: 3000, audio: 12000 },
};

function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}`;
}

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [plans, setPlans] = useState<Record<string, PlanData>>({});
  const [loading, setLoading] = useState(true);
  const [interval, setInterval] = useState<BillingInterval>("monthly");
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/billing/pricing")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.plans) setPlans(data.plans);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSubscribe = async (planCode: PlanCode) => {
    if (!session?.user) return;
    setCheckoutLoading(planCode);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planCode,
          billingInterval: interval,
        }),
      });
      const data = await res.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutLoading(null);
      }
    } catch {
      setCheckoutLoading(null);
    }
  };

  const isLoggedIn = status === "authenticated" && !!session?.user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">OmniScribe</h1>
          </div>
          <p className="text-lg text-gray-600">AI-powered clinical documentation</p>
          <p className="text-sm text-gray-500 mt-2">15-day free trial on all paid plans</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          <button
            type="button"
            onClick={() => setInterval("monthly")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              interval === "monthly"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setInterval("annual")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              interval === "annual"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            Annual (save 17%)
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 py-12">Loading plans...</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {PLAN_ORDER.map((code) => {
              const plan = plans[code];
              if (!plan) return null;
              const price =
                interval === "monthly" ? plan.monthlyCents : plan.annualCents;
              const quota = QUOTAS[code];
              const isPopular = code === "professional";

              return (
                <div
                  key={code}
                  className={`rounded-xl border-2 bg-white p-6 flex flex-col ${
                    isPopular ? "border-blue-500 shadow-lg" : "border-gray-200"
                  }`}
                >
                  {isPopular && (
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2">
                      Most popular
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">{plan.label}</h2>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {formatPrice(price)}
                    </span>
                    <span className="text-gray-500 ml-1">
                      /{interval === "annual" ? "year" : "month"}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li>{quota.notes} notes/month</li>
                    <li>{quota.audio} audio minutes/month</li>
                  </ul>
                  <div className="mt-6 flex-1 flex flex-col justify-end">
                    {isLoggedIn ? (
                      <button
                        type="button"
                        onClick={() => handleSubscribe(code)}
                        disabled={!!checkoutLoading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {checkoutLoading === code
                          ? "Redirecting..."
                          : "Subscribe"}
                      </button>
                    ) : (
                      <Link
                        href="/signup"
                        className="block w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Get started
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <p className="text-center text-sm text-gray-500 mt-12">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          HIPAA-compliant clinical documentation platform
        </p>
      </div>
    </div>
  );
}
