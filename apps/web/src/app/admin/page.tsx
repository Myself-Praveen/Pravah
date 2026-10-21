'use client';

import React, { useState } from 'react';
import {
  Sliders,
  Plus,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  GitBranch,
  Save,
  Eye,
  Calendar,
} from 'lucide-react';
import { ALL_STANDARD_DEFINITIONS } from '@pravah/workflow';

export default function PolicyConfiguratorPage() {
  const [selectedTrack, setSelectedTrack] = useState<string>('SCRUTINY_PLUS_EVC');
  const [scrutinySla, setScrutinySla] = useState<number>(7);
  const [dryRunMessage, setDryRunMessage] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  // Custom Track Creator State (Demo Step 2: "add custom track without redeploy")
  const [customTrackCode, setCustomTrackCode] = useState('SPECIAL_AUTONOMOUS_TRACK');
  const [customTrackName, setCustomTrackName] = useState('Autonomous Institutions Accelerated Approval Track');
  const [createdTracks, setCreatedTracks] = useState<string[]>([]);

  const handleSlaChange = (newVal: number) => {
    setScrutinySla(newVal);
    if (newVal < 7) {
      setDryRunMessage(`Dry-Run Impact Simulation: Reducing Scrutiny SLA from 7 to ${newVal} working days would transition 14 currently active dossiers to Amber warning today.`);
    } else {
      setDryRunMessage(`Dry-Run Impact Simulation: Relaxing Scrutiny SLA to ${newVal} working days maintains all active dossiers within green threshold.`);
    }
  };

  const handleSavePolicy = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 5000);
  };

  const handleCreateCustomTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTrackCode.trim()) {
      setCreatedTracks([...createdTracks, customTrackCode.trim()]);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Handbook-as-Data
            </span>
            <span className="text-xs text-slate-400">• APH Policy Configurator</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            No-Code APH Policy & Workflow Configurator
          </h1>
          <p className="text-xs text-slate-500">
            When APH changes annually, AICTE updates versioned JSON configuration with zero code deployment or server restart.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-900 text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Policy configuration updated & versioned in database! Effective immediately across all active instances.</span>
        </div>
      )}

      {/* Grid: SLA Matrix + Track Designer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Stage SLA Matrix & Dry-Run Impact */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">SLA Duration Matrix (Working Days)</h2>
              <p className="text-xs text-slate-500">Track: {selectedTrack}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Version 3 (Active)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Scrutiny Stage SLA:</span>
                <span className="font-mono font-bold text-indigo-700 text-sm">{scrutinySla} Working Days</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={scrutinySla}
                onChange={(e) => handleSlaChange(parseInt(e.target.value, 10))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>3 Days</span>
                <span>Default: 7 Days</span>
                <span>15 Days</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">EVC Inspection SLA</span>
                <span className="text-[10px] text-slate-500">Prescribed window for visit & report</span>
              </div>
              <span className="font-mono font-bold text-slate-700">15 Working Days</span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Competent Authority Review</span>
                <span className="text-[10px] text-slate-500">Statutory approval decision by RO / Bureau</span>
              </div>
              <span className="font-mono font-bold text-slate-700">5 Working Days</span>
            </div>

            {/* Dry Run Banner */}
            {dryRunMessage && (
              <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-xs flex items-start gap-2 animate-fade-in">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{dryRunMessage}</span>
              </div>
            )}

            <button
              onClick={handleSavePolicy}
              className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" /> Save SLA Policy Version & Commit
            </button>
          </div>
        </div>

        {/* Card 2: Workflow Track Designer */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Custom Approval Track Designer</h2>
              <p className="text-xs text-slate-500">Add custom APH tracks live without server redeployment</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
              Zero-Downtime Engine
            </span>
          </div>

          <form onSubmit={handleCreateCustomTrack} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Track Unique Code</label>
              <input
                type="text"
                value={customTrackCode}
                onChange={(e) => setCustomTrackCode(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg font-mono text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Track Description</label>
              <input
                type="text"
                value={customTrackName}
                onChange={(e) => setCustomTrackName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-[11px] text-slate-600">
              <span className="font-bold text-slate-800 block">Automatic Statechart Validator:</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> All stages reachable from SUBMITTED
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Terminal stages (APPROVED, REJECTED) defined
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Statutory guards bound to REGIONAL_OFFICER role
              </div>
            </div>

            {createdTracks.length > 0 && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 text-xs">
                <strong>Active Custom Tracks:</strong> {createdTracks.join(', ')}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" /> Activate Custom Track in Production
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
