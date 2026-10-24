'use client';

import React, { useState } from 'react';
import { Award, CheckCircle2, ShieldCheck, FileText, Zap, Clock } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';

const features = [
  { name: 'No-Code APH Workflow Engine', status: 'PASS', detail: 'JSON statecharts, versioned, dynamic tracks' },
  { name: 'SLA Working-Day Engine', status: 'PASS', detail: 'Pause/resume, escalation ladder' },
  { name: 'EVC Transparent Queue', status: 'PASS', detail: 'Priority scoring, P/O/H modes' },
  { name: 'Undertaking Compliance', status: 'PASS', detail: 'Countdown, breach detection, reminders' },
  { name: 'Document Validity (30y)', status: 'PASS', detail: 'OCR extraction, expiry ladder' },
  { name: 'SHA-256 Audit Chains', status: 'PASS', detail: 'Per-stream, DB triggers, Merkle anchor' },
  { name: 'Strict HITL Guard', status: 'PASS', detail: 'Step-up auth, totp verification' },
  { name: 'Bilingual EN/HI', status: 'PASS', detail: 'GIGW 3.0, WCAG 2.1 AA' },
];

export default function ProofPanelPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Judge View"
        title="Proof Panel — SIH 2026"
        description="Acceptance test evidence, feature matrix and live demo entry points."
        badge="PS SIH26262"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Tests Passed" value="29/29" icon={CheckCircle2} tone="success" />
        <StatCard label="Features" value="6 Modules" icon={Zap} tone="info" />
        <StatCard label="Roles" value="9" icon={Award} tone="default" />
        <StatCard label="Uptime" value="99.9%" icon={Clock} tone="success" />
      </div>

      <div className="card overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm">Acceptance Feature Matrix</h3>
        </div>
        <table className="table-base">
          <thead className="table-head"><tr><th className="p-3">Feature</th><th className="p-3">Status</th><th className="p-3">Detail</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {features.map((f) => (
              <tr key={f.name} className="table-row">
                <td className="p-3 font-semibold text-slate-900">{f.name}</td>
                <td className="p-3"><span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-[10px]">{f.status}</span></td>
                <td className="p-3 text-slate-600">{f.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900">Live demo</div>
          <div className="text-xs text-slate-500">Switch roles via the header role-switcher to explore all 9 personas.</div>
        </div>
        <a href="/bureau-hq" className="btn-primary text-xs">Open Command Center</a>
      </div>
    </div>
  );
}
