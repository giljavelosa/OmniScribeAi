"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes
const WARNING_MS = 2 * 60 * 1000; // Warn at 2 minutes remaining

export default function SessionTimeout() {
  const { data: session } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!session) return;

    let lastActivity = Date.now();
    let warningTimer: NodeJS.Timeout;
    let logoutTimer: NodeJS.Timeout;
    let countdownTimer: NodeJS.Timeout;

    const resetTimers = () => {
      lastActivity = Date.now();
      setShowWarning(false);
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);

      warningTimer = setTimeout(() => {
        setShowWarning(true);
        setRemaining(WARNING_MS / 1000);
        countdownTimer = setInterval(() => {
          setRemaining(prev => {
            if (prev <= 1) { clearInterval(countdownTimer); return 0; }
            return prev - 1;
          });
        }, 1000);
      }, TIMEOUT_MS - WARNING_MS);

      logoutTimer = setTimeout(() => {
        signOut({ callbackUrl: "/login" });
      }, TIMEOUT_MS);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach(e => document.addEventListener(e, resetTimers));
    resetTimers();

    return () => {
      events.forEach(e => document.removeEventListener(e, resetTimers));
      clearTimeout(warningTimer);
      clearTimeout(logoutTimer);
      clearInterval(countdownTimer);
    };
  }, [session]);

  if (!showWarning) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-yellow-50 border border-yellow-300 rounded-xl shadow-lg p-4 max-w-sm animate-fade-in">
      <div className="flex items-start gap-3">
        <span className="text-2xl">⏱️</span>
        <div>
          <p className="text-sm font-medium text-yellow-800">Session expiring soon</p>
          <p className="text-xs text-yellow-600 mt-1">
            Your session will expire in {Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")} due to inactivity.
          </p>
          <p className="text-xs text-yellow-600 mt-1">Move your mouse or press any key to stay logged in.</p>
        </div>
      </div>
    </div>
  );
}
