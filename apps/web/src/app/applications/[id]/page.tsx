'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { API_BASE } from '@/lib/api';
import { FileText, Clock, Building2, User, ShieldCheck, History, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { StepUpModal } from '@/components/StepUpModal';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/EmptyState';

export default function ApplicationDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stepUpOpen, setStepUpOpen] = useState(false);
  const [stepUpAction, setStepUpAction] = useState('APPROVE');

  useEffect(() => {
    fetch(`${API_BASE}/applications/${id}`)
      .then((res) => res.json())
      .then((data) => setApp(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <LoadingSpinner label="Loading dossier..." />;
  if (!app) return <div className="p-8 text-center text-slate-500">Application not found.</div>;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dossier"
        title={app.applicationNumber || id}
        description={app.institution?.name}
        badge={app.currentStage}
        actions={<SlaBadge state={app.slaState} />}
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Stage" value={app.currentStage} icon={FileText} tone="info" />
        <StatCard label="SLA Status" value={app.slaState} icon={Clock} tone={app.slaState === 'GREEN' ? 'success' : app.slaState === 'AMBER' ? 'warning' : 'danger'} />
        <StatCard label="Institution" value={app.institution?.name?.slice(0, 18) || '—'} icon={Building2} tone="info" />
        <StatCard label="Officer" value={app.assignedOfficer?.name || 'Unassigned'} icon={User} tone="default" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-5 space-y-3">
          <h3 className="section-title">Dossier Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div><dt className="text-slate-500">Application Number</dt><dd className="font-mono font-bold text-slate-900">{app.applicationNumber}</dd></div>
            <div><dt className="text-slate-500">Current Stage</dt><dd className="font-mono text-slate-900">{app.currentStage}</dd></div>
            <div><dt className="text-slate-500">Stage Entered</dt><dd className="text-slate-900">{app.stageEnteredAt ? new Date(app.stageEnteredAt).toLocaleString() : '—'}</dd></div>
            <div><dt className="text-slate-500">Escalation Level</dt><dd className="text-slate-900">{app.escalationLevel ?? 0}</dd></div>
          </dl>
        </div>

        <div className="card p-5 space-y-3">
          <h3 className="section-title">Actions</h3>
          <button onClick={() => { setStepUpAction('APPROVE'); setStepUpOpen(true); }} className="btn-primary w-full"><ShieldCheck className="w-4 h-4" /> Approve (HITL)</button>
          <button onClick={() => { setStepUpAction('CLEAR'); setStepUpOpen(true); }} className="btn-secondary w-full"><CheckCircle2 className="w-4 h-4" /> Clear Scrutiny</button>
          <button onClick={() => { setStepUpAction('REJECT'); setStepUpOpen(true); }} className="btn-danger w-full"><AlertTriangle className="w-4 h-4" /> Reject</button>
        </div>
      </div>

      <div className="card p-5">
        <h3 className="section-title mb-3 flex items-center gap-2"><History className="w-3.5 h-3.5" /> Audit Trail</h3>
        <div className="text-xs text-slate-500">Hash-chained events for this application are viewable in the Audit Trail module.</div>
        <Link href="/audit" className="btn-secondary text-xs mt-3 inline-flex">Open Audit Trail</Link>
      </div>

      {app && (
        <StepUpModal
          isOpen={stepUpOpen}
          onClose={() => setStepUpOpen(false)}
          onConfirm={async (stepUp) => {
            try {
              await fetch(`${API_BASE}/applications/${id}/transition`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: stepUpAction, actorRole: 'SCRUTINY_OFFICER', actorType: 'USER', totpCode: stepUp.totpCode, totpVerified: stepUp.totpVerified, remarks: stepUp.remarks }),
              });
              setStepUpOpen(false);
            } catch {}
          }}
          actionTitle={stepUpAction}
          applicationNumber={app.applicationNumber || id}
        />
      )}
    </div>
  );
}
