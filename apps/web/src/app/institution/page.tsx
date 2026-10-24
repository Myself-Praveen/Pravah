'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { School, FileText, AlertCircle, CheckCircle2, Clock, Upload, ArrowRight } from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';

export default function InstitutionPage() {
  const [status] = useState('UNDER_SCRUTINY');
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module E"
        title="Institution Portal — Status Tracker"
        description="Real-time application status, deficiency checklist, document upload and SLA countdown."
        badge="Apex Institute of Technology • APH2026-SRO-86081"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Current Stage" value="Scrutiny" icon={FileText} tone="info" />
        <StatCard label="Days Remaining" value="4" icon={Clock} tone="warning" />
        <StatCard label="Deficiencies" value="2" icon={AlertCircle} tone="danger" />
        <StatCard label="Documents" value="18" icon={CheckCircle2} tone="success" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 space-y-4">
          <h3 className="section-title">Application Timeline</h3>
          <ol className="relative border-l border-slate-200 ml-3 space-y-4">
            {[
              { stage: 'Submitted', date: '2026-04-02', done: true },
              { stage: 'Scrutiny', date: '2026-04-08', done: true },
              { stage: 'Revert Issued', date: '2026-04-12', done: true },
              { stage: 'Resubmission', date: '2026-04-18', done: false },
              { stage: 'EVC Inspection', date: '—', done: false },
            ].map((s, i) => (
              <li key={i} className="ml-4">
                <div className={`absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border-2 ${s.done ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-300'}`} />
                <div className="text-xs font-bold text-slate-900">{s.stage}</div>
                <div className="text-[10px] text-slate-500">{s.date}</div>
              </li>
            ))}
          </ol>
        </div>

        <div className="card p-5 space-y-4">
          <h3 className="section-title">Deficiency Checklist</h3>
          <ul className="space-y-2 text-xs">
            {[
              'Registered Lease Deed missing demarcated survey boundaries',
              'Faculty cadre ratio shortfall in Computer Science department',
            ].map((d, i) => (
              <li key={i} className="flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                <span className="text-slate-800">{d}</span>
              </li>
            ))}
          </ul>
          <div className="pt-2 border-t border-slate-100">
            <button className="btn-primary w-full flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Upload Corrected Documents
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5 flex items-center justify-between">
        <div>
          <div className="text-sm font-bold text-slate-900">Need help?</div>
          <div className="text-xs text-slate-500">Contact your Regional Officer for clarification.</div>
        </div>
        <Link href="/compliance" className="btn-secondary text-xs">View Compliance Ledger <ArrowRight className="w-3 h-3" /></Link>
      </div>
    </div>
  );
}
