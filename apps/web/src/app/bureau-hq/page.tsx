'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  AlertOctagon,
  FileWarning,
  Hourglass,
  TrendingDown,
  CheckCircle2,
  ChevronRight,
  Filter,
  Flame,
  Building,
  ArrowUpRight,
  RefreshCw,
} from 'lucide-react';
import { SlaBadge } from '@/components/SlaBadge';

export default function BureauHqPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'RED_CRITICAL'>('ALL');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/analytics/command-center');
      const json = await res.json();
      setData(json);
    } catch {
      // Mock fallback if API not ready yet
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
          {
            id: '1',
            applicationNumber: 'APH2026-WRO-86084',
            institution: { name: 'Frontier Institute of Pharmaceutical Sciences' },
            currentStage: 'SCRUTINY',
            slaState: 'CRITICAL',
            stageEnteredAt: new Date(Date.now() - 10 * 86400000).toISOString(),
            escalationLevel: 2,
          },
          {
            id: '2',
            applicationNumber: 'APH2026-SWRO-86082',
            institution: { name: 'Deccan College of Engineering & Research' },
            currentStage: 'SAC_SHC_REVIEW',
            slaState: 'RED',
            stageEnteredAt: new Date(Date.now() - 11 * 86400000).toISOString(),
            escalationLevel: 1,
          },
          {
            id: '3',
            applicationNumber: 'APH2026-SRO-86081',
            institution: { name: 'Chennai Polytechnic & Technical Campus' },
            currentStage: 'SCRUTINY',
            slaState: 'AMBER',
            stageEnteredAt: new Date(Date.now() - 6 * 86400000).toISOString(),
            escalationLevel: 0,
          },
        ],
        expiredDocumentsCount: 2,
        breachedUndertakingsCount: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('time-travel-updated', fetchData);
    return () => window.removeEventListener('time-travel-updated', fetchData);
  }, []);

  const totalApps = data?.regionSummary?.reduce((acc: number, r: any) => acc + r.total, 0) || 213;
  const criticalApps = data?.regionSummary?.reduce((acc: number, r: any) => acc + r.critical, 0) || 4;
  const redApps = data?.regionSummary?.reduce((acc: number, r: any) => acc + r.red, 0) || 15;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              National Oversight
            </span>
            <span className="text-xs text-slate-400">• Real-Time Pendency & Vigilance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Bureau HQ Command Center
          </h1>
          <p className="text-xs text-slate-500">
            Unified single-pane monitoring across all 9 AICTE Regional Offices. Zero spreadsheets, zero manual follow-up calls.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter(filter === 'ALL' ? 'RED_CRITICAL' : 'ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all ${
              filter === 'RED_CRITICAL'
                ? 'bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-rose-600" />
            <span>Red & Critical Only ({redApps + criticalApps})</span>
          </button>
          <button
            onClick={fetchData}
            className="p-1.5 bg-white border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
            title="Refresh command center"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Files</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalApps}</div>
            <span className="text-[11px] text-emerald-600 font-medium">9 Regions Active</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
            <Building className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider">SLA Breached / Critical</span>
            <div className="text-2xl font-black text-rose-700 mt-0.5">{redApps + criticalApps}</div>
            <span className="text-[11px] text-rose-500 font-medium">{criticalApps} Critical (Level 2)</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertOctagon className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">Breached Undertakings</span>
            <div className="text-2xl font-black text-amber-800 mt-0.5">{data?.breachedUndertakingsCount || 1}</div>
            <span className="text-[11px] text-amber-600 font-medium">In Show-Cause Queue</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
            <Hourglass className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Follow-Ups Avoided</span>
            <div className="text-2xl font-black text-emerald-800 mt-0.5">328</div>
            <span className="text-[11px] text-emerald-600 font-medium">Automated Tiered Alerts</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Grid: Regional Matrix + Bottleneck Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 9 Regional Offices Breakdown */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">AICTE 9 Regional Offices Health Matrix</h2>
              <p className="text-xs text-slate-500">Live operational SLA distribution per statutory jurisdiction</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">All 9 Offices Monitored</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data?.regionSummary?.map((r: any) => (
              <div
                key={r.code}
                className={`p-3 rounded-xl border transition-all ${
                  r.critical > 0
                    ? 'border-red-300 bg-red-50/40'
                    : r.red > 0
                    ? 'border-rose-200 bg-rose-50/30'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-sm text-slate-900">{r.code}</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      r.critical > 0 ? 'bg-red-600 text-white' : r.red > 0 ? 'bg-rose-500 text-white' : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {r.health}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 truncate font-medium">{r.name}</div>
                <div className="mt-2.5 flex items-center justify-between text-xs border-t border-slate-200/60 pt-2">
                  <span className="text-slate-500">Files: <strong>{r.total}</strong></span>
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="text-emerald-700 font-bold">{r.green}G</span>
                    <span className="text-amber-700 font-bold">{r.amber}A</span>
                    <span className="text-rose-700 font-bold">{r.red}R</span>
                    {r.critical > 0 && <span className="text-red-700 font-extrabold">{r.critical}C</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Stage Bottleneck Index */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Stage Bottleneck Ranking</h2>
            <p className="text-xs text-slate-500">Mean SLA consumed % × File volume</p>
          </div>

          <div className="space-y-3">
            {data?.bottleneckRanking?.map((b: any, idx: number) => (
              <div key={b.stage} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800">
                    #{idx + 1} {b.stage}
                  </span>
                  <span className="font-mono text-xs font-semibold text-indigo-700">
                    Index: {b.bottleneckIndex}
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      b.bottleneckIndex > 80 ? 'bg-rose-500' : b.bottleneckIndex > 70 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, b.bottleneckIndex)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>Avg Duration: {b.avgDurationDays} days</span>
                  <span>{b.volume} files in stage</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Red & Critical Live Escalation Feed */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-slate-900">
              High-Priority Escalation Feed (Red & Critical Files Requiring Attention)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Sorted by Ageing</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
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
              {data?.redCriticalFeed?.map((item: any) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-mono font-bold text-indigo-700">
                    <Link href={`/applications/${item.id}`} className="hover:underline flex items-center gap-1">
                      {item.applicationNumber}
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{item.institution?.name}</td>
                  <td className="p-3 font-mono text-slate-600">{item.currentStage}</td>
                  <td className="p-3">
                    <SlaBadge state={item.slaState} />
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                      Level {item.escalationLevel}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link
                      href={`/applications/${item.id}`}
                      className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-semibold inline-flex items-center gap-1"
                    >
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
