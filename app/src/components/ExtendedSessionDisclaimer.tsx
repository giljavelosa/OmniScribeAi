"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function ExtendedSessionDisclaimer() {
  const { data: session, update } = useSession();
  const [accepted, setAccepted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = session?.user;
  if (!user) return null;
  if (user.mustChangePassword) return null;
  if (user.extendedSessionAcknowledged) return null;

  async function handleAccept() {
    setSubmitting(true);
    try {
      const res = await fetch("/api/auth/acknowledge-disclaimer", { method: "POST" });
      if (res.ok) {
        await update({ extendedSessionAcknowledged: true }); // refresh session token
        setSubmitting(false);
        return;
      }
      setSubmitting(false);
    } catch {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Extended Session Authorization
        </h2>

        <div className="text-sm text-gray-700 space-y-4 mb-6">
          <p>
            OmniScribe provides extended session timeouts to accommodate clinical
            workflows where you cannot interact with your device during recording
            — including surgical procedures, therapy sessions, and hands-on
            patient care.
          </p>

          <p className="font-semibold">By accepting, you acknowledge:</p>

          <ol className="list-decimal list-inside space-y-3 pl-1">
            <li>
              <span className="font-semibold">DEVICE SECURITY:</span> You are
              responsible for the physical security of any device running
              OmniScribe during extended sessions, including preventing
              unauthorized access to Protected Health Information (PHI) on screen.
            </li>
            <li>
              <span className="font-semibold">LOCK WHEN UNATTENDED:</span> You
              will lock the device or close OmniScribe when leaving the clinical
              environment.
            </li>
            <li>
              <span className="font-semibold">AUTOMATIC SAFEGUARDS:</span>{" "}
              OmniScribe uses voice activity detection to automatically stop
              recording when no voice is detected for an extended period. Your
              session expires after 8 hours of inactivity. All PHI is purged from
              the browser on logout or session expiry.
            </li>
            <li>
              <span className="font-semibold">COMPLIANCE:</span> You will follow
              your organization&apos;s HIPAA policies regarding workstation use and
              physical safeguards (45 CFR &sect;164.310).
            </li>
          </ol>

          <p className="text-xs text-gray-500 mt-4">
            This acknowledgment is stored with your account and may be audited.
          </p>
        </div>

        <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-800">
            I understand and accept the terms above
          </span>
        </label>

        <button
          onClick={handleAccept}
          disabled={!accepted || submitting}
          className="w-full py-3 px-4 rounded-lg text-white font-medium transition-colors
            disabled:bg-gray-300 disabled:cursor-not-allowed
            bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {submitting ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
