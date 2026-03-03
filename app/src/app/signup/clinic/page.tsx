"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClinicSignupPage() {
  const router = useRouter();
  const [orgName, setOrgName] = useState("");
  const [orgNpi, setOrgNpi] = useState("");
  const [orgAddress, setOrgAddress] = useState("");
  const [orgCity, setOrgCity] = useState("");
  const [orgState, setOrgState] = useState("");
  const [orgZip, setOrgZip] = useState("");
  const [orgPhone, setOrgPhone] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] = useState("");
  const [adminName, setAdminName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (adminPassword !== adminConfirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup/clinic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orgName,
          orgNpi: orgNpi || undefined,
          orgAddress: orgAddress || undefined,
          orgCity: orgCity || undefined,
          orgState: orgState || undefined,
          orgZip: orgZip || undefined,
          orgPhone: orgPhone || undefined,
          adminEmail,
          adminPassword,
          adminName: adminName || undefined,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      router.push("/login?registered=1");
    } catch {
      setError("Registration failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">OmniScribe</h1>
          </div>
          <p className="text-sm text-gray-500">Clinic / practice signup</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700">Organization</div>
            <div>
              <label htmlFor="orgName" className="block text-sm font-medium text-gray-700 mb-1">
                Organization name *
              </label>
              <input
                id="orgName"
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Acme Physical Therapy"
              />
            </div>
            <div>
              <label htmlFor="orgNpi" className="block text-sm font-medium text-gray-700 mb-1">
                NPI (optional)
              </label>
              <input
                id="orgNpi"
                type="text"
                value={orgNpi}
                onChange={(e) => setOrgNpi(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="orgAddress" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                id="orgAddress"
                type="text"
                value={orgAddress}
                onChange={(e) => setOrgAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="orgCity" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  id="orgCity"
                  type="text"
                  value={orgCity}
                  onChange={(e) => setOrgCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="orgState" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <input
                  id="orgState"
                  type="text"
                  value={orgState}
                  onChange={(e) => setOrgState(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="orgZip" className="block text-sm font-medium text-gray-700 mb-1">
                ZIP
              </label>
              <input
                id="orgZip"
                type="text"
                value={orgZip}
                onChange={(e) => setOrgZip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="orgPhone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="orgPhone"
                type="text"
                value={orgPhone}
                onChange={(e) => setOrgPhone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="text-sm font-semibold text-gray-700 pt-4">Admin account</div>
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                id="adminEmail"
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="admin@clinic.com"
              />
            </div>
            <div>
              <label htmlFor="adminName" className="block text-sm font-medium text-gray-700 mb-1">
                Name (optional)
              </label>
              <input
                id="adminName"
                type="text"
                value={adminName}
                onChange={(e) => setAdminName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="adminPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                id="adminPassword"
                type="password"
                required
                minLength={8}
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Min 8 characters"
              />
            </div>
            <div>
              <label htmlFor="adminConfirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password *
              </label>
              <input
                id="adminConfirmPassword"
                type="password"
                required
                value={adminConfirmPassword}
                onChange={(e) => setAdminConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating clinic..." : "Create clinic account"}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Individual clinician?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up here
          </Link>
        </p>
        <p className="text-center text-xs text-gray-400">
          HIPAA-compliant clinical documentation platform · 15-day free trial
        </p>
      </div>
    </div>
  );
}
