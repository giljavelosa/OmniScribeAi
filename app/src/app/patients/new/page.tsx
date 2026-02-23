"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

type RegistrationMode = "quick" | "full" | "scan";
type ScanType = "drivers_license" | "insurance_front" | "insurance_back" | "intake_form" | "referral";

export default function NewPatientPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<RegistrationMode>("quick");
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanType, setScanType] = useState<ScanType>("drivers_license");
  const [error, setError] = useState("");

  // Form fields
  const [form, setForm] = useState({
    identifier: "", firstName: "", lastName: "", middleName: "",
    dateOfBirth: "", gender: "",
    phone: "", email: "",
    addressLine1: "", addressLine2: "", city: "", state: "", zip: "",
    preferredLanguage: "en", maritalStatus: "",
    emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelation: "",
    pcpName: "", pcpPhone: "",
    referringProvider: "", referringProviderNpi: "",
  });

  // Insurance
  const [insurance, setInsurance] = useState({
    payerName: "", memberId: "", groupNumber: "", planName: "", planType: "",
  });

  const [allergies, setAllergies] = useState<{substance: string; reaction: string}[]>([]);
  const [medications, setMedications] = useState<{name: string; dose: string; frequency: string}[]>([]);

  const set = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleScan = async (file: File) => {
    setScanning(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", scanType);
      const res = await fetch("/api/ocr/scan", { method: "POST", body: fd });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);

      const d = result.data;
      // Map extracted data to form fields based on scan type
      if (scanType === "drivers_license") {
        if (d.firstName) set("firstName", d.firstName);
        if (d.lastName) set("lastName", d.lastName);
        if (d.middleName) set("middleName", d.middleName);
        if (d.dateOfBirth) set("dateOfBirth", d.dateOfBirth);
        if (d.gender) set("gender", d.gender);
        if (d.addressLine1) set("addressLine1", d.addressLine1);
        if (d.city) set("city", d.city);
        if (d.state) set("state", d.state);
        if (d.zip) set("zip", d.zip);
        // Auto-generate identifier from name
        if (d.firstName && d.lastName && !form.identifier) {
          set("identifier", `${d.lastName.toUpperCase()}-${d.firstName[0].toUpperCase()}`);
        }
        setMode("full");
      } else if (scanType === "insurance_front") {
        setInsurance(prev => ({
          ...prev,
          payerName: d.payerName || prev.payerName,
          memberId: d.memberId || prev.memberId,
          groupNumber: d.groupNumber || prev.groupNumber,
          planName: d.planName || prev.planName,
          planType: d.planType || prev.planType,
        }));
        setMode("full");
      } else if (scanType === "intake_form") {
        const dem = d.demographics || {};
        if (dem.firstName) set("firstName", dem.firstName);
        if (dem.lastName) set("lastName", dem.lastName);
        if (dem.dateOfBirth) set("dateOfBirth", dem.dateOfBirth);
        if (dem.gender) set("gender", dem.gender);
        if (dem.phone) set("phone", dem.phone);
        if (dem.email) set("email", dem.email);
        if (dem.emergencyContactName) set("emergencyContactName", dem.emergencyContactName);
        if (dem.emergencyContactPhone) set("emergencyContactPhone", dem.emergencyContactPhone);
        if (dem.emergencyContactRelation) set("emergencyContactRelation", dem.emergencyContactRelation);
        // Medical data
        const med = d.medical || {};
        if (med.allergies?.length) setAllergies(med.allergies);
        if (med.medications?.length) setMedications(med.medications);
        // Insurance
        const ins = d.insurance || {};
        if (ins.payerName) setInsurance(prev => ({ ...prev, ...ins }));
        setMode("full");
      } else if (scanType === "referral") {
        if (d.referringProvider) set("referringProvider", d.referringProvider);
        if (d.referringProviderNpi) set("referringProviderNpi", d.referringProviderNpi);
        if (d.patientName) {
          const parts = d.patientName.split(" ");
          if (parts.length >= 2) {
            set("firstName", parts[0]);
            set("lastName", parts[parts.length - 1]);
          }
        }
        if (d.dateOfBirth) set("dateOfBirth", d.dateOfBirth);
        setMode("full");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  };

  const handleSave = async () => {
    if (!form.identifier.trim()) {
      setError("Patient identifier is required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const patientId = data.patient.id;

      // Save insurance if provided
      if (insurance.payerName) {
        await fetch(`/api/patients/${patientId}/medical`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "coverage", ...insurance }),
        });
      }

      // Save allergies
      for (const a of allergies) {
        if (a.substance) {
          await fetch(`/api/patients/${patientId}/medical`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "allergy", ...a }),
          });
        }
      }

      // Save medications
      for (const m of medications) {
        if (m.name) {
          await fetch(`/api/patients/${patientId}/medical`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: "medication", ...m }),
          });
        }
      }

      router.push(`/patients/${patientId}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save");
      setSaving(false);
    }
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Register Patient</h1>
          <p className="text-gray-500 text-sm mb-6">Enter patient information manually or scan a document.</p>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
          )}

          {/* Mode selector */}
          <div className="flex gap-2 mb-6">
            {(["quick", "full", "scan"] as RegistrationMode[]).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mode === m ? "bg-[#1e3a5f] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                {m === "quick" ? "⚡ Quick ID" : m === "full" ? "📋 Full Details" : "📷 Scan Document"}
              </button>
            ))}
          </div>

          {/* Scan mode */}
          {mode === "scan" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <h2 className="font-semibold text-gray-900 mb-4">Scan Document</h2>
              <div className="flex flex-wrap gap-2 mb-4">
                {([
                  ["drivers_license", "🪪 ID / License"],
                  ["insurance_front", "💳 Insurance (Front)"],
                  ["insurance_back", "💳 Insurance (Back)"],
                  ["intake_form", "📝 Intake Form"],
                  ["referral", "📄 Referral"],
                ] as [ScanType, string][]).map(([t, label]) => (
                  <button key={t} onClick={() => setScanType(t)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${scanType === t ? "bg-[#0d9488] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                    {label}
                  </button>
                ))}
              </div>

              <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleScan(f); }} />

              <button onClick={() => fileRef.current?.click()} disabled={scanning}
                className="w-full border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-[#0d9488] hover:bg-[#0d9488]/5 transition-colors disabled:opacity-50">
                <div className="flex flex-col items-center gap-3">
                  {scanning ? (
                    <>
                      <svg className="animate-spin" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#0d9488" strokeWidth="2">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      <p className="text-sm font-medium text-[#0d9488]">Extracting data...</p>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl">📷</div>
                      <p className="text-sm font-medium text-gray-700">Take photo or upload document</p>
                      <p className="text-xs text-gray-400">Camera will open on mobile devices</p>
                    </>
                  )}
                </div>
              </button>
            </div>
          )}

          {/* Quick mode - just identifier */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">Patient Identifier <span className="text-red-500">*</span></h2>
            <p className="text-xs text-gray-500 mb-3">Required. Use initials, MRN, or any internal reference. This is the minimum needed to create a record.</p>
            <input type="text" value={form.identifier} onChange={(e) => set("identifier", e.target.value)}
              placeholder="e.g., JS-1234, MRN-00452, or J.S." className={inputClass} />
          </div>

          {/* Full mode - demographics */}
          {(mode === "full" || mode === "scan") && (
            <>
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Demographics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className={labelClass}>First Name</label><input type="text" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Middle Name</label><input type="text" value={form.middleName} onChange={(e) => set("middleName", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Last Name</label><input type="text" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Date of Birth</label><input type="date" value={form.dateOfBirth} onChange={(e) => set("dateOfBirth", e.target.value)} className={inputClass} /></div>
                  <div>
                    <label className={labelClass}>Gender</label>
                    <select value={form.gender} onChange={(e) => set("gender", e.target.value)} className={inputClass}>
                      <option value="">Select...</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                      <option value="UNKNOWN">Prefer not to say</option>
                    </select>
                  </div>
                  <div><label className={labelClass}>Preferred Language</label><input type="text" value={form.preferredLanguage} onChange={(e) => set("preferredLanguage", e.target.value)} className={inputClass} /></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Phone</label><input type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Email</label><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} /></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="md:col-span-2"><label className={labelClass}>Address</label><input type="text" value={form.addressLine1} onChange={(e) => set("addressLine1", e.target.value)} placeholder="Street address" className={inputClass} /></div>
                  <div><label className={labelClass}>City</label><input type="text" value={form.city} onChange={(e) => set("city", e.target.value)} className={inputClass} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><label className={labelClass}>State</label><input type="text" value={form.state} onChange={(e) => set("state", e.target.value)} className={inputClass} /></div>
                    <div><label className={labelClass}>ZIP</label><input type="text" value={form.zip} onChange={(e) => set("zip", e.target.value)} className={inputClass} /></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Emergency Contact</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className={labelClass}>Name</label><input type="text" value={form.emergencyContactName} onChange={(e) => set("emergencyContactName", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Phone</label><input type="tel" value={form.emergencyContactPhone} onChange={(e) => set("emergencyContactPhone", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Relationship</label><input type="text" value={form.emergencyContactRelation} onChange={(e) => set("emergencyContactRelation", e.target.value)} className={inputClass} /></div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Insurance</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Payer</label><input type="text" value={insurance.payerName} onChange={(e) => setInsurance(p => ({...p, payerName: e.target.value}))} placeholder="e.g., Blue Cross Blue Shield" className={inputClass} /></div>
                  <div><label className={labelClass}>Member ID</label><input type="text" value={insurance.memberId} onChange={(e) => setInsurance(p => ({...p, memberId: e.target.value}))} className={inputClass} /></div>
                  <div><label className={labelClass}>Group #</label><input type="text" value={insurance.groupNumber} onChange={(e) => setInsurance(p => ({...p, groupNumber: e.target.value}))} className={inputClass} /></div>
                  <div>
                    <label className={labelClass}>Plan Type</label>
                    <select value={insurance.planType} onChange={(e) => setInsurance(p => ({...p, planType: e.target.value}))} className={inputClass}>
                      <option value="">Select...</option>
                      <option>HMO</option><option>PPO</option><option>EPO</option><option>POS</option>
                      <option>Medicare</option><option>Medicaid</option><option>Tricare</option><option>Workers Comp</option><option>Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <h2 className="font-semibold text-gray-900 mb-4">Providers</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Primary Care Provider</label><input type="text" value={form.pcpName} onChange={(e) => set("pcpName", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>PCP Phone</label><input type="tel" value={form.pcpPhone} onChange={(e) => set("pcpPhone", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Referring Provider</label><input type="text" value={form.referringProvider} onChange={(e) => set("referringProvider", e.target.value)} className={inputClass} /></div>
                  <div><label className={labelClass}>Referring Provider NPI</label><input type="text" value={form.referringProviderNpi} onChange={(e) => set("referringProviderNpi", e.target.value)} className={inputClass} /></div>
                </div>
              </div>

              {/* Allergies */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Allergies</h2>
                  <button onClick={() => setAllergies(a => [...a, {substance: "", reaction: ""}])}
                    className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium">+ Add</button>
                </div>
                {allergies.length === 0 && <p className="text-sm text-gray-400">No known allergies (NKA)</p>}
                {allergies.map((a, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Substance" value={a.substance}
                      onChange={(e) => { const n = [...allergies]; n[i].substance = e.target.value; setAllergies(n); }}
                      className={`${inputClass} flex-1`} />
                    <input type="text" placeholder="Reaction" value={a.reaction}
                      onChange={(e) => { const n = [...allergies]; n[i].reaction = e.target.value; setAllergies(n); }}
                      className={`${inputClass} flex-1`} />
                    <button onClick={() => setAllergies(a => a.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 px-2">✕</button>
                  </div>
                ))}
              </div>

              {/* Medications */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900">Current Medications</h2>
                  <button onClick={() => setMedications(m => [...m, {name: "", dose: "", frequency: ""}])}
                    className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium">+ Add</button>
                </div>
                {medications.length === 0 && <p className="text-sm text-gray-400">No current medications</p>}
                {medications.map((m, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input type="text" placeholder="Medication" value={m.name}
                      onChange={(e) => { const n = [...medications]; n[i].name = e.target.value; setMedications(n); }}
                      className={`${inputClass} flex-[2]`} />
                    <input type="text" placeholder="Dose" value={m.dose}
                      onChange={(e) => { const n = [...medications]; n[i].dose = e.target.value; setMedications(n); }}
                      className={`${inputClass} flex-1`} />
                    <input type="text" placeholder="Frequency" value={m.frequency}
                      onChange={(e) => { const n = [...medications]; n[i].frequency = e.target.value; setMedications(n); }}
                      className={`${inputClass} flex-1`} />
                    <button onClick={() => setMedications(m => m.filter((_, j) => j !== i))}
                      className="text-red-400 hover:text-red-600 px-2">✕</button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Save */}
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving || !form.identifier.trim()}
              className="px-6 py-2.5 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-[#0f766e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {saving ? "Saving..." : "Register Patient"}
            </button>
            <button onClick={() => router.push("/patients")}
              className="px-6 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
