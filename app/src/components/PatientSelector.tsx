"use client";

import { useState, useEffect, useRef } from "react";

interface PatientOption {
  id: string;
  identifier: string;
  firstName: string | null;
  lastName: string | null;
  dateOfBirth: string | null;
}

interface Props {
  onSelect: (patient: PatientOption | null) => void;
  selectedId?: string;
}

export default function PatientSelector({ onSelect, selectedId }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<PatientOption[]>([]);
  const [selected, setSelected] = useState<PatientOption | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Search patients
  useEffect(() => {
    if (query.length < 1) { setResults([]); return; }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/patients?q=${encodeURIComponent(query)}&limit=10`);
      const data = await res.json();
      setResults(data.patients || []);
      setOpen(true);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  // Load pre-selected patient
  useEffect(() => {
    if (selectedId && !selected) {
      fetch(`/api/patients/${selectedId}`)
        .then(r => r.json())
        .then(d => {
          if (d.patient) {
            const p = d.patient;
            setSelected(p);
            onSelect(p);
          }
        });
    }
  }, [selectedId]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (p: PatientOption) => {
    setSelected(p);
    onSelect(p);
    setOpen(false);
    setQuery("");
  };

  const clear = () => {
    setSelected(null);
    onSelect(null);
    setQuery("");
  };

  if (selected) {
    const name = [selected.firstName, selected.lastName].filter(Boolean).join(" ") || selected.identifier;
    return (
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <div className="w-8 h-8 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white text-xs font-bold">
          {name[0]?.toUpperCase() || "?"}
        </div>
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-900">{name}</div>
          <div className="text-xs text-gray-500">ID: {selected.identifier}{selected.dateOfBirth ? ` · DOB: ${new Date(selected.dateOfBirth).toLocaleDateString()}` : ""}</div>
        </div>
        <button onClick={clear} className="text-gray-400 hover:text-gray-600 text-sm">Change</button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search patient by name, ID, or MRN..."
        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0d9488]/30 focus:border-[#0d9488]"
      />
      {open && results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
          {results.map((p) => {
            const name = [p.firstName, p.lastName].filter(Boolean).join(" ") || p.identifier;
            return (
              <button key={p.id} onClick={() => pick(p)}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0">
                <div className="text-sm font-medium text-gray-900">{name}</div>
                <div className="text-xs text-gray-500">ID: {p.identifier}{p.dateOfBirth ? ` · DOB: ${new Date(p.dateOfBirth).toLocaleDateString()}` : ""}</div>
              </button>
            );
          })}
        </div>
      )}
      {open && results.length === 0 && query.length >= 2 && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center">
          <p className="text-sm text-gray-400 mb-2">No patients found</p>
          <a href={`/patients/new?identifier=${encodeURIComponent(query)}`}
            className="text-sm text-[#0d9488] hover:text-[#0f766e] font-medium">
            + Register new patient
          </a>
        </div>
      )}
    </div>
  );
}
