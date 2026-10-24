'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/contexts/AppContext';
import {
  ShieldCheck, Zap, Clock, Lock, Building2, Users, FileBarChart, Award,
  ArrowRight, CheckCircle2, Globe, Sparkles,
} from 'lucide-react';

const modules = [
  { icon: Zap, title: 'Module A', desc: 'No-Code APH Workflow Engine — versioned JSON statecharts, dynamic tracks, zero redeploy.' },
  { icon: Clock, title: 'Module B', desc: 'SLA & Pendency Command Center — working-day math, pause/resume, escalations.' },
  { icon: Users, title: 'Module C', desc: 'EVC Inspection Queue & Scheduler — transparent priority scoring, P/O/H modes.' },
  { icon: ShieldCheck, title: 'Module D', desc: 'Undertaking & Compliance Ledger — countdowns, breach detection, reminders.' },
  { icon: FileCheck2Icon, title: 'Module E', desc: 'Document Validity Surveillance — 30-year lease, OCR extraction, expiry ladder.' },
  { icon: FileBarChart, title: 'Module F', desc: 'Statutory Reports, Notifications & Audit Trail — R1–R6, SHA-256 chains.' },
];

function FileCheck2Icon(props: any) { return <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>; }

const pillars = [
  { title: 'Handbook-as-Data', desc: 'APH rules, SLAs and offsets are versioned JSON config — annual changes need zero code.' },
  { title: 'Working-Day SLA Engine', desc: 'Excludes weekends, holidays; pauses when file is with institution.' },
  { title: 'Strict HITL Guard', desc: 'AI assists only; statutory approvals require officer step-up auth + remarks.' },
  { title: 'Tamper-Evident Audit', desc: 'Per-stream SHA-256 hash chains with DB triggers and Merkle anchoring.' },
];

const pains = [
  'Manual pendency tracking via spreadsheets and phone calls.',
  'Missed SLA deadlines with no automated alerts.',
  'EVC committee allocation conflicts and subjective queuing.',
  'Expired undertakings slipping through follow-up gaps.',
  'Mutable audit records vulnerable to retrospective tampering.',
];

const entries = [
  { role: 'BUREAU_HEAD', href: '/bureau-hq', label: 'Bureau Head', desc: 'National command center & bottlenecks' },
  { role: 'REGIONAL_OFFICER', href: '/regional-desk', label: 'Regional Officer', desc: 'Regional queue & EVC scheduling' },
  { role: 'SCRUTINY_OFFICER', href: '/my-work', label: 'Scrutiny Officer', desc: 'Inbox, clear & revert dossiers' },
  { role: 'INSTITUTION_ADMIN', href: '/institution', label: 'Institution', desc: 'Status tracker & deficiencies' },
  { role: 'AUDITOR', href: '/audit', label: 'Auditor', desc: 'Hash-chain verification' },
  { role: 'SYSTEM_ADMIN', href: '/admin', label: 'Policy Admin', desc: 'No-code APH configurator' },
];

export default function LandingPage() {
  const { t } = useApp();
  return (
    <div className="-mx-4 sm:-mx-6 lg:-mx-8">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white">
        <div className="tricolor-strip absolute top-0 left-0 right-0" />
        <div className="gov-pattern absolute inset-0 opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-3xl shadow-xl ring-2 ring-white/20">
              प्र
            </div>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs uppercase font-bold px-2 py-1 rounded border border-emerald-400/30">
              SIH 2026 • PS SIH26262
            </span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight max-w-4xl">
            PRAVAH-AICTE
            <span className="block text-amber-400 mt-2 text-2xl sm:text-3xl font-bold">
              {t('Platform for Regulatory Approval, Vigilance, Automation & Handbook Compliance',
                'विनियामक अनुमोदन, निगरानी, स्वचालन एवं हैंडबुक अनुपालन मंच')}
            </span>
          </h1>
          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
            {t(
              'Integrated AICTE approval workflow automation, compliance monitoring and alert management — aligned with APH 2026-27 & Dec-2025 EVC corrigendum.',
              'एआईसीटीई अनुमोदन वर्कफ्लो स्वचालन, अनुपालन निगरानी एवं अलर्ट प्रबंधन — एपीएच 2026-27 एवं दिसंबर-2025 ईवीसी संशोधन के अनुरूप।'
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/bureau-hq" className="btn-primary bg-amber-500 text-slate-950 hover:bg-amber-400 text-base px-6 py-3 shadow-elevated">
              {t('Enter Command Center', 'कमांड सेंटर प्रवेश')} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/institution" className="btn-secondary text-base px-6 py-3">
              {t('Institution Portal', 'संस्थान पोर्टल')}
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            {[
              { v: '12', l: t('Golden Institutions', 'स्वर्णिम संस्थान') },
              { v: '9', l: t('Regional Offices', 'क्षेत्रीय कार्यालय') },
              { v: '29/29', l: t('Acceptance Tests', 'स्वीकृति परीक्षण') },
              { v: '0', l: t('Missed Deadlines', 'छूटी समयसीमा') },
            ].map((s) => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/20">
                <div className="text-3xl font-black text-amber-400">{s.v}</div>
                <div className="text-[11px] text-slate-300 mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="page-header-title">{t('The Problem We Solve', 'समस्या जिसे हम हल करते हैं')}</h2>
          <p className="text-sm text-slate-500 mt-2">{t('SIH26262 — AICTE approval workflow pain points', 'एसआईएच26262 — एआईसीटीई अनुमोदन वर्कफ्लो चुनौतियाँ')}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pains.map((p, i) => (
            <div key={i} className="card p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 font-bold text-sm">{i + 1}</div>
              <p className="text-sm text-slate-700 leading-relaxed">{p}</p>
            </div>
          ))}
          <div className="card p-5 flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <div className="text-center">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-emerald-900">{t('PRAVAH solves all five.', 'प्रवाह सभी पाँच हल करता है।')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="page-header-title">{t('Six Core Modules', 'छह मुख्य मॉड्यूल')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {modules.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.title} className="card p-6 hover:shadow-elevated hover:-translate-y-1 transition-all">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 text-aicte-accent flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{m.title}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="page-header-title">{t('Four Non-Negotiable Pillars', 'चार अटल स्तंभ')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((p) => (
            <div key={p.title} className="card-elevated p-5 border-t-4 border-t-aicte-blue">
              <ShieldCheck className="w-6 h-6 text-aicte-blue mb-2" />
              <h3 className="text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Role entry */}
      <section className="bg-slate-900 py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black tracking-tight">{t('Enter by Role', 'भूमिका अनुसार प्रवेश')}</h2>
            <p className="text-sm text-slate-400 mt-2">{t('Pick your workspace to begin.', 'अपना कार्यक्षेत्र चुनें।')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {entries.map((e) => (
              <Link key={e.href} href={e.href} className="group bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-5 transition-all hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{e.label}</div>
                    <div className="text-xs text-slate-400 mt-1">{e.desc}</div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {['AICTE APH 2026-27', 'GIGW 3.0', 'WCAG 2.1 AA', 'SHA-256 Hash Chaining', 'Strict HITL Guard'].map((b) => (
            <span key={b} className="badge bg-slate-100 text-slate-700 border-slate-200 px-3 py-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5" /> {b}
            </span>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <strong className="text-slate-700">All India Council for Technical Education (AICTE)</strong> • Approval Process Handbook (APH) 2026-27
          <div className="mt-2 flex items-center justify-center gap-2 text-[11px]">
            <Globe className="w-3.5 h-3.5" /> {t('Bilingual EN/HI • Government of India', 'द्विभाषी अंग्रेज़ी/हिन्दी • भारत सरकार')}
          </div>
        </div>
      </footer>
    </div>
  );
}
