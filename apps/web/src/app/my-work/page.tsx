'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import {
  Inbox, CheckCircle2, AlertTriangle, RotateCcw, ShieldCheck, Search,
  Filter, CheckSquare, Plus, Trash2, FileText, Clock,
} from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { StepUpModal } from '@/components/StepUpModal';
import { REASON_CODES } from '@pravah/shared';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/EmptyState';

export default function MyWorkPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  const [isRevertOpen, setIsRevertOpen] = useState(false);
  const [reasonCode, setReasonCode] = useState<string>(REASON_CODES[0].code);
  const [revertRemarks, setRevertRemarks] = useState('');
  const [checklistItems, setChecklistItems] = useState<string[]>([
    'Registered Lease Deed missing demarcated survey boundaries',
    'Faculty cadre ratio shortfall in Computer Science department',
  ]);
  const [newItemText, setNewItemText] = useState('');

  const [isStepUpOpen, setIsStepUpOpen] = useState(false);
  const [stepUpAction, setStepUpAction] = useState<string>('APPROVE');

  const [notification, setNotification] = useState<string | null>(null);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/applications`);
      const data = await res.json();
      setApplications(data.applications || []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
    const handler = () => fetchApps();
    window.addEventListener('time-travel-updated', handler);
    return () => window.removeEventListener('time-travel-updated', handler);
  }, []);

  const handleClearScrutiny = async (app: any) => {
    try {
      const res = await fetch(`${API_BASE}/applications/${app.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'CLEAR', actorRole: 'SCRUTINY_OFFICER', actorType: 'USER' }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`Scrutiny CLEARED for ${app.applicationNumber}! File enqueued into Regional EVC Queue.`);
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
      const res = await fetch(`${API_BASE}/applications/${selectedApp.id}/revert`, {
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
        setNotification(`Application ${selectedApp.applicationNumber} REVERTED to institution! SLA paused.`);
        setTimeout(() => setNotification(null), 6000);
        setIsRevertOpen(false);
        await fetchApps();
      }
    } catch {
      setNotification('Revert failed.');
    }
  };

  const handleStepUpConfirm = async (stepUp: { totpCode: string; totpVerified: boolean; remarks: string }) => {
    if (!selectedApp) return;
    try {
      const res = await fetch(`${API_BASE}/applications/${selectedApp.id}/transition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: stepUpAction,
          actorRole: 'SCRUTINY_OFFICER',
          actorType: 'USER',
          totpCode: stepUp.totpCode,
          totpVerified: stepUp.totpVerified,
          remarks: stepUp.remarks,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`${stepUpAction} completed for ${selectedApp.applicationNumber}.`);
        setTimeout(() => setNotification(null), 6000);
        await fetchApps();
      }
    } catch {
      setNotification('Action failed.');
    }
  };

  const openRevert = (app: any) => { setSelectedApp(app); setIsRevertOpen(true); };
  const openStepUp = (app: any, action: string) => { setSelectedApp(app); setStepUpAction(action); setIsStepUpOpen(true); };

  if (loading) return <LoadingSpinner label="Loading scrutiny inbox..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module A"
        title="Officer Scrutiny Inbox"
        description="Review dossiers, clear scrutiny, or revert deficiencies with structured checklist and SLA pause."
        badge="Scrutiny Officer View"
      />

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Inbox Items" value={applications.length} icon={Inbox} tone="info" />
        <StatCard label="On Schedule" value={applications.filter((a) => a.slaState === 'GREEN').length} icon={CheckCircle2} tone="success" />
        <StatCard label="Breached/Critical" value={applications.filter((a) => a.slaState === 'RED' || a.slaState === 'CRITICAL').length} icon={AlertTriangle} tone="danger" />
      </div>

      <div className="card overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Assigned Dossiers</h2>
          <span className="text-slate-500">Sorted by SLA Deadline</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="p-3">Application Number</th>
                <th className="p-3">Institution</th>
                <th className="p-3">Stage</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="table-row">
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${app.id}`} className="hover:underline">{app.applicationNumber}</Link>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{app.institution?.name}</td>
                  <td className="p-3 font-mono text-slate-600">{app.currentStage}</td>
                  <td className="p-3"><SlaBadge state={app.slaState} /></td>
                  <td className="p-3 text-right space-x-1">
                    <button onClick={() => handleClearScrutiny(app)} className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-[11px]">Clear</button>
                    <button onClick={() => openRevert(app)} className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold text-[11px]">Revert</button>
                    <button onClick={() => openStepUp(app, 'APPROVE')} className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-semibold text-[11px]">Approve</button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={5}><EmptyState icon={Inbox} title="Inbox empty" description="No dossiers assigned for scrutiny." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revert Modal */}
      {isRevertOpen && selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-5">
              <h3 className="text-lg font-bold">Issue Deficiency Revert</h3>
              <p className="text-xs text-amber-100 mt-1">{selectedApp.applicationNumber} • SLA will be paused</p>
            </div>
            <form onSubmit={handleRevertSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="label">Reason Code</label>
                <select value={reasonCode} onChange={(e) => setReasonCode(e.target.value)} className="input">
                  {REASON_CODES.map((r) => (
                    <option key={r.code} value={r.code}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Deficiency Checklist</label>
                <div className="space-y-2 mb-2">
                  {checklistItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-amber-50 border border-amber-200 rounded-lg text-slate-800">
                      <div className="flex items-center gap-2">
                        <CheckSquare className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="text-[11px]">{item}</span>
                      </div>
                      <button type="button" onClick={() => setChecklistItems(checklistItems.filter((_, i) => i !== idx))} className="text-slate-400 hover:text-rose-600 p-0.5">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input type="text" value={newItemText} onChange={(e) => setNewItemText(e.target.value)} placeholder="Add specific checklist item..." className="input" />
                  <button type="button" onClick={() => { if (newItemText.trim()) { setChecklistItems([...checklistItems, newItemText.trim()]); setNewItemText(''); } }} className="btn-secondary px-3">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              </div>
              <div>
                <label className="label">Officer Detailed Remarks</label>
                <textarea rows={2} value={revertRemarks} onChange={(e) => setRevertRemarks(e.target.value)} placeholder="Provide explicit instructions..." className="input" />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsRevertOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-danger flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4" /> Issue Revert & Pause SLA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
