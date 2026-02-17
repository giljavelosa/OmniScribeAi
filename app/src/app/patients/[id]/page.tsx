"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/patients/${id}`)
      .then(r => r.json())
      .then(d => { setPatient(d.patient); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Loading...</div>;
  if (!patient) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Patient not found</div>;

  const fullName = [patient.firstName, patient.lastName].filter(Boolean).join(" ") || patient.identifier;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xl font-bold">
                {fullName[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
                <p className="text-gray-500 text-sm">
                  ID: {patient.identifier}
                  {patient.dateOfBirth && ` · DOB: ${new Date(patient.dateOfBirth).toLocaleDateString()}`}
                  {patient.gender && ` · ${patient.gender}`}
                </p>
              </div>
            </div>
            <Link href={`/visit/new?patientId=${patient.id}`}
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + New Visit
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - demographics */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              {(patient.phone || patient.email || patient.addressLine1) && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="font-semibold text-gray-900 mb-3">Contact</h2>
                  <div className="space-y-1 text-sm text-gray-600">
                    {patient.phone && <p>📞 {patient.phone}</p>}
                    {patient.email && <p>✉️ {patient.email}</p>}
                    {patient.addressLine1 && <p>📍 {[patient.addressLine1, patient.city, patient.state, patient.zip].filter(Boolean).join(", ")}</p>}
                  </div>
                </div>
              )}

              {/* Medical */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Medical Information</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Allergies</h3>
                    {patient.allergies?.length ? (
                      <div className="flex flex-wrap gap-2">{patient.allergies.map((a: any) => (
                        <span key={a.id} className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                          {a.substance}{a.reaction ? ` (${a.reaction})` : ""}
                        </span>
                      ))}</div>
                    ) : <p className="text-sm text-gray-400">NKA</p>}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Medications</h3>
                    {patient.medications?.length ? (
                      <div className="space-y-1">{patient.medications.map((m: any) => (
                        <p key={m.id} className="text-sm text-gray-600">{m.name}{m.dose ? ` ${m.dose}` : ""}{m.frequency ? ` ${m.frequency}` : ""}</p>
                      ))}</div>
                    ) : <p className="text-sm text-gray-400">None</p>}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">Conditions</h3>
                    {patient.conditions?.length ? (
                      <div className="space-y-1">{patient.conditions.map((c: any) => (
                        <p key={c.id} className="text-sm text-gray-600">{c.description}{c.icdCode ? ` (${c.icdCode})` : ""}</p>
                      ))}</div>
                    ) : <p className="text-sm text-gray-400">None documented</p>}
                  </div>
                </div>
              </div>

              {/* Visit History */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Visit History</h2>
                {patient.visits?.length ? (
                  <div className="divide-y divide-gray-100">
                    {patient.visits.map((v: any) => (
                      <Link key={v.id} href={`/visit/${v.id}`} className="flex items-center justify-between py-3 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{v.frameworkId}</p>
                          <p className="text-xs text-gray-500">{new Date(v.date).toLocaleDateString()}</p>
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${v.status === "COMPLETE" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>
                          {v.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : <p className="text-sm text-gray-400">No visits yet</p>}
              </div>
            </div>

            {/* Right column - insurance & providers */}
            <div className="space-y-6">
              {/* Insurance */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Insurance</h2>
                {patient.coverages?.length ? (
                  <div className="space-y-3">{patient.coverages.map((c: any) => (
                    <div key={c.id} className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900">{c.payerName}</p>
                      {c.memberId && <p className="text-xs text-blue-700">Member: {c.memberId}</p>}
                      {c.groupNumber && <p className="text-xs text-blue-700">Group: {c.groupNumber}</p>}
                      {c.planType && <p className="text-xs text-blue-700">Type: {c.planType}</p>}
                    </div>
                  ))}</div>
                ) : <p className="text-sm text-gray-400">None on file</p>}
              </div>

              {/* Providers */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Providers</h2>
                <div className="space-y-2 text-sm">
                  {patient.pcpName && <p className="text-gray-600"><span className="text-gray-400">PCP:</span> {patient.pcpName}</p>}
                  {patient.referringProvider && <p className="text-gray-600"><span className="text-gray-400">Referring:</span> {patient.referringProvider}</p>}
                  {!patient.pcpName && !patient.referringProvider && <p className="text-gray-400">None on file</p>}
                </div>
              </div>

              {/* Emergency Contact */}
              {patient.emergencyContactName && (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <h2 className="font-semibold text-gray-900 mb-3">Emergency Contact</h2>
                  <p className="text-sm text-gray-600">{patient.emergencyContactName}</p>
                  {patient.emergencyContactPhone && <p className="text-sm text-gray-500">{patient.emergencyContactPhone}</p>}
                  {patient.emergencyContactRelation && <p className="text-xs text-gray-400">{patient.emergencyContactRelation}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
