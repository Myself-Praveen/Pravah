'use client';

import React, { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';
import { Sliders, FileText, GitBranch, AlertTriangle, Save, Plus, Trash2, Settings, Layers } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/EmptyState';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'workflow' | 'sla' | 'fees' | 'calendar'>('workflow');
  const [loading, setLoading] = useState(false);

  const tabs = [
    { id: 'workflow', label: 'Workflow Configurator', icon: GitBranch },
    { id: 'sla', label: 'SLA Matrix', icon: ClockIcon },
    { id: 'fees', label: 'Fee Structure', icon: FileText },
    { id: 'calendar', label: 'Academic Calendar', icon: CalendarIcon },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module A"
        title="Policy Configurator (No-Code APH)"
        description="Versioned JSON statecharts, SLA matrices, fee structures and academic calendar — annual APH changes without code deploys."
        badge="System Admin View"
        actions={
          <button className="btn-primary"><Save className="w-4 h-4" /> Publish Version</button>
        }
      />

      <div className="flex gap-2 border-b border-slate-200 overflow-x-auto no-scrollbar">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id ? 'border-aicte-accent text-aicte-accent' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'workflow' && (
        <div className="card p-6 space-y-4">
          <h3 className="section-title">APH 2026-27 Workflow States</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {['SUBMITTED', 'SCRUTINY', 'REVERTED', 'EVC_SCHEDULED', 'EVC_COMPLETED', 'SAC_SHC_REVIEW', 'COMPETENT_AUTHORITY_REVIEW', 'APPROVED', 'REJECTED'].map((s) => (
              <div key={s} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-800">{s}</span>
                <Settings className="w-3.5 h-3.5 text-slate-400" />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'sla' && (
        <div className="card p-6">
          <h3 className="section-title mb-3">SLA Matrix (Working Days)</h3>
          <table className="table-base">
            <thead className="table-head"><tr><th className="p-2">Stage</th><th className="p-2">SLA Days</th><th className="p-2">Escalation L1</th><th className="p-2">Escalation L2</th></tr></thead>
            <tbody>
              {[
                { stage: 'Scrutiny', days: 7, l1: 5, l2: 7 },
                { stage: 'EVC Scheduling', days: 14, l1: 10, l2: 14 },
                { stage: 'SAC/SHC Review', days: 10, l1: 7, l2: 10 },
                { stage: 'Competent Authority', days: 5, l1: 3, l2: 5 },
              ].map((r) => (
                <tr key={r.stage} className="table-row">
                  <td className="p-2 font-mono text-slate-800">{r.stage}</td>
                  <td className="p-2">{r.days}</td>
                  <td className="p-2">{r.l1}d</td>
                  <td className="p-2">{r.l2}d</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="card p-6 space-y-3">
          <h3 className="section-title">Fee Structure</h3>
          <p className="text-xs text-slate-500">Configurable fee slabs per institution category and program type.</p>
          <button className="btn-secondary text-xs"><Plus className="w-3.5 h-3.5" /> Add Slab</button>
        </div>
      )}

      {activeTab === 'calendar' && (
        <div className="card p-6 space-y-3">
          <h3 className="section-title">Academic Calendar</h3>
          <p className="text-xs text-slate-500">Working-day exclusions, holidays and APH milestones.</p>
          <button className="btn-secondary text-xs"><Plus className="w-3.5 h-3.5" /> Add Holiday</button>
        </div>
      )}
    </div>
  );
}

function ClockIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>; }
function CalendarIcon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>; }
