'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Inbox,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Search,
  Filter,
  CheckSquare,
  Plus,
  Trash2,
  FileText,
  Clock,
} from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { StepUpModal } from '@/components/StepUpModal';
import { REASON_CODES } from '@pravah/shared';

export default function MyWorkPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  // Deficiency Modal State
  const [isRevertOpen, setIsRevertOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState(REASON_CODES[0].code);
  const [revertRemarks, setRevertRemarks] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([
    'Registered Lease Deed missing demarcated survey boundaries',
    'Faculty cadre ratio shortfall in Computer Science department',
  ]);
  const [newItemText, setNewItemText] = useState('');

  // Step-Up Modal State
  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [stepUpAction, setStepUpAction] = useState<string>('APPROVE');

  const [notification, setNotification] = useState<string | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/applications');
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
      // Fallback sample data if API starting
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    window.addEventListener('time-travel-updated', fetchApps);
    return () => window.removeEventListener('time-travel-updated', fetchApps);
  }, []);

  const handleClearScrutiny = async (app: any) => {
    try {
      const res = await fetch(`http://localhost:4000/api/v1/applications/${app.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CLEAR',
          actorRole: 'SCRUTINY_OFFICER',
          actorType: 'USER',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`Scrutiny CLEARED for ${app.applicationNumber}! File automatically enqueued into Regional EVC Queue with transparent priority score.`);
        setTimeout(() => setNotification(null), 6000);
        await fetchApps();
      }
    } catch {
      setNotification('Action failed.');
    }
  };

  const handleRevertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/applications/${selectedApp.id}/revert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reasonCode,
          remarks: revertRemarks || 'Institutional clarification required on survey boundaries and cadre ratios.',
          items: checklistItems.map((c) => ({ description: c })),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`Application ${selectedApp.applicationNumber} REVERTED to institution! Officer SLA clock PAUSED. Deficiency checklist created.`);
        setTimeout(() => setNotification(null), 6000);
        setIsRevertOpen(false);
        await fetchApps();
      }
    } catch {
      setNotification('Revert failed.');
    }
  };

  const handleStepUpConfirm = async (stepUp: any) => {
    if (!selectedApp) return;

    try {
      const res = await fetch(`http://localhost:4000/api/v1/applications/${selectedApp.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: stepUpAction,
          actorRole: 'REGIONAL_OFFICER',
          actorType: 'USER',
          actorId: 'usr-ro-south',
          stepUp,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`Statutory ${stepUpAction} executed successfully! Cryptographic signature & hash chain recorded in audit trail.`);
        setTimeout(() => setNotification(null), 6000);
        await fetchApps();
      } else {
        setNotification(`Guard blocked: ${data.error}`);
      }
    } catch {
      setNotification('Statutory action failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Assigned Inbox
            </span>
            <span className="text-xs text-slate-400">• Scrutiny Desk (SRO Chennai)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Officer Scrutiny & Action Console
          </h1>
          <p className="text-xs text-slate-500">
            Files assigned for regulatory scrutiny. Clear clean files into EVC queue, or revert with structured checklist to pause SLA clock.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Files Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Assigned Regulatory Dossiers</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {applications.length} files in queue
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Application Number</th>
                <th className="p-3">Institution Name</th>
                <th className="p-3">Track / Type</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3 text-right">Scrutiny Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${app.id}`} className="hover:underline">
                      {app.applicationNumber}
                    </Link>
                  </td>
                  <td className="p-3 font-medium text-slate-900">
                    <div>{app.institution?.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {app.institution?.aictePermanentId}</span>
                  </td>
                  <td className="p-3 text-slate-600 font-medium">{app.applicationType}</td>
                  <td className="p-3 font-mono font-semibold text-slate-700">{app.currentStage}</td>
                  <td className="p-3">
                    <SlaBadge state={app.slaState} />
                  </td>
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {app.currentStage === 'SCRUTINY' || app.currentStage === 'RE_SCRUTINY' ? (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setIsRevertOpen(true);
                            }}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded font-semibold flex items-center gap-1 text-[11px]"
                            title="Revert file for deficiency with checklist"
                          >
                            <RotateCcw className="w-3 h-3 text-amber-600" /> Revert (Deficiency)
                          </button>
                          <button
                            onClick={() => handleClearScrutiny(app)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold flex items-center gap-1 text-[11px] shadow-sm"
                            title="Clear Scrutiny and auto-queue for EVC"
                          >
                            <CheckCircle2 className="w-3 h-3" /> Clear Scrutiny
                          </button>
                        </>
                      ) : app.currentStage === 'DEFICIENCY_REVERTED' ? (
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded text-[10px] font-bold">
                          Awaiting Institution Response
                        </span>
                      ) : app.currentStage === 'COMPETENT_AUTHORITY_REVIEW' ? (
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setStepUpAction('APPROVE');
                            setIsStepUpOpen(true);
                          }}
                          className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-semibold flex items-center gap-1 text-[11px]"
                        >
                          <ShieldCheck className="w-3 h-3" /> Statutory Approve
                        </button>
                      ) : (
                        <Link
                          href={`/applications/${app.id}`}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium text-[11px]"
                        >
                          View Details
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deficiency Revert Modal */}
      {isRevertOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5">
              <div className="flex items-center gap-2 mb-1">
                <RotateCcw className="w-5 h-5 text-amber-200" />
                <span className="text-xs uppercase font-bold tracking-wider text-amber-200">
                  Authorized Deficiency Revert
                </span>
              </div>
              <h3 className="text-lg font-bold">Revert File to Institution</h3>
              <p className="text-xs text-amber-100 mt-1">
                Application: <strong className="text-white">{selectedApp.applicationNumber}</strong> ({selectedApp.institution?.name})
              </p>
            </div>

            <form onSubmit={handleRevertSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <strong>SLA Pause Guarantee:</strong> Raising this deficiency immediately stops the officer SLA clock and transfers the file to the institution with a 10-day response window.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reason Code (APH Prescribed Taxonomy)
                </label>
                <select
                  value={reasonCode}
                  onChange={(e) => setReasonCode(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {REASON_CODES.map((rc) => (
                    <option key={rc.code} value={rc.code}>
                      [{rc.code}] {rc.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Deficiency Checklist Items (Institution must resolve each)
                </label>
                <div className="space-y-1.5 max-h-36 overflow-y-auto mb-2">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">{item}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-rose-600 p-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="Add specific checklist item..."
                    className="flex-1 p-2 border border-slate-300 rounded-lg text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (newItemText.trim()) {
                        setChecklistItems([...checklistItems, newItemText.trim()]);
                        setNewItemText('');
                      }
                    }}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Officer Detailed Remarks
                </label>
                <textarea
                  rows={2}
                  value={revertRemarks}
                  onChange={(e) => setRevertRemarks(e.target.value)}
                  placeholder="Provide explicit instructions on required document uploads or clarifications..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRevertOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-lg shadow-md flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> Issue Revert & Pause SLA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Step-Up Modal for Statutory Actions */}
      {selectedApp && (
        <StepUpModal
          isOpen={isStepUpOpen}
          onClose={() => setIsStepUpOpen(false)}
          onConfirm={handleStepUpConfirm}
          actionTitle={stepUpAction}
          applicationNumber={selectedApp.applicationNumber}
        />
      )}
    </div>
  );
}
