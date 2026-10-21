'use client';

import React, { useState, useEffect } from 'react';
import { FastForward, RotateCcw, Clock, Sparkles } from 'lucide-react';

export const TimeTravelBar: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [offsetDays, setOffsetDays] = useState<number>(0);
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchClock = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/v1/demo/clock');
      const data = await res.json();
      setCurrentTime(new Date(data.currentSimulatedTime).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }));
      setOffsetDays(data.offsetDays || 0);
    } catch {
      // API might be starting
    }
  };

  useEffect(() => {
    fetchClock();
    const interval = setInterval(fetchClock, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleAdvance = async (days: number) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/v1/demo/advance-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days }),
      });
      const data = await res.json();
      setToast(`Fast-forwarded +${days} days! Sweeper triggered: ${data.sweepResult?.actionsTaken || 0} statutory alerts & state changes updated.`);
      await fetchClock();
      setTimeout(() => setToast(null), 7000);
      window.dispatchEvent(new CustomEvent('time-travel-updated'));
    } catch (e) {
      setToast('Time travel error connecting to API');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    setLoading(true);
    try {
      await fetch('http://localhost:4000/api/v1/demo/reset', { method: 'POST' });
      setToast('System Clock and Seed Database restored to initial Day 0 baseline.');
      await fetchClock();
      setTimeout(() => setToast(null), 5000);
      window.dispatchEvent(new CustomEvent('time-travel-updated'));
    } catch {
      setToast('Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 glass-panel shadow-2xl rounded-2xl p-3 border border-indigo-200/60 bg-white/95 flex items-center gap-3 text-xs">
        <div className="flex items-center gap-2 border-r border-slate-200 pr-3">
          <Clock className="w-4 h-4 text-indigo-600 animate-spin-slow" />
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Simulated Virtual Clock</div>
            <div className="font-semibold text-slate-800">{currentTime || 'Loading clock...'}</div>
            {offsetDays > 0 && <span className="text-[10px] text-indigo-600 font-medium">+{offsetDays} Days Elapsed</span>}
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold text-slate-500 uppercase mr-1">Time Travel:</span>
          <button
            onClick={() => handleAdvance(1)}
            disabled={loading}
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors border border-indigo-200 flex items-center gap-1 active:scale-95"
          >
            <FastForward className="w-3 h-3" /> +1 Day
          </button>
          <button
            onClick={() => handleAdvance(5)}
            disabled={loading}
            className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium rounded-lg transition-colors border border-indigo-200 flex items-center gap-1 active:scale-95"
          >
            <FastForward className="w-3 h-3" /> +5 Days
          </button>
          <button
            onClick={() => handleAdvance(6)}
            disabled={loading}
            className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold rounded-lg transition-colors border border-amber-300 flex items-center gap-1 active:scale-95"
            title="Demo step 4: Triggers undertaking breach"
          >
            <Sparkles className="w-3 h-3 text-amber-600" /> +6 Days (Escalation)
          </button>
          <button
            onClick={handleReset}
            disabled={loading}
            className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-medium rounded-lg transition-colors border border-slate-200 flex items-center gap-1 ml-1 active:scale-95"
            title="Reset to Day 0 baseline"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>
        </div>
      </div>

      {toast && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-2xl border border-indigo-500 flex items-center gap-2 max-w-md animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </>
  );
};
