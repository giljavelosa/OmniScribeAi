"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

interface UserItem {
  id: string; email: string; name: string | null; role: string;
  clinicianType: string | null; credentials: string | null;
  isActive: boolean; lastLoginAt: string | null; mustChangePassword: boolean;
  _count: { visits: number };
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "", role: "CLINICIAN", clinicianType: "", credentials: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const createUser = async () => {
    setError("");
    if (!form.email || !form.password) { setError("Email and password required"); return; }
    if (form.password.length < 12) { setError("Password must be at least 12 characters"); return; }
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); return; }
    setShowCreate(false);
    setForm({ email: "", password: "", name: "", role: "CLINICIAN", clinicianType: "", credentials: "" });
    fetchUsers();
  };

  const toggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchUsers();
  };

  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8 max-w-5xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <button onClick={() => setShowCreate(!showCreate)}
              className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              + Create User
            </button>
          </div>

          {showCreate && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
              <h2 className="font-semibold mb-4">New User</h2>
              {error && <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className={inputClass} />
                <input type="text" placeholder="Password * (min 12 chars)" value={form.password} onChange={e => setForm(f => ({...f, password: e.target.value}))} className={inputClass} />
                <input type="text" placeholder="Full Name" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className={inputClass} />
                <select value={form.role} onChange={e => setForm(f => ({...f, role: e.target.value}))} className={inputClass}>
                  <option value="CLINICIAN">Clinician</option>
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERVISOR">Supervisor</option>
                </select>
                <input type="text" placeholder="Clinician Type (MD, PT, etc.)" value={form.clinicianType} onChange={e => setForm(f => ({...f, clinicianType: e.target.value}))} className={inputClass} />
                <input type="text" placeholder="Credentials (PT, DPT, etc.)" value={form.credentials} onChange={e => setForm(f => ({...f, credentials: e.target.value}))} className={inputClass} />
              </div>
              <div className="flex gap-2">
                <button onClick={createUser} className="px-4 py-2 bg-[#0d9488] text-white rounded-lg text-sm font-medium hover:bg-[#0f766e]">Create</button>
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
              </div>
              <p className="text-xs text-gray-400 mt-2">User will be required to change password on first login.</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 text-center text-gray-400">Loading...</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">User</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Role</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Type</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Visits</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Last Login</th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map(u => (
                    <tr key={u.id} className={!u.isActive ? "opacity-50" : ""}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-gray-900">{u.name || "—"}</div>
                        <div className="text-gray-400 text-xs">{u.email}</div>
                      </td>
                      <td className="px-5 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "ADMIN" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>{u.role}</span></td>
                      <td className="px-5 py-3 text-gray-600">{u.clinicianType || "—"}</td>
                      <td className="px-5 py-3 text-gray-600">{u._count.visits}</td>
                      <td className="px-5 py-3 text-gray-500 text-xs">{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                          {u.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button onClick={() => toggleActive(u.id, u.isActive)}
                          className="text-xs text-gray-400 hover:text-gray-600">
                          {u.isActive ? "Disable" : "Enable"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
