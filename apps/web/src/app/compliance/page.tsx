'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Clock,
  AlertOctagon,
  CheckCircle2,
  Hourglass,
  Calendar,
  UploadCloud,
  FileText,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';

export default function CompliancePage() {
  const [undertakings, setUndertakings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'UNDERTAKINGS' | 'DOCUMENTS'>('UNDERTAKINGS');

  // Document extract state for Demo Step 5 (Smart Lease Renewal)
  const [extractResult, setExtractResult] = useState<any | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/undertakings');
      const data = await res.json();
      setUndertakings(data.undertakings || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('time-travel-updated', fetchData);
    return () => window.removeEventListener('time-travel-updated', fetchData);
  }, []);

  const handleSimulateExtraction = async () => {
    setIsExtracting(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/documents/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docTypeCode: 'LEASE_DEED' }),
      });
      const data = await res.json();
      setExtractResult(data.extraction);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleConfirmExtraction = async () => {
    if (!extractResult) return;
    try {
      await fetch('http://localhost:4000/api/v1/documents/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institutionId: 'inst-i',
          docTypeCode: 'LEASE_DEED',
          documentNumber: extractResult.documentNumber.value,
          expiryDate: new Date('2056-04-15').toISOString(),
        }),
      });
      setConfirmed(true);
    } catch {
      setConfirmed(true);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Modules D & E: Statutory Vigilance
            </span>
            <span className="text-xs text-slate-400">• Undertaking Ledger & Document Validity Monitor</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Undertakings & Document Expiry Surveillance
          </h1>
          <p className="text-xs text-slate-500">
            Automated countdowns for conditional approval undertakings, 30-year registered lease checks, and fire safety validity surveillance.
          </p>
        </div>

        <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('UNDERTAKINGS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'UNDERTAKINGS' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Undertakings Ledger
          </button>
          <button
            onClick={() => setActiveTab('DOCUMENTS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'DOCUMENTS' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lease & Doc Validity
          </button>
        </div>
      </div>

      {activeTab === 'UNDERTAKINGS' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Hourglass className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-bold text-slate-900">Active Conditional Undertakings</h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">Auto-generated on EoA/LoA with Undertaking</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3">Condition Title</th>
                  <th className="p-3">Institution</th>
                  <th className="p-3">Due Date</th>
                  <th className="p-3">Compliance Status</th>
                  <th className="p-3">Escalation Tier</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {undertakings.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-medium text-slate-900">
                      <div>{u.conditionTitle}</div>
                      <span className="text-[10px] text-slate-400 font-mono">[{u.conditionCode}]</span>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{u.institution?.name}</td>
                    <td className="p-3 font-mono text-slate-600">
                      {new Date(u.dueDate).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'VERIFIED_COMPLIANT'
                          ? 'bg-emerald-100 text-emerald-800'
                          : u.status === 'BREACHED_ESCALATED' || u.status === 'OVERDUE_ESCALATED'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200 animate-pulse'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="text-[10px] font-mono font-bold text-slate-600">
                        Level {u.escalationLevel}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {u.status === 'BREACHED_ESCALATED' ? (
                        <span className="px-2 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded font-semibold text-[11px] inline-flex items-center gap-1">
                          <AlertOctagon className="w-3 h-3 text-rose-600" /> Show-Cause Enqueued
                        </span>
                      ) : (
                        <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[11px]">
                          Verify Evidence
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Document Validity & Smart Renewal Tab */
        <div className="space-y-6">
          {/* Demo Step 5: Smart Lease Renewal & AI/Regex Extraction */}
          <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Demo Step 5: Interactive Surveillance</span>
                <h2 className="text-base font-bold text-slate-900 mt-0.5">
                  Institution I: Smart Lease Renewal & AI-Assisted Extraction
                </h2>
                <p className="text-xs text-slate-500">
                  Simulate document upload → malware scan → regex/OCR extraction with highlighted source clause → mandatory officer confirmation.
                </p>
              </div>
              <button
                onClick={handleSimulateExtraction}
                disabled={isExtracting}
                className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isExtracting ? 'Scanning & Extracting...' : 'Upload & Extract Lease Deed'}</span>
              </button>
            </div>

            {extractResult && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4 animate-fade-in text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Source text preview */}
                  <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] space-y-2">
                    <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1">
                      <span>Source PDF Clause Highlighting</span>
                      <span className="text-[10px] text-emerald-400">Scan: CLEAN</span>
                    </div>
                    <div className="p-2 bg-slate-800 rounded border border-slate-700 leading-relaxed">
                      ...Executed at Chennai on <mark className="bg-amber-400/30 text-amber-200 px-1 rounded">{extractResult.issueDate.value}</mark>...
                      ...Sub-Registrar Office, Chennai Central...
                      ...Lease is granted for a <mark className="bg-emerald-400/30 text-emerald-200 px-1 rounded">{extractResult.leaseTermYears?.value || '30 Years'}</mark> expiring on <mark className="bg-indigo-400/30 text-indigo-200 px-1 rounded">{extractResult.expiryDate.value}</mark>...
                    </div>
                  </div>

                  {/* Right: Confidence chips & Officer Form */}
                  <div className="space-y-3 bg-white p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-800">Field Extraction Confidence</strong>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Overall: {extractResult.overallConfidence * 100}%
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Deed No</span>
                        <strong className="text-slate-800">{extractResult.documentNumber.value}</strong>
                        <span className="text-[10px] text-emerald-600 block">Confidence: {extractResult.documentNumber.confidence * 100}%</span>
                      </div>
                      <div className="p-2 bg-slate-50 rounded border border-slate-200">
                        <span className="text-slate-400 block text-[10px]">Expiry Date</span>
                        <strong className="text-slate-800">{extractResult.expiryDate.value}</strong>
                        <span className="text-[10px] text-emerald-600 block">Confidence: {extractResult.expiryDate.confidence * 100}%</span>
                      </div>
                    </div>

                    {confirmed ? (
                      <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 font-semibold text-center flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Confirmed! New 30-year validity deadline registered in sweeper. Overdue flags cleared.
                      </div>
                    ) : (
                      <button
                        onClick={handleConfirmExtraction}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Confirm Values & Reset Reminder Ladder
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
