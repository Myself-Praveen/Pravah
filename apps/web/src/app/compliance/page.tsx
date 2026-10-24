'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import { FileCheck, AlertTriangle, Clock, CheckCircle2, ShieldAlert, BellRing } from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/EmptyState';

export default function CompliancePage() {
  const [undertakings, setUndertakings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/compliance/undertakings`)
      .then((res) => res.json())
      .then((data) => setUndertakings(data.undertakings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading compliance ledger..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module D"
        title="Undertaking & Compliance Ledger"
        description="Countdown timers, breach detection, reminder escalations and HITL approval."
        badge="Bureau Officer View"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Active Undertakings" value={undertakings.length || 6} icon={FileCheck} tone="info" />
        <StatCard label="On Track" value="4" icon={CheckCircle2} tone="success" />
        <StatCard label="At Risk (<30d)" value="1" icon={Clock} tone="warning" />
        <StatCard label="Breached" value="1" icon={AlertTriangle} tone="danger" />
      </div>

      <div className="card overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Compliance Items</h2>
          <div className="flex items-center gap-2">
            <BellRing className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-slate-500">Auto-reminder ladder active</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="p-3">Institution</th>
                <th className="p-3">Undertaking Type</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Days Remaining</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(undertakings.length ? undertakings : [
                { id: '1', institution: { name: 'Apex Institute of Technology' }, type: 'Land Document', dueDate: '2026-06-30', daysRemaining: 45, status: 'ON_TRACK' },
                { id: '2', institution: { name: 'Deccan College of Engineering' }, type: 'Faculty Recruitment', dueDate: '2026-05-15', daysRemaining: 12, status: 'AT_RISK' },
                { id: '3', institution: { name: 'Frontier Institute of Pharma' }, type: 'Building Completion', dueDate: '2026-04-20', daysRemaining: -8, status: 'BREACHED' },
              ]).map((u: any) => (
                <tr key={u.id} className="table-row">
                  <td className="p-3 font-semibold text-slate-800">{u.institution?.name}</td>
                  <td className="p-3 font-mono text-slate-600">{u.type}</td>
                  <td className="p-3 text-slate-600">{u.dueDate}</td>
                  <td className="p-3 font-bold text-slate-900">{u.daysRemaining}d</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      u.status === 'BREACHED' ? 'bg-rose-100 text-rose-800 border-rose-200' :
                      u.status === 'AT_RISK' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      'bg-emerald-100 text-emerald-800 border-emerald-200'
                    }`}>{u.status}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="btn-secondary text-[11px] px-2.5 py-1">Inspect</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
