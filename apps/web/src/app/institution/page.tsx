'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  School,
  CheckCircle2,
  Clock,
  RotateCcw,
  Upload,
  Calendar,
  AlertTriangle,
  Download,
  FileText,
  Hourglass,
  Sparkles,
} from 'lucide-react';

export default function InstitutionPortalPage() {
  const [activeTab, setActiveTab] = useState<'STATUS' | 'DEFICIENCIES' | 'UNDERTAKINGS' | 'DOCUMENTS'>('STATUS');
  const [resolvedItems, setResolvedItems] = useState<Record<string, boolean>>({});
  const [submittedResponse, setSubmittedResponse] = useState(false);

  const trackerStages = [
    { key: 'SUBMITTED', label: 'Intake Submission', status: 'COMPLETED' },
    { key: 'SCRUTINY', label: 'Document Scrutiny', status: 'IN_PROGRESS' },
    { key: 'EVC_QUEUE', label: 'EVC Inspection', status: 'UPCOMING' },
    { key: 'COMPETENT_REVIEW', label: 'Competent Authority', status: 'UPCOMING' },
    { key: 'DECISION', label: 'Final Decision & EoA', status: 'UPCOMING' },
  ];

  const handleResolveItem = (id: string) => {
    setResolvedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmitDeficiencyClarification = () => {
    setSubmittedResponse(true);
    setTimeout(() => setSubmittedResponse(false), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Institutional View
            </span>
            <span className="text-xs text-slate-400">• Apex Institute of Technology (1-46273286079)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Applicant Institutional Portal
          </h1>
          <p className="text-xs text-slate-500">
            Transparent real-time tracking, structured deficiency checklist resolution, and active undertaking countdowns.
          </p>
        </div>

        <div className="flex space-x-1 bg-slate-200 p-1 rounded-xl text-xs font-bold">
          {['STATUS', 'DEFICIENCIES', 'UNDERTAKINGS', 'DOCUMENTS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {submittedResponse && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Deficiency clarification submitted successfully! File transferred back to Re-Scrutiny desk. Officer SLA resumed.</span>
        </div>
      )}

      {/* Tab 1: Pizza-Tracker Stage Progression */}
      {activeTab === 'STATUS' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Live Stage Tracker (Pizza-Tracker)</h2>
                <p className="text-xs text-slate-500">Application Number: APH2026-SRO-86079</p>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Track: Scrutiny + EVC
              </span>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              {trackerStages.map((st, i) => (
                <div
                  key={st.key}
                  className={`p-3.5 rounded-xl border transition-all text-xs ${
                    st.status === 'COMPLETED'
                      ? 'border-emerald-300 bg-emerald-50/60 text-emerald-950'
                      : st.status === 'IN_PROGRESS'
                      ? 'border-indigo-400 bg-indigo-50/70 text-indigo-950 ring-2 ring-indigo-200'
                      : 'border-slate-200 bg-slate-50 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-[10px]">STEP 0{i + 1}</span>
                    {st.status === 'COMPLETED' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : st.status === 'IN_PROGRESS' ? (
                      <Clock className="w-4 h-4 text-indigo-600 animate-spin-slow" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-slate-300" />
                    )}
                  </div>
                  <div className="font-bold text-xs">{st.label}</div>
                  <span className="text-[10px] block mt-1 font-semibold uppercase tracking-wider opacity-75">
                    {st.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-950 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold">Next Statutory Milestone:</span>
                <p className="text-[11px] text-indigo-800">
                  Document Scrutiny completion. Upon verification, dossier will auto-route to Council-constituted EVC Queue.
                </p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-sm shrink-0">
                Target: 4 Working Days
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Deficiency Checklist */}
      {activeTab === 'DEFICIENCIES' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Scrutiny Revert Checklist</h2>
              <p className="text-xs text-slate-500">Provide required evidence and clarification for each item raised by the scrutiny desk</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              Response Due: 8 Days Remaining
            </span>
          </div>

          <div className="space-y-3">
            {[
              { id: 'item1', desc: 'Upload rectified registered lease deed with clearly demarcated survey boundaries and registrar seal.' },
              { id: 'item2', desc: 'Provide faculty recruitment notification and selection committee minutes for Assistant Professor cadre ratio compliance.' },
            ].map((item) => (
              <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      checked={!!resolvedItems[item.id]}
                      onChange={() => handleResolveItem(item.id)}
                      className="mt-0.5 accent-indigo-600 rounded"
                    />
                    <span className="font-medium text-slate-800">{item.desc}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded shrink-0 ${
                    resolvedItems[item.id] ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {resolvedItems[item.id] ? 'Resolved' : 'Pending Response'}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                  <button className="px-2.5 py-1 bg-white border border-slate-300 rounded hover:bg-slate-50 text-slate-700 flex items-center gap-1 font-semibold text-[11px]">
                    <Upload className="w-3 h-3" /> Attach Evidence Document
                  </button>
                  <span className="text-[10px] text-slate-400">PDF, max 10MB • ClamAV malware scanned</span>
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmitDeficiencyClarification}
              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 text-xs active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Clarification & Resubmit Dossier
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Undertakings */}
      {activeTab === 'UNDERTAKINGS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Active Conditional Undertakings Countdown</h2>
              <p className="text-xs text-slate-500">Compliance requirements imposed during approval</p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <strong className="text-slate-800 text-sm">Faculty Recruitment & Cadre Ratio Compliance</strong>
              <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                Due in 5 Days
              </span>
            </div>
            <p className="text-slate-600 text-[11px]">
              Submission of appointment letters and roster verification for 12 Assistant Professors and 2 Associate Professors.
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-semibold flex items-center gap-1 shadow-sm">
                <Upload className="w-3.5 h-3.5" /> Upload Verification Roster
              </button>
              <button className="px-3 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-700 hover:bg-slate-50">
                Request Statutory Extension
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Documents */}
      {activeTab === 'DOCUMENTS' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Institutional Document Repository & Validity Calendar</h2>
              <p className="text-xs text-slate-500">Tracks registered lease deeds, fire safety NOCs, and building completion certificates</p>
            </div>
            <button className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-semibold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Export .ics Calendar Feed
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Registered Lease Deed (30 Yrs)</span>
                <span className="text-emerald-700 font-semibold text-[11px]">VALID (Exp. 2046)</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">TN-CH-REG-2016-89412</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Fire Safety NOC</span>
                <span className="text-amber-700 font-semibold text-[11px]">RENEWAL DUE SOON</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">FS-NOC-2025-1142</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
