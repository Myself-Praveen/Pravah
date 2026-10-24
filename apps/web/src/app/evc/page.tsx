'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import { CalendarCheck, Users, CheckCircle2, AlertTriangle, Clock, MapPin, Building2 } from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner, EmptyState } from '@/components/ui/EmptyState';

export default function EvcPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/applications?stage=EVC_SCHEDULED`)
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading EVC queue..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module C"
        title="EVC Inspection Queue & Scheduler"
        description="Transparent priority scoring, P/O/H mode selection, and committee allocation."
        badge="Regional Officer View"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard label="Pending EVC" value={applications.length} icon={Clock} tone="info" />
        <StatCard label="P-Mode (Physical)" value={applications.filter((a) => a.evcMode === 'PHYSICAL').length} icon={MapPin} tone="success" />
        <StatCard label="O-Mode (Online)" value={applications.filter((a) => a.evcMode === 'ONLINE').length} icon={Building2} tone="info" />
        <StatCard label="H-Mode (Hybrid)" value={applications.filter((a) => a.evcMode === 'HYBRID').length} icon={Users} tone="warning" />
      </div>

      <div className="card overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">EVC Queue (Priority Scored)</h2>
          <span className="text-slate-500">Sorted by Priority Score desc</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="p-3">Priority</th>
                <th className="p-3">Application Number</th>
                <th className="p-3">Institution</th>
                <th className="p-3">EVC Mode</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app, idx) => (
                <tr key={app.id} className="table-row">
                  <td className="p-3">
                    <span className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px]">{idx + 1}</span>
                  </td>
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${app.id}`} className="hover:underline">{app.applicationNumber}</Link>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{app.institution?.name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">{app.evcMode || 'P'}</span>
                  </td>
                  <td className="p-3"><SlaBadge state={app.slaState} /></td>
                  <td className="p-3 text-right">
                    <button className="btn-primary text-[11px] px-2.5 py-1">Schedule</button>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={6}><EmptyState icon={CalendarCheck} title="No EVC items" description="No inspections scheduled." /></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
