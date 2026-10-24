'use client';

import React, { useState } from 'react';
import { FileBarChart, Download, Calendar, Filter, FileText } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';

const reports = [
  { id: 'R1', name: 'Regional Pendency Summary', desc: 'File counts by region, stage and SLA state.', format: 'PDF/CSV' },
  { id: 'R2', name: 'SLA Compliance Report', desc: 'On-time vs breached per stage and officer.', format: 'PDF/CSV' },
  { id: 'R3', name: 'EVC Inspection Report', desc: 'Scheduled/completed inspections, modes, outcomes.', format: 'PDF' },
  { id: 'R4', name: 'Compliance Breach Report', desc: 'Undertaking breaches, reminders, escalations.', format: 'PDF/CSV' },
  { id: 'R5', name: 'Audit Summary', desc: 'Hash-chain integrity and anomaly summary.', format: 'PDF' },
  { id: 'R6', name: 'Institution Status Report', desc: 'Per-institution application lifecycle.', format: 'PDF/CSV' },
];

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module F"
        title="Statutory Reports (R1–R6)"
        description="Generate, schedule and export statutory reports for AICTE compliance."
        badge="Bureau Head View"
        actions={
          <button className="btn-secondary text-xs"><Calendar className="w-3.5 h-3.5" /> Schedule</button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Reports Available" value="6" icon={FileBarChart} tone="info" />
        <StatCard label="Scheduled" value="3" icon={Calendar} tone="success" />
        <StatCard label="Last Generated" value="Today" icon={FileText} tone="default" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r) => (
          <div key={r.id} className="card p-5 hover:shadow-elevated transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <span className="text-lg font-black text-aicte-blue">{r.id}</span>
              <span className="badge bg-slate-100 text-slate-600 border-slate-200">{r.format}</span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">{r.name}</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{r.desc}</p>
            <button className="btn-primary text-xs mt-4 w-full"><Download className="w-3.5 h-3.5" /> Generate</button>
          </div>
        ))}
      </div>
    </div>
  );
}
