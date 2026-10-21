'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
  TrendingUp,
  FileText,
  UserCheck,
} from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';

export default function RegionalDeskPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/v1/applications?regionId=r-sro')
      .then(res => res.json())
      .then(data => setApplications(data.applications || []))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Regional Operations
            </span>
            <span className="text-xs text-slate-400">• SRO Chennai (Tamil Nadu, Puducherry)</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Southern Regional Office (SRO) Desk
          </h1>
          <p className="text-xs text-slate-500">
            Regional Officer command interface for queue monitoring, EVC inspection coordination, and officer workload rebalancing.
          </p>
        </div>
      </div>

      {/* RO Stat Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Regional Active Load</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">42 Files</div>
            <span className="text-[11px] text-emerald-600 font-medium">30 On Track (Green)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Scrutiny Officers</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">3 Active</div>
            <span className="text-[11px] text-indigo-600 font-medium">Workload Balanced (Gini: 0.12)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-amber-700 font-bold uppercase tracking-wider">Level 1 Escalations</span>
            <div className="text-2xl font-black text-amber-800 mt-0.5">2 Pending</div>
            <span className="text-[11px] text-amber-600 font-medium">Requires RO Remarks</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Regional Queue Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-sm">Regional Jurisdictional Dossiers</h2>
          <span className="text-slate-500">Sorted by Prescribed SLA Deadline</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
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
                <tr key={app.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${app.id}`} className="hover:underline">
                      {app.applicationNumber}
                    </Link>
                  </td>
                  <td className="p-3 font-semibold text-slate-800">{app.institution?.name}</td>
                  <td className="p-3 font-mono text-slate-600">{app.currentStage}</td>
                  <td className="p-3 text-slate-700">{app.assignedOfficer?.name || 'P. Meenakshi'}</td>
                  <td className="p-3">
                    <SlaBadge state={app.slaState} />
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/applications/${app.id}`}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px]"
                    >
                      Inspect Dossier
                    </Link>
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
