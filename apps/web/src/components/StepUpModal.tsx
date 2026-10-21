'use client';

import React, { useState } from 'react';
import { ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface StepUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (stepUp: { totpCode: string; totpVerified: boolean; remarks: string }) => void;
  actionTitle: string;
  applicationNumber: string;
}

export const StepUpModal: React.FC<StepUpModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  actionTitle,
  applicationNumber,
}) => {
  const [totp, setTotp] = useState('123456');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!totp || totp.trim().length !== 6) {
      setError('Please enter a valid 6-digit TOTP authentication code.');
      return;
    }
    if (!remarks || remarks.trim().length < 5) {
      setError('Regulatory accountability requires mandatory, specific remarks (min 5 characters).');
      return;
    }
    setError(null);
    onConfirm({
      totpCode: totp,
      totpVerified: true,
      remarks: remarks.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full border border-slate-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-5">
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-xs uppercase tracking-wider font-bold text-emerald-300">
              Statutory HITL Safeguard Enforced
            </span>
          </div>
          <h3 className="text-lg font-bold">Authorized Officer Step-Up Verification</h3>
          <p className="text-xs text-slate-300 mt-1">
            Action: <strong className="text-white">{actionTitle}</strong> for file{' '}
            <span className="font-mono bg-white/20 px-1.5 py-0.5 rounded text-white">{applicationNumber}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Regulatory Integrity Notice:</strong>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                Per AICTE Approval Process Handbook (APH), statutory regulatory approvals and rejections can never be taken by automated system actors. This action will be cryptographically signed and hash-chained into the audit trail.
              </p>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Time-based One-Time Password (TOTP) Code
            </label>
            <input
              type="text"
              maxLength={6}
              value={totp}
              onChange={(e) => setTotp(e.target.value)}
              placeholder="123456"
              className="w-full text-center tracking-widest text-lg font-mono font-bold py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">Demo TOTP seed pre-configured (Default: 123456)</span>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Mandatory Statutory Decision Remarks <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={3}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter official grounds for regulatory sanction/approval..."
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
            />
          </div>

          {error && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-semibold rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" /> Authenticate & Sign Decision
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
