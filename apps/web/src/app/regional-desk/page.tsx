'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import { Building2, Users, CheckCircle2, AlertOctagon, ArrowRight, TrendingUp, FileText, UserCheck } from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/EmptyState';

export default function RegionalDeskPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/applications?regionId=r-sro`)
      .then((res) => res.json())
      .then((data) => setApplications(data.applications || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner label="Loading regional desk..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Regional Operations"
        title="Southern Regional Office (SRO) Desk"
        description="Regional Officer command interface for queue monitoring, EVC inspection coordination, and officer workload rebalancing."
        badge="SRO Chennai • Tamil Nadu, Puducherry"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Regional Active Load" value="42 Files" hint="30 On Track (Green)" icon={Building2} tone="info" />
        <StatCard label="Scrutiny Officers" value="3 Active" hint="Workload Balanced (Gini: 0.12)" icon={Users} tone="success" />
        <StatCard label="Level 1 Escalations" value="2 Pending" hint="Requires RO Remarks" icon={AlertOctagon} tone="warning" />
      </div>

      <div className="card overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Regional Jurisdictional Dossiers</h2>
          <span className="text-slate-500">Sorted by Prescribed SLA Deadline</span>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="p-3">Application Number</th>
                <th className="p-3">Institution Name</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Assigned Officer</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.slice(0, 8).map((app) => (
                <tr key={app.id} className="table-row">
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${app.id}`} className="hover:underline">{app.applicationNumber}</Link>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{app.institution?.name}</td>
                  <td className="p-3 font-mono text-slate-600">{app.currentStage}</td>
                  <td className="p-3 text-slate-700">{app.assignedOfficer?.name || 'P. Meenakshi'}</td>
                  <td className="p-3"><SlaBadge state={app.slaState} /></td>
                  <td className="p-3 text-right">
                    <Link href={`/applications/${app.id}`} className="btn-secondary text-[11px] px-2.5 py-1">Inspect Dossier</Link>
                  </td>
                </tr>
              ))}
              {applications.length === 0 && (
                <tr><td colSpan={6}><div className="p-8 text-center text-slate-400">No regional applications loaded.</div></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
