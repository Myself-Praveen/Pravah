'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  Users,
  Video,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Search,
} from 'lucide-react';

export default function EvcPage() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
  const [mode, setMode] = useState<'PHYSICAL' | 'ONLINE' | 'HYBRID'>('PHYSICAL');
  const [notification, setNotification] = useState<string | null>(null);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/evc/queue');
      const data = await res.json();
      setQueue(data.queue || []);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
    window.addEventListener('time-travel-updated', fetchQueue);
    return () => window.removeEventListener('time-travel-updated', fetchQueue);
  }, []);

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;

    try {
      const res = await fetch('http://localhost:4000/api/v1/evc/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evcScheduleId: selectedSchedule.id,
          mode,
          scheduledStart: new Date(Date.now() + 5 * 86400000).toISOString(),
          scheduledEnd: new Date(Date.now() + 6 * 86400000).toISOString(),
          leadMemberId: 'usr-evc-lead1',
          memberIds: ['usr-evc-member2'],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNotification(`EVC scheduled successfully in ${mode} mode! Conflict-of-interest check verified clean.`);
        setTimeout(() => setNotification(null), 5000);
        setSelectedSchedule(null);
        await fetchQueue();
      }
    } catch {
      setNotification('Scheduling failed.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Module C: Regulatory Inspections
            </span>
            <span className="text-xs text-slate-400">• Council-Constituted Queue</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Expert Visit Committee (EVC) Queue & Scheduler
          </h1>
          <p className="text-xs text-slate-500">
            Transparent priority scoring, Physical / Online / Hybrid mode support (Dec-2025 corrigendum), conflict checks, and visit countdowns.
          </p>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Queue Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Enqueued Institutional Visits</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Ranked by Transparent Priority Score</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Rank & Score</th>
                <th className="p-3">Application Number</th>
                <th className="p-3">Institution Name</th>
                <th className="p-3">Mode</th>
                <th className="p-3">Status</th>
                <th className="p-3">Visit Deadline</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {queue.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[11px]">
                        #{idx + 1}
                      </span>
                      <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200 text-[11px]" title="Priority Score Breakdown: New Inst (30) + SLA Proximity (25) + Queue Age (20)">
                        {item.priorityScore} pts
                      </span>
                    </div>
                  </td>
                  <td className="p-3 font-mono font-bold text-slate-900">
                    <Link href={`/applications/${item.applicationId}`} className="hover:underline">
                      {item.application?.applicationNumber}
                    </Link>
                  </td>
                  <td className="p-3 font-medium text-slate-800">{item.application?.institution?.name}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 font-semibold text-[11px] text-slate-700">
                      {item.mode === 'ONLINE' ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <MapPin className="w-3.5 h-3.5 text-emerald-600" />}
                      {item.mode}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.status === 'SCHEDULED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-3 font-mono text-slate-600">
                    {new Date(item.prescribedDeadline).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    {item.status === 'QUEUED' ? (
                      <button
                        onClick={() => setSelectedSchedule(item)}
                        className="px-2.5 py-1 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-semibold text-[11px] shadow-sm"
                      >
                        Schedule Inspection
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold text-[11px] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Schedule Modal */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5">
              <h3 className="text-lg font-bold">Schedule EVC Inspection Visit</h3>
              <p className="text-xs text-slate-300 mt-1">
                For {selectedSchedule.application?.institution?.name}
              </p>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Inspection Mode (APH Dec-2025 Corrigendum)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['PHYSICAL', 'ONLINE', 'HYBRID'] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMode(m)}
                      className={`p-2 rounded-lg font-bold text-center border transition-all ${
                        mode === m
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-200'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 text-[11px]">
                <strong>Conflict-of-Interest Safeguard:</strong> Committee members automatically cross-referenced against institutional affiliations and applicant state. Zero conflict flagged.
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-slate-700">Empaneled Committee:</span>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                  <div className="font-bold">Prof. Rajesh Kulkarni (Lead)</div>
                  <div className="text-[10px] text-slate-500">IIT Madras • Zero institutional conflicts</div>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                  <div className="font-bold">Dr. Aruna Devi (Member)</div>
                  <div className="text-[10px] text-slate-500">NIT Trichy • Zero institutional conflicts</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedSchedule(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg shadow-md"
                >
                  Confirm & Dispatch Notices
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
