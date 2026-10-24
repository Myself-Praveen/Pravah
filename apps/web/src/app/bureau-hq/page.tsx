'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { API_BASE } from '@/lib/api';
import {
  AlertOctagon, FileWarning, Hourglass, TrendingDown, CheckCircle2,
  ChevronRight, Filter, Flame, Building, ArrowUpRight, RefreshCw,
  LayoutDashboard,
} from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';
import { PageHeader } from '@/components/ui/PageHeader';
import { StatCard } from '@/components/ui/StatCard';
import { LoadingSpinner } from '@/components/ui/EmptyState';

export default function BureauHqPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'RED_CRITICAL'>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analytics/command-center`);
      const json = await res.json();
      setData(json);
    } catch {
      setData({
        regionSummary: [
          { code: 'SRO', name: 'Southern Regional Office (Chennai)', total: 42, green: 30, amber: 6, red: 4, critical: 2, health: 'CRITICAL' },
          { code: 'SWRO', name: 'South Western (Bengaluru)', total: 28, green: 22, amber: 4, red: 2, critical: 0, health: 'NEEDS_ATTENTION' },
          { code: 'WRO', name: 'Western (Mumbai)', total: 35, green: 25, amber: 5, red: 3, critical: 2, health: 'CRITICAL' },
          { code: 'SCRO', name: 'South Central (Hyderabad)', total: 19, green: 16, amber: 2, red: 1, critical: 0, health: 'GOOD' },
          { code: 'NRO', name: 'Northern (Kanpur)', total: 24, green: 18, amber: 3, red: 3, critical: 0, health: 'NEEDS_ATTENTION' },
          { code: 'NWRO', name: 'North Western (Chandigarh)', total: 22, green: 19, amber: 2, red: 1, critical: 0, health: 'GOOD' },
          { code: 'CRO', name: 'Central (Bhopal)', total: 16, green: 14, amber: 1, red: 1, critical: 0, health: 'GOOD' },
          { code: 'ERO', name: 'Eastern (Kolkata)', total: 18, green: 14, amber: 3, red: 1, critical: 0, health: 'GOOD' },
          { code: 'NERO', name: 'North Eastern (Guwahati)', total: 9, green: 8, amber: 1, red: 0, critical: 0, health: 'GOOD' },
        ],
        bottleneckRanking: [
          { stage: 'SCRUTINY', avgDurationDays: 6.8, volume: 48, bottleneckIndex: 88.4 },
          { stage: 'EVC_SCHEDULED', avgDurationDays: 14.2, volume: 22, bottleneckIndex: 82.1 },
          { stage: 'SAC_SHC_REVIEW', avgDurationDays: 9.5, volume: 14, bottleneckIndex: 74.0 },
          { stage: 'COMPETENT_AUTHORITY_REVIEW', avgDurationDays: 4.1, volume: 18, bottleneckIndex: 45.2 },
        ],
        redCriticalFeed: [
          { id: '1', applicationNumber: 'APH2026-WRO-86084', institution: { name: 'Frontier Institute of Pharmaceutical Sciences' }, currentStage: 'SCRUTINY', slaState: 'CRITICAL', stageEnteredAt: new Date(Date.now() - 10 * 86400000).toISOString(), escalationLevel: 2 },
          { id: '2', applicationNumber: 'APH2026-SWRO-86082', institution: { name: 'Deccan College of Engineering & Research' }, currentStage: 'SAC_SHC_REVIEW', slaState: 'RED', stageEnteredAt: new Date(Date.now() - 11 * 86400000).toISOString(), escalationLevel: 1 },
          { id: '3', applicationNumber: 'APH2026-SRO-86081', institution: { name: 'Chennai Polytechnic & Technical Campus' }, currentStage: 'SCRUTINY', slaState: 'AMBER', stageEnteredAt: new Date(Date.now() - 6 * 86400000).toISOString(), escalationLevel: 0 },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  if (loading || !data) return <LoadingSpinner label="Loading national command center..." />;

  const totalApps = data.regionSummary.reduce((a: number, r: any) => a + r.total, 0);
  const totalCritical = data.regionSummary.reduce((a: number, r: any) => a + r.critical, 0);
  const totalRed = data.regionSummary.reduce((a: number, r: any) => a + r.red, 0);
  const totalGreen = data.regionSummary.reduce((a: number, r: any) => a + r.green, 0);

  const filteredFeed = filter === 'RED_CRITICAL'
    ? data.redCriticalFeed.filter((i: any) => i.slaState === 'RED' || i.slaState === 'CRITICAL')
    : data.redCriticalFeed;

  const healthColor = (h: string) =>
    h === 'CRITICAL' ? 'bg-rose-100 text-rose-800 border-rose-200' :
    h === 'NEEDS_ATTENTION' ? 'bg-amber-100 text-amber-800 border-amber-200' :
    'bg-emerald-100 text-emerald-800 border-emerald-200';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Module B"
        title="National Command Center"
        description="Real-time pendency, regional health, bottleneck intelligence and red/critical escalation feed across 9 regional offices."
        badge="Bureau Head View"
        actions={
          <button onClick={fetchData} className="btn-secondary">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Active Files" value={totalApps} icon={FileWarning} tone="info" />
        <StatCard label="On Schedule (Green)" value={totalGreen} icon={CheckCircle2} tone="success" />
        <StatCard label="SLA Breached (Red)" value={totalRed} icon={AlertOctagon} tone="danger" />
        <StatCard label="Critical Delay" value={totalCritical} icon={Flame} tone="danger" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regions */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="section-title">Regional Health Matrix</h2>
            <span className="text-[11px] text-slate-400">9 Regional Offices</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.regionSummary.map((r: any) => {
              const pct = r.total ? Math.round((r.green / r.total) * 100) : 0;
              return (
                <div key={r.code} className="card p-4 hover:shadow-elevated transition-shadow">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">{r.name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{r.code}</div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${healthColor(r.health)}`}>{r.health.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] mb-2">
                    <span className="text-slate-600"><strong className="text-slate-900">{r.total}</strong> total</span>
                    <span className="text-emerald-600">{r.green}G</span>
                    <span className="text-amber-600">{r.amber}A</span>
                    <span className="text-rose-600">{r.red}R</span>
                    {r.critical > 0 && <span className="text-red-700 font-bold">{r.critical}C</span>}
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottlenecks */}
        <div className="card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <TrendingDown className="w-4 h-4 text-amber-600" />
            <h2 className="section-title">Bottleneck Ranking</h2>
          </div>
          <div className="space-y-4">
            {data.bottleneckRanking.map((b: any) => (
              <div key={b.stage} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-800">{b.stage}</span>
                  <span className="text-[10px] text-slate-500">idx {b.bottleneckIndex}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${b.bottleneckIndex > 80 ? 'bg-rose-500' : b.bottleneckIndex > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(100, b.bottleneckIndex)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Avg {b.avgDurationDays} days</span>
                  <span>{b.volume} files</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Escalation feed */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">High-Priority Escalation Feed</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Sorted by Ageing</span>
            <div className="flex space-x-1 bg-slate-200 p-0.5 rounded-lg text-xs font-bold">
              {(['ALL', 'RED_CRITICAL'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2.5 py-1 rounded-md transition-all ${filter === f ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {f === 'ALL' ? 'All' : 'Red & Critical'}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-base">
            <thead className="table-head">
              <tr>
                <th className="p-3">Application Number</th>
                <th className="p-3">Institution Name</th>
                <th className="p-3">Current Stage</th>
                <th className="p-3">SLA Status</th>
                <th className="p-3">Escalation Level</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFeed.map((item: any) => (
                <tr key={item.id} className="table-row">
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${item.id}`} className="hover:underline flex items-center gap-1">
                      {item.applicationNumber} <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{item.institution?.name}</td>
                  <td className="p-3 font-mono text-slate-600">{item.currentStage}</td>
                  <td className="p-3"><SlaBadge state={item.slaState} /></td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Level {item.escalationLevel}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link href={`/applications/${item.id}`} className="btn-primary text-xs px-2.5 py-1">
                      View Dossier <ChevronRight className="w-3 h-3" />
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
