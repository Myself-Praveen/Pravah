'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import { TimeTravelBar } from '@/components/TimeTravelBar';
import { AppProvider, useApp } from '@/contexts/AppContext';
import {
  LayoutDashboard, Building2, Inbox, CalendarCheck, FileCheck, School,
  Sliders, FileBarChart, ShieldAlert, Award, Globe, UserCheck, Menu, X,
} from 'lucide-react';

const navItems = [
  { href: '/bureau-hq', en: 'Command Center', hi: 'कमांड सेंटर', icon: LayoutDashboard },
  { href: '/regional-desk', en: 'Regional Desk', hi: 'क्षेत्रीय डेस्क', icon: Building2 },
  { href: '/my-work', en: 'Officer Scrutiny', hi: 'अधिकारी जांच', icon: Inbox },
  { href: '/evc', en: 'EVC Queue', hi: 'ईवीसी कतार', icon: CalendarCheck },
  { href: '/compliance', en: 'Undertakings & Docs', hi: 'वचनबद्धता एवं दस्तावेज', icon: FileCheck },
  { href: '/institution', en: 'Institution Portal', hi: 'संस्थान पोर्टल', icon: School },
  { href: '/admin', en: 'Policy Configurator', hi: 'नीति विन्यासकर्ता', icon: Sliders },
  { href: '/reports', en: 'Reports (R1–R6)', hi: 'रिपोर्ट (R1–R6)', icon: FileBarChart },
  { href: '/audit', en: 'Audit Trail', hi: 'ऑडिट ट्रेल', icon: ShieldAlert },
  { href: '/proof-panel', en: 'Proof Panel (Judge)', hi: 'प्रूफ पैनल (मूल्यांकन)', icon: Award, highlight: true },
];

const roles = [
  { value: 'BUREAU_HEAD', label: 'Dr. Ramesh Sharma (Bureau Head)' },
  { value: 'REGIONAL_OFFICER', label: 'K. Balasubramanian (RO South)' },
  { value: 'SCRUTINY_OFFICER', label: 'P. Meenakshi (Scrutiny Officer)' },
  { value: 'INSTITUTION_ADMIN', label: 'Principal (Apex Institute)' },
  { value: 'AUDITOR', label: 'CAG Statutory Auditor' },
  { value: 'SYSTEM_ADMIN', label: 'Policy Administrator' },
];

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { lang, setLang, role, setRole } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 gov-pattern">
      <div className="tricolor-strip" />
      <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-md border-b border-indigo-900/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg ring-2 ring-white/20">
                प्र
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-extrabold tracking-tight text-lg text-white">PRAVAH-AICTE</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-emerald-400/30">
                    SIH 2026 • PS SIH26262
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 hidden sm:block">
                  Platform for Regulatory Approval, Vigilance, Automation & Handbook Compliance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
                aria-label="Toggle language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-400" />
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>

              <div className="hidden sm:flex items-center gap-1 bg-white/10 rounded-lg p-1 border border-white/20">
                <UserCheck className="w-3.5 h-3.5 text-amber-400 ml-1" />
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none pr-1 cursor-pointer max-w-[180px]"
                >
                  {roles.map((r) => (
                    <option key={r.value} value={r.value} className="text-slate-900">{r.label}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setMobileOpen((v) => !v)}
                className="sm:hidden p-2 rounded-lg bg-white/10 border border-white/20"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <nav className="hidden sm:flex space-x-1 overflow-x-auto py-2 border-t border-white/10 no-scrollbar">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/bureau-hq' && pathname.startsWith(item.href));
              const Icon = item.icon;
              const label = lang === 'en' ? item.en : item.hi;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    item.highlight
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md hover:from-amber-400 hover:to-amber-500'
                      : isActive
                      ? 'bg-white text-blue-950 shadow-sm font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${item.highlight ? 'text-slate-950' : isActive ? 'text-blue-700' : 'text-slate-300'}`} />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {mobileOpen && (
          <div className="sm:hidden border-t border-white/10 bg-blue-950/95 backdrop-blur px-4 py-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const label = lang === 'en' ? item.en : item.hi;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-white/10"
                >
                  <Icon className="w-4 h-4" /> {label}
                </Link>
              );
            })}
            <div className="pt-2 flex items-center gap-2">
              <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 border border-white/20">
                {lang === 'en' ? 'हिन्दी' : 'English'}
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in">
        {children}
      </main>

      <TimeTravelBar />

      <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-700">All India Council for Technical Education (AICTE)</strong> • Approval Process Handbook (APH) 2026-27 Compliance
          </div>
          <div className="flex items-center gap-3 text-[11px] flex-wrap justify-center">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />GIGW 3.0 & WCAG 2.1 AA</span>
            <span>•</span>
            <span>Per-stream SHA-256 Hash Chaining</span>
            <span>•</span>
            <span>Strict HITL Guard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>PRAVAH-AICTE | Regulatory Approval & Vigilance Automation</title>
        <meta name="description" content="Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System (SIH 2026)" />
      </head>
      <body>
        <AppProvider>
          <Shell>{children}</Shell>
        </AppProvider>
      </body>
    </html>
  );
}
