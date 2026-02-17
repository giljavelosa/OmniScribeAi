"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface PatientListItem {
  id: string;
  identifier: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
  phone: string | null;
  coverages: { payerName: string }[];
  _count: { visits: number };
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientListItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPatients = async (q = "") => {
    setLoading(true);
    const res = await fetch(`/api/patients?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setPatients(data.patients || []);
    setLoading(false);
  };

  useEffect(() => { fetchPatients(); }, []);

  useEffect(() => {
    const t = setTimeout(() => fetchPatients(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="text-gray-500 text-sm mt-1">Manage patient records</p>
            </div>
            <Link
              href="/patients/new"
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
              Register Patient
            </Link>
          </div>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name, MRN, or identifier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]"
            />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : patients.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                {search ? "No patients match your search" : "No patients registered yet"}
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {patients.map((p) => (
                  <Link key={p.id} href={`/patients/${p.id}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-sm font-bold">
                      {(p.firstName?.[0] || p.identifier[0] || "?").toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">
                        {p.firstName && p.lastName ? `${p.lastName}, ${p.firstName}` : p.identifier}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {p.identifier}
                        {p.dateOfBirth && ` · DOB: ${new Date(p.dateOfBirth).toLocaleDateString()}`}
                        {p.coverages[0] && ` · ${p.coverages[0].payerName}`}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{p._count.visits} visit{p._count.visits !== 1 ? "s" : ""}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
