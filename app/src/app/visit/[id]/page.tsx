'use client';
import { fetchNoteSSE } from '@/lib/sse-fetch';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NoteEditor from '@/components/NoteEditor';
import { mockVisits } from '@/lib/mock-data';
import { getFrameworkById, getDomainColor, getDomainLabel } from '@/lib/frameworks';
import { NoteSection } from "@/lib/types";
import MiniRecorder from '@/components/MiniRecorder';
import ClinicalSynthesis from '@/components/ClinicalSynthesis';

interface ClinicalSynthesis {
  clinical_impression: string;
  problem_list: string[];
  severity_assessment: string;
  rehab_potential: string;
  recommended_focus: string[];
  reasoning_notes: string;
}

interface ComplianceRequirement {
  item: string;
  section: string;
  category: 'critical' | 'required' | 'recommended';
  regulation: string;
  description: string;
}

interface ComplianceResult {
  score: number;
  totalRequired: number;
  documented: number;
  missing: ComplianceRequirement[];
  documented_items: ComplianceRequirement[];
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  summary: string;
}

interface VisitData {
  id: string;
  patientName: string;
  providerType: string;
  frameworkId: string;
  transcript: string;
  transcriptSource: string;
  transcriptDuration: number;
  transcriptConfidence: number;
  parsedData?: { title: string; content: string }[];
  clinicalNote?: { title: string; content: string }[];
  note?: { title: string; content: string }[];
  clinicalSynthesis?: ClinicalSynthesis;
  compliance?: ComplianceResult;
  summary: string;
  extractedFacts?: string;
  auditClean?: boolean;
  auditIssues?: string[];
  source: string;
  generationTime: number;
  createdAt: string;
}

export default function VisitDetailPage() {
  const params = useParams();
  const visitId = params.id as string;
  const [tab, setTab] = useState<'clinicalNote' | 'parsedData' | 'reasoning' | 'transcript' | 'facts'>('clinicalNote');
  const [speakersSwapped, setSpeakersSwapped] = useState(false);
  const [speakerLabels, setSpeakerLabels] = useState<Record<string, string>>({ '1': 'Speaker 1', '2': 'Speaker 2' });

  // Format transcript with speaker labels
  const formatTranscript = (text: string) => {
    if (!text) return text;
    let result = text;
    if (speakersSwapped) {
      // Swap Speaker 1 <-> Speaker 2
      result = result.replace(/\*\*Speaker 1:\*\*/g, '@@TEMP_S2@@');
      result = result.replace(/\*\*Speaker 2:\*\*/g, '@@TEMP_S1@@');
      result = result.replace(/@@TEMP_S1@@/g, `**${speakerLabels['1']}:**`);
      result = result.replace(/@@TEMP_S2@@/g, `**${speakerLabels['2']}:**`);
    } else {
      result = result.replace(/\*\*Speaker 1:\*\*/g, `**${speakerLabels['1']}:**`);
      result = result.replace(/\*\*Speaker 2:\*\*/g, `**${speakerLabels['2']}:**`);
    }
    return result;
  };

  const handleSwapSpeakers = () => {
    setSpeakersSwapped(!speakersSwapped);
    // Also swap the labels
    setSpeakerLabels(prev => ({ '1': prev['2'], '2': prev['1'] }));
  };

  const handleLabelSpeaker = (speakerId: string, label: string) => {
    setSpeakerLabels(prev => ({ ...prev, [speakerId]: label }));
  };
  const [saveStatus, setSaveStatus] = useState('Saved just now');
  const [visitData, setVisitData] = useState<VisitData | null>(null);
  const [loading, setLoading] = useState(true);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const fileInputRef = useState<HTMLInputElement | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [lastRegenTime, setLastRegenTime] = useState<string | null>(null);
  const [amendModalOpen, setAmendModalOpen] = useState(false);
  const [amendReason, setAmendReason] = useState('');
  const [amendingSections, setAmendingSections] = useState<Record<string, string>>({});
  const [submittingAmendment, setSubmittingAmendment] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(`omniscribe-visit-${visitId}`);
    if (stored) {
      try { setVisitData(JSON.parse(stored)); } catch { /* */ }
    }
    setLoading(false);
  }, [visitId]);

  const mockVisit = mockVisits.find(v => v.id === visitId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50"><Header /><Sidebar />
        <main className="lg:ml-64 pt-16"><div className="p-8 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-[#0d9488] border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-500">Loading visit...</p>
        </div></main>
      </div>
    );
  }

  if (!visitData && !mockVisit) {
    return (
      <div className="min-h-screen bg-gray-50"><Header /><Sidebar />
        <main className="lg:ml-64 pt-16"><div className="p-8 text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Visit not found</h1>
          <Link href="/dashboard" className="text-[#0d9488] hover:underline text-sm">Back to dashboard</Link>
        </div></main>
      </div>
    );
  }

  const frameworkId = visitData?.frameworkId || mockVisit?.frameworkId || '';
  const framework = getFrameworkById(frameworkId);
  const patientName = visitData?.patientName || mockVisit?.patientName || 'Unknown';
  const providerType = visitData?.providerType || mockVisit?.providerType || '';
  const transcript = visitData?.transcript || mockVisit?.transcript || '';
  
  // Support both old format (note) and new format (parsedData + clinicalNote)
  const rawParsedData = visitData?.parsedData || visitData?.note || mockVisit?.note || [];
  const parsedData = rawParsedData.map((s: any, i: number) => ({ id: s.id || `section-${i}`, title: s.title, content: s.content, feedback: s.feedback || null }));
  
  const rawClinicalNote = visitData?.clinicalNote || visitData?.note || mockVisit?.note || [];
  const clinicalNote = rawClinicalNote.map((s: any, i: number) => ({ id: s.id || `cn-${i}`, title: s.title, content: s.content, feedback: s.feedback || null }));
  
  const summary = visitData?.summary || mockVisit?.summary || '';
  const duration = visitData?.transcriptDuration || mockVisit?.duration || 0;
  const createdAt = visitData?.createdAt || mockVisit?.date || '';
  const confidence = visitData?.transcriptConfidence;
  const extractedFacts = visitData?.extractedFacts;
  const clinicalSynthesis = visitData?.clinicalSynthesis;
  const compliance = visitData?.compliance;
  const auditClean = visitData?.auditClean;
  const auditIssues = visitData?.auditIssues;
  const generationTime = visitData?.generationTime;
  const transcriptSource = visitData?.transcriptSource;

  const handleUpdate = (updatedSections?: NoteSection[]) => {
    setSaveStatus('Saving...');
    if (visitData && updatedSections) {
      const key = tab === 'clinicalNote' ? 'clinicalNote' : 'parsedData';
      const updatedVisit = { ...visitData, [key]: updatedSections };
      setVisitData(updatedVisit);
      localStorage.setItem(`omniscribe-visit-${visitId}`, JSON.stringify(updatedVisit));
      if (!visitId.startsWith('mock-')) {
        fetch(`/api/visits/${visitId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ noteData: updatedSections, status: 'COMPLETE' }),
        }).catch(console.error);
      }
    }
    setTimeout(() => setSaveStatus('Saved'), 500);
  };

  const handleFinalize = async () => {
    if (!visitData) return;
    const confirmed = window.confirm('Finalize this note? It will be locked and timestamped as the official record. After finalization, changes require a formal amendment.');
    if (!confirmed) return;
    const now = new Date().toISOString();
    const finalizedVisit = {
      ...visitData,
      finalized: true,
      finalizedAt: now,
    };
    setVisitData(finalizedVisit);
    localStorage.setItem(`omniscribe-visit-${visitId}`, JSON.stringify(finalizedVisit));
    if (!visitId.startsWith('mock-')) {
      await fetch(`/api/visits/${visitId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'FINALIZED', noteData: finalizedVisit.clinicalNote || finalizedVisit.note, finalizedAt: now }),
      }).catch(console.error);
    }
    setSaveStatus('Finalized');
  };

  const handleOpenAmend = () => {
    // Pre-populate amendingSections with current note content
    const sections = visitData?.clinicalNote || visitData?.note || [];
    const sectionMap: Record<string, string> = {};
    for (const s of sections as any[]) {
      sectionMap[s.title] = s.content;
    }
    setAmendingSections(sectionMap);
    setAmendReason('');
    setAmendModalOpen(true);
  };

  const handleSubmitAmendment = async () => {
    if (!visitData || !amendReason.trim()) return;
    setSubmittingAmendment(true);
    try {
      const originalSections = visitData.clinicalNote || visitData.note || [];
      const changes: {section: string; oldContent: string; newContent: string}[] = [];
      for (const s of originalSections as any[]) {
        if (amendingSections[s.title] && amendingSections[s.title] !== s.content) {
          changes.push({ section: s.title, oldContent: s.content, newContent: amendingSections[s.title] });
        }
      }
      if (changes.length === 0) {
        alert('No changes detected. Edit at least one section before submitting.');
        setSubmittingAmendment(false);
        return;
      }

      // Save to DB
      if (!visitId.startsWith('mock-')) {
        const res = await fetch(`/api/visits/${visitId}/amend`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: amendReason, changes }),
        });
        const data = await res.json();
        if (!data.success) {
          alert('Amendment failed: ' + (data.error || 'Unknown error'));
          setSubmittingAmendment(false);
          return;
        }
      }

      // Update local state
      const now = new Date().toISOString();
      const amendment = { id: 'amend-' + Date.now(), timestamp: now, authorName: 'Current User', reason: amendReason.trim(), changes };
      const existingAmendments = (visitData as any).amendments || [];
      const updatedNote = (visitData.clinicalNote || visitData.note || []).map((s: any) => {
        const change = changes.find(c => c.section === s.title);
        return change ? { ...s, content: change.newContent } : s;
      });
      const updatedVisit = {
        ...visitData,
        clinicalNote: updatedNote,
        amendments: [...existingAmendments, amendment],
      };
      setVisitData(updatedVisit);
      localStorage.setItem(`omniscribe-visit-${visitId}`, JSON.stringify(updatedVisit));
      setAmendModalOpen(false);
      setSaveStatus('Amendment saved');
    } catch (err: any) {
      alert('Amendment error: ' + err.message);
    } finally {
      setSubmittingAmendment(false);
    }
  };

  const handleExportPDF = () => {
    const sections = visitData?.clinicalNote || visitData?.note || mockVisit?.note || [];
    const pt = patientName;
    const dt = formatDate(createdAt);
    const dur = Math.round(duration / 60);
    const fw = framework?.name || frameworkId;
    const compLine = compliance ? `<div class="footer">CMS Compliance: ${compliance.grade} (${compliance.score}%) - ${compliance.documented}/${compliance.totalRequired} items documented</div>` : '';
    
    let body = '';
    for (const s of sections as any[]) {
      const c = s.content
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
      body += `<h2>${s.title}</h2><div>${c}</div>`;
    }

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Clinical Note - ${pt}</title>
<style>body{font-family:Georgia,serif;max-width:700px;margin:40px auto;padding:20px;color:#1a1a1a;font-size:11pt;line-height:1.6}
h1{font-size:16pt;border-bottom:2px solid #1e3a5f;padding-bottom:8px;color:#1e3a5f}
h2{font-size:13pt;color:#1e3a5f;margin-top:20px;border-bottom:1px solid #ddd;padding-bottom:4px}
.header{text-align:center;margin-bottom:30px;border-bottom:2px solid #333;padding-bottom:15px}
.header h1{border:none;margin:0}
.meta{color:#666;font-size:9pt;margin-top:5px}
table{width:100%;border-collapse:collapse;margin:10px 0}td,th{border:1px solid #ddd;padding:6px 10px;text-align:left;font-size:10pt}
th{background:#f5f5f5;font-weight:bold}
.footer{margin-top:40px;padding-top:15px;border-top:1px solid #ddd;font-size:9pt;color:#888}
.signature{margin-top:50px;border-top:1px solid #333;width:250px;padding-top:5px;font-size:10pt}
@media print{body{margin:0;padding:15px}}</style></head>
<body><div class="header"><h1>Clinical Documentation</h1>
<div class="meta">Patient: ${pt} | Date: ${dt} | Provider: ${providerType}</div>
<div class="meta">Framework: ${fw} | Duration: ${dur} min</div></div>
${body}
${compLine}
<div class="signature">Clinician Signature / Date</div></body></html>`;
    const w = window.open('', '_blank');
    if (w) { w.document.write(html); w.document.close(); w.print(); }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch { return dateStr; }
  };

  // Auto-regenerate clinical reasoning + note from updated parsed data
  const regenerateFromParsedData = async (updatedParsedData: any[]) => {
    if (!visitData || regenerating) return;
    setRegenerating(true);
    try {
      // Combine all parsed data sections into a single text for re-processing
      const factsText = updatedParsedData.map((s: any) => `## ${s.title}\n${s.content}`).join('\n\n');
      
      const data = await fetchNoteSSE({
          transcript: visitData.transcript || '',
          frameworkId: visitData.frameworkId || '',
          providerType: visitData.providerType || '',
          regenerateFrom: factsText,
        });
      if (data.note || data.clinicalNote) {
        const updatedVisit = {
          ...visitData,
          parsedData: updatedParsedData,
          clinicalNote: data.clinicalNote || data.note || visitData.clinicalNote,
          clinicalSynthesis: data.clinicalSynthesis || visitData.clinicalSynthesis,
          note: data.note || visitData.note,
          summary: data.summary || visitData.summary,
        };
        setVisitData(updatedVisit);
        localStorage.setItem(`omniscribe-visit-${visitId}`, JSON.stringify(updatedVisit));
        setLastRegenTime(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      console.error('Regeneration error:', err);
    } finally {
      setRegenerating(false);
    }
  };

  // Handle new dictation transcript — extract facts and merge
  const handleDictationTranscript = async (transcript: string) => {
    if (!visitData) return;
    
    // Add the new dictation as a parsed data section immediately
    const currentParsedData = visitData.parsedData || visitData.note || [];
    const newSection = {
      title: '🎙 Follow-up Dictation (' + new Date().toLocaleTimeString() + ')',
      content: transcript,
    };
    const updatedParsedData = [...currentParsedData, newSection];
    
    // Update local state right away so user sees it
    const tempVisit = { ...visitData, parsedData: updatedParsedData };
    setVisitData(tempVisit);
    localStorage.setItem(`omniscribe-visit-${visitId}`, JSON.stringify(tempVisit));
    
    // Then trigger regeneration
    regenerateFromParsedData(updatedParsedData);
  };

  // Document Scanner Handler
  const handleDocumentScan = async (file: File) => {
    setScanning(true);
    setScanResult(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('frameworkId', frameworkId);
      if (visitData?.extractedFacts) {
        formData.append('existingFacts', visitData.extractedFacts);
      }

      const response = await fetch('/api/ocr', { method: 'POST', body: formData });
      const data = await response.json();

      if (data.success) {
        setScanResult(data);
        // Auto-merge scanned sections into parsed data
        if (data.mapping?.sections && visitData) {
          const newSections = data.mapping.sections.map((s: any, i: number) => ({
            id: `scan-${Date.now()}-${i}`,
            title: `📎 ${s.title} (from ${data.ocr.document_type})`,
            content: s.content,
            feedback: null,
          }));
          
          const updatedParsedData = [...(visitData.parsedData || visitData.note || []), ...newSections.map((s: any) => ({ title: s.title, content: s.content }))];
          const updatedVisit = { ...visitData, parsedData: updatedParsedData };
          setVisitData(updatedVisit);
          localStorage.setItem(`omniscribe-visit-${visitId}`, JSON.stringify(updatedVisit));
          
          // Auto-regenerate reasoning + note with new data
          regenerateFromParsedData(updatedParsedData);
        }
      } else {
        alert('Scan failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Scan error: ' + err.message);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Sidebar />
      <main className="lg:ml-64 pt-16">
        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 max-w-4xl">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                <Link href="/dashboard" className="hover:text-gray-700">My Notes</Link>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                <span className="text-gray-900 font-medium">{patientName}</span>
              </div>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{patientName}</h1>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className={`w-2 h-2 rounded-full transition-colors ${
                      saveStatus === 'Editing...' ? 'bg-amber-400 animate-pulse' :
                      saveStatus === 'Saving...' ? 'bg-blue-400 animate-pulse' :
                      saveStatus === 'Saved' || saveStatus === 'Saved just now' ? 'bg-green-400' :
                      saveStatus === 'Finalized' ? 'bg-green-600' :
                      'bg-green-400'
                    }`} />
                    <span className={`transition-colors ${
                      saveStatus === 'Editing...' ? 'text-amber-500' :
                      saveStatus === 'Saving...' ? 'text-blue-500' :
                      'text-gray-400'
                    }`}>{saveStatus}</span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span>{formatDate(createdAt)}</span>
                  <span>·</span>
                  <span>{Math.round(duration / 60)} min</span>
                  <span>·</span>
                  <span className="font-medium">{providerType}</span>
                  {framework && (
                    <>
                      <span>·</span>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getDomainColor(framework.domain) }}>
                        {framework.name}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-xl p-4 mb-6">
                <div className="text-xs font-semibold text-[#1e3a5f] uppercase tracking-wide mb-2">Visit Summary</div>
                <p className="text-sm text-gray-700 leading-relaxed">{summary}</p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 mb-6 flex-wrap">
                <button onClick={handleExportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-medium hover:bg-[#152d4a] transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  Export / Print
                </button>
                {!(visitData as any)?.finalized && (
                  <button onClick={handleFinalize}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                    Finalize Note
                  </button>
                )}
                {(visitData as any)?.finalized && (
                  <>
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm font-medium text-green-700">
                      &#10003; Finalized {(visitData as any)?.finalizedAt ? new Date((visitData as any).finalizedAt).toLocaleString() : ''}
                    </div>
                    <button onClick={handleOpenAmend}
                      className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Amend Note
                    </button>
                  </>
                )}
              </div>

              {/* Stats bar */}
              {visitData && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {confidence !== undefined && (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-400">Confidence</div>
                      <div className="text-sm font-semibold text-gray-900">{(confidence * 100).toFixed(1)}%</div>
                    </div>
                  )}
                  {generationTime !== undefined && (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-400">Gen Time</div>
                      <div className="text-sm font-semibold text-gray-900">{generationTime}s</div>
                    </div>
                  )}
                  {transcriptSource && (
                    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                      <div className="text-xs text-gray-400">Source</div>
                      <div className="text-sm font-semibold text-gray-900 capitalize">{transcriptSource}</div>
                    </div>
                  )}
                  {compliance && compliance.score >= 0 && (
                    <div className={`border rounded-lg px-3 py-2 cursor-pointer hover:opacity-80 ${
                      compliance.riskLevel === 'low' ? 'bg-green-50 border-green-200' :
                      compliance.riskLevel === 'moderate' ? 'bg-amber-50 border-amber-200' :
                      'bg-red-50 border-red-200'
                    }`} onClick={() => setTab('parsedData')}>
                      <div className="text-xs text-gray-400">CMS Compliance</div>
                      <div className={`text-sm font-semibold ${
                        compliance.score >= 80 ? 'text-green-700' :
                        compliance.score >= 60 ? 'text-amber-700' :
                        'text-red-700'
                      }`}>
                        {compliance.grade} — {compliance.score}%
                      </div>
                    </div>
                  )}
                  {auditClean !== undefined && (
                    <div className={`border rounded-lg px-3 py-2 ${auditClean ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                      <div className="text-xs text-gray-400">Audit</div>
                      <div className={`text-sm font-semibold ${auditClean ? 'text-green-700' : 'text-amber-700'}`}>
                        {auditClean ? '✓ Clean' : `⚠ ${auditIssues?.length || 0} issues`}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Audit issues */}
              {auditIssues && auditIssues.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-2">⚠ Audit Issues</div>
                  <ul className="space-y-1">
                    {auditIssues.map((issue, i) => (<li key={i} className="text-sm text-amber-800">• {issue}</li>))}
                  </ul>
                </div>
              )}

              {/* Amendment History */}
              {(visitData as any)?.amendments && (visitData as any).amendments.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
                  <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-3">📝 Amendment History</div>
                  <div className="space-y-3">
                    {((visitData as any).amendments as any[]).map((a: any, i: number) => (
                      <div key={a.id || i} className="border-l-2 border-amber-400 pl-3">
                        <div className="flex items-center gap-2 text-xs text-amber-800 mb-1">
                          <span className="font-semibold">Amendment #{i + 1}</span>
                          <span>·</span>
                          <span>{new Date(a.timestamp).toLocaleString()}</span>
                          <span>·</span>
                          <span>by {a.authorName}</span>
                        </div>
                        <div className="text-sm text-amber-900 mb-1"><strong>Reason:</strong> {a.reason}</div>
                        <div className="space-y-1">
                          {a.changes.map((c: any, j: number) => (
                            <div key={j} className="text-xs text-amber-700">
                              <span className="font-medium">Section: {c.section}</span>
                              <details className="mt-1">
                                <summary className="cursor-pointer text-amber-600 hover:text-amber-800">View changes</summary>
                                <div className="mt-1 grid grid-cols-2 gap-2">
                                  <div className="bg-red-50 border border-red-200 rounded p-2">
                                    <div className="text-[10px] font-semibold text-red-600 mb-1">ORIGINAL</div>
                                    <div className="text-xs text-red-800 whitespace-pre-wrap max-h-32 overflow-y-auto">{c.oldContent?.substring(0, 500)}{c.oldContent?.length > 500 ? '...' : ''}</div>
                                  </div>
                                  <div className="bg-green-50 border border-green-200 rounded p-2">
                                    <div className="text-[10px] font-semibold text-green-600 mb-1">AMENDED</div>
                                    <div className="text-xs text-green-800 whitespace-pre-wrap max-h-32 overflow-y-auto">{c.newContent?.substring(0, 500)}{c.newContent?.length > 500 ? '...' : ''}</div>
                                  </div>
                                </div>
                              </details>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tabs — Three main views */}
              <div className="flex gap-1 mb-4 bg-gray-100 rounded-lg p-1 w-fit flex-wrap">
                <button
                  onClick={() => setTab('clinicalNote')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'clinicalNote' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  📋 Clinical Note
                </button>
                <button
                  onClick={() => setTab('parsedData')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'parsedData' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  📊 Parsed Data
                </button>
                {clinicalSynthesis && (
                  <button
                    onClick={() => setTab('reasoning')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'reasoning' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    ⚡ Clinical Reasoning
                  </button>
                )}
                <button
                  onClick={() => setTab('transcript')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'transcript' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  🎙 Transcript
                </button>
                {extractedFacts && (
                  <button
                    onClick={() => setTab('facts')}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${tab === 'facts' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    🔍 Raw Facts
                  </button>
                )}
              </div>

              {/* Tab descriptions */}
              {tab === 'clinicalNote' && (
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#0d9488]" />
                  Final clinical note — parsed data + clinical reasoning combined. Ready for the chart.
                </div>
              )}
              {tab === 'parsedData' && (
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-500" />
                  Raw extracted data from the recording. Fill in blanks or add more details to improve the final note.
                </div>
              )}
              {tab === 'reasoning' && (
                <div className="text-xs text-gray-500 mb-3 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-amber-500" />
                  AI clinical reasoning synthesized from documented findings. Review for accuracy.
                </div>
              )}

              {/* Content */}
              {tab === 'clinicalNote' ? (
                <NoteEditor sections={clinicalNote} onUpdate={handleUpdate} missingItems={compliance?.missing} visitMeta={{
                  patientName,
                  date: createdAt,
                  providerType,
                  frameworkName: framework?.name || frameworkId,
                  duration,
                  complianceGrade: compliance?.grade,
                  complianceScore: compliance?.score,
                  complianceDocumented: compliance?.documented,
                  complianceTotal: compliance?.totalRequired,
                  amendments: (visitData as any)?.amendments,
                }} onSaveStatus={setSaveStatus} />
              ) : tab === 'parsedData' ? (
                <div>
                  {/* Compliance Score Card */}
                  {compliance && compliance.score >= 0 && (
                    <div className={`rounded-xl p-5 mb-6 border ${
                      compliance.riskLevel === 'low' ? 'bg-green-50 border-green-200' :
                      compliance.riskLevel === 'moderate' ? 'bg-amber-50 border-amber-200' :
                      compliance.riskLevel === 'high' ? 'bg-orange-50 border-orange-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">CMS Compliance Score</h3>
                          <p className="text-xs text-gray-600 mt-0.5">{compliance.summary}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className={`text-3xl font-bold ${
                            compliance.grade === 'A' ? 'text-green-600' :
                            compliance.grade === 'B' ? 'text-green-500' :
                            compliance.grade === 'C' ? 'text-amber-500' :
                            compliance.grade === 'D' ? 'text-orange-500' :
                            'text-red-500'
                          }`}>{compliance.grade}</div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-gray-900">{compliance.score}%</div>
                            <div className="text-xs text-gray-500">{compliance.documented}/{compliance.totalRequired} items</div>
                          </div>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden mb-4">
                        <div className={`h-full rounded-full transition-all ${
                          compliance.score >= 90 ? 'bg-green-500' :
                          compliance.score >= 70 ? 'bg-amber-500' :
                          compliance.score >= 50 ? 'bg-orange-500' :
                          'bg-red-500'
                        }`} style={{ width: `${compliance.score}%` }} />
                      </div>

                      {/* Missing items */}
                      {compliance.missing.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Missing Documentation</h4>
                          <div className="space-y-1.5">
                            {compliance.missing.filter(r => r.category === 'critical').map((req, i) => (
                              <div key={`c-${i}`} className="flex items-start gap-2 text-sm">
                                <span className="text-red-500 font-bold text-xs mt-0.5 shrink-0">❌ CRITICAL</span>
                                <div>
                                  <span className="font-medium text-gray-900">{req.item}</span>
                                  <span className="text-gray-400 text-xs ml-1">({req.section})</span>
                                  <p className="text-xs text-gray-500">{req.description} — <span className="text-gray-400 italic">{req.regulation}</span></p>
                                </div>
                              </div>
                            ))}
                            {compliance.missing.filter(r => r.category === 'required').map((req, i) => (
                              <div key={`r-${i}`} className="flex items-start gap-2 text-sm">
                                <span className="text-amber-500 font-bold text-xs mt-0.5 shrink-0">⚠ REQUIRED</span>
                                <div>
                                  <span className="font-medium text-gray-900">{req.item}</span>
                                  <span className="text-gray-400 text-xs ml-1">({req.section})</span>
                                  <p className="text-xs text-gray-500">{req.description}</p>
                                </div>
                              </div>
                            ))}
                            {compliance.missing.filter(r => r.category === 'recommended').map((req, i) => (
                              <div key={`o-${i}`} className="flex items-start gap-2 text-sm">
                                <span className="text-blue-400 font-bold text-xs mt-0.5 shrink-0">💡 RECOMMENDED</span>
                                <div>
                                  <span className="font-medium text-gray-700">{req.item}</span>
                                  <span className="text-gray-400 text-xs ml-1">({req.section})</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <NoteEditor sections={parsedData} onUpdate={handleUpdate} missingItems={compliance?.missing} visitMeta={{
                    patientName,
                    date: createdAt,
                    providerType,
                    frameworkName: framework?.name || frameworkId,
                    duration,
                  }} onSaveStatus={setSaveStatus} />

                  {/* Action buttons */}
                  <div className="mt-4 space-y-3">
                    <div className="flex gap-3 flex-wrap">
                      <MiniRecorder 
                        onTranscript={handleDictationTranscript} 
                        disabled={scanning || regenerating}
                      />
                      <label className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer inline-flex items-center gap-2 ${
                        scanning 
                          ? 'bg-blue-100 text-blue-600 border border-blue-200' 
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}>
                        {scanning ? (
                          <>
                            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full" />
                            Scanning...
                          </>
                        ) : (
                          <>📎 Add Document</>
                        )}
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/gif,image/webp"
                          className="hidden"
                          disabled={scanning}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleDocumentScan(file);
                              e.target.value = '';
                            }
                          }}
                        />
                      </label>
                    </div>
                    <div className="text-xs text-gray-400">
                      🎙 Dictate additional details · 📎 Scan documents — both auto-merge and regenerate your note
                    </div>
                    
                    {/* Regeneration indicator */}
                    {regenerating && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                        <div className="animate-spin w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full" />
                        <span className="text-sm text-purple-700 font-medium">Regenerating clinical reasoning & note...</span>
                      </div>
                    )}
                    {lastRegenTime && !regenerating && (
                      <div className="text-xs text-green-600">
                        ✓ Note regenerated at {lastRegenTime}
                      </div>
                    )}

                    {/* Scan Result Card */}
                    {scanResult && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-3">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm font-semibold text-blue-900">
                              📎 Document Scanned: {scanResult.ocr?.document_type || 'Unknown'}
                            </h4>
                            <p className="text-xs text-blue-600 mt-0.5">
                              {scanResult.fileName} · {(scanResult.fileSize / 1024).toFixed(0)}KB · {scanResult.processingTime}s
                            </p>
                          </div>
                          <button 
                            onClick={() => setScanResult(null)}
                            className="text-blue-400 hover:text-blue-600 text-sm"
                          >✕</button>
                        </div>

                        {/* Key findings */}
                        {scanResult.mapping?.key_findings?.length > 0 && (
                          <div className="mb-2">
                            <div className="text-xs font-semibold text-blue-800 mb-1">Key Findings:</div>
                            <ul className="space-y-0.5">
                              {scanResult.mapping.key_findings.map((f: string, i: number) => (
                                <li key={i} className="text-xs text-blue-700">• {f}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Merge suggestion */}
                        {scanResult.mapping?.merge_suggestions && (
                          <p className="text-xs text-blue-600 italic">{scanResult.mapping.merge_suggestions}</p>
                        )}

                        {/* OCR confidence */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            scanResult.ocr?.confidence === 'high' ? 'bg-green-100 text-green-700' :
                            scanResult.ocr?.confidence === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            OCR: {scanResult.ocr?.confidence || 'unknown'}
                          </span>
                          <span className="text-xs text-blue-500">
                            {scanResult.mapping?.sections?.length || 0} sections merged into Parsed Data
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : tab === 'reasoning' ? (
                clinicalSynthesis ? (
                  <ClinicalSynthesis
                    synthesis={clinicalSynthesis}
                    onUpdate={(updated) => {
                      if (!visitData) return;
                      const updatedVisit = { ...visitData, clinicalSynthesis: updated };
                      setVisitData(updatedVisit);
                      localStorage.setItem("omniscribe-visit-" + visitId, JSON.stringify(updatedVisit));
                    }}
                    onRegenerateNote={async (synthesis) => {
                      if (!visitData) return;
                      setRegenerating(true);
                      try {
                        const res = await fetch('/api/regenerate-note', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            parsedData: visitData.parsedData || visitData.note,
                            clinicalSynthesis: synthesis,
                            frameworkId: visitData.frameworkId,
                          }),
                        });
                        const data = await res.json();
                        if (data.success && data.clinicalNote) {
                          const updatedVisit = { ...visitData, clinicalNote: data.clinicalNote, clinicalSynthesis: synthesis };
                          setVisitData(updatedVisit);
                          localStorage.setItem("omniscribe-visit-" + visitId, JSON.stringify(updatedVisit));
                          setLastRegenTime(new Date().toLocaleTimeString());
                        }
                      } catch (err) {
                        console.error('Regeneration error:', err);
                      } finally {
                        setRegenerating(false);
                      }
                    }}
                    regenerating={regenerating}
                  />
                ) : (
                  <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
                    No clinical synthesis available for this visit.
                  </div>
                )
              ) : tab === 'transcript' ? (
                <div className="space-y-3">
                  {/* Speaker controls */}
                  {transcript && transcript.includes('**Speaker') && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">1</span>
                            <select
                              value={speakerLabels[speakersSwapped ? '2' : '1']}
                              onChange={(e) => handleLabelSpeaker(speakersSwapped ? '2' : '1', e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white"
                            >
                              <option value="Speaker 1">Speaker 1</option>
                              <option value="Clinician">Clinician</option>
                              <option value="Patient">Patient</option>
                              <option value="Caregiver">Caregiver</option>
                              <option value="Interpreter">Interpreter</option>
                            </select>
                          </div>
                          <button
                            onClick={handleSwapSpeakers}
                            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                            title="Swap speaker labels"
                          >
                            ⇄ Swap
                          </button>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">2</span>
                            <select
                              value={speakerLabels[speakersSwapped ? '1' : '2']}
                              onChange={(e) => handleLabelSpeaker(speakersSwapped ? '1' : '2', e.target.value)}
                              className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white"
                            >
                              <option value="Speaker 2">Speaker 2</option>
                              <option value="Patient">Patient</option>
                              <option value="Clinician">Clinician</option>
                              <option value="Caregiver">Caregiver</option>
                              <option value="Interpreter">Interpreter</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Transcript content */}
                  <div className="bg-white border border-gray-200 rounded-xl p-6">
                    {transcript ? (
                      <div className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed font-sans"
                        dangerouslySetInnerHTML={{ __html: formatTranscript(transcript)
                          .replace(/\*\*(.+?):\*\*/g, '<strong class="text-[#1e3a5f]">$1:</strong>')
                          .replace(/\n\n/g, '<br/><br/>')
                        }}
                      />
                    ) : (
                      <p className="text-sm text-gray-400 italic">Transcript not available.</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <pre className="whitespace-pre-wrap text-xs text-gray-700 leading-relaxed font-mono overflow-x-auto">
                    {(() => { try { return JSON.stringify(JSON.parse(extractedFacts || '{}'), null, 2); } catch { return extractedFacts || 'No facts available'; } })()}
                  </pre>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            {framework && (
              <div className="w-full lg:w-72 shrink-0">
                <div className="bg-white border border-gray-200 rounded-xl p-5 sticky top-24">
                  <h3 className="font-semibold text-gray-900 text-sm mb-3">Framework Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Domain</div>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: getDomainColor(framework.domain) }}>
                        {getDomainLabel(framework.domain)}
                      </span>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Type</div>
                      <div className="text-gray-700">{framework.type} — {framework.subtype}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Items</div>
                      <div className="text-gray-700 font-medium">{framework.itemCount} across {framework.sections.length} sections</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Sections</div>
                      <div className="space-y-1">
                        {framework.sections.map((s) => (
                          <div key={s.id} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: getDomainColor(framework.domain) }} />
                            {s.title} <span className="text-gray-400">({s.items.length})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Amendment Modal */}
        {amendModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-gray-900">📝 Amend Finalized Note</h2>
                  <button onClick={() => setAmendModalOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
                  <strong>Important:</strong> Amendments are permanent additions to the medical record. The original note and all amendments are preserved with timestamps for compliance.
                </div>
                {/* Reason */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Amendment <span className="text-red-500">*</span></label>
                  <textarea
                    value={amendReason}
                    onChange={(e) => setAmendReason(e.target.value)}
                    placeholder="e.g., Correcting blood pressure reading, adding missed medication..."
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    rows={2}
                  />
                </div>
                {/* Editable sections */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edit Sections</label>
                  <div className="space-y-3">
                    {Object.entries(amendingSections).map(([title, content]) => (
                      <div key={title} className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 border-b border-gray-200">{title}</div>
                        <textarea
                          value={content}
                          onChange={(e) => setAmendingSections(prev => ({ ...prev, [title]: e.target.value }))}
                          className="w-full p-3 text-sm font-mono leading-relaxed focus:ring-2 focus:ring-amber-500 focus:border-amber-500 border-0"
                          rows={Math.min(Math.max(content.split('\n').length + 1, 3), 12)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button onClick={() => setAmendModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitAmendment}
                    disabled={!amendReason.trim() || submittingAmendment}
                    className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    {submittingAmendment ? (
                      <><div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Saving...</>
                    ) : (
                      <>Submit Amendment</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
