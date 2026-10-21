'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './globals.css';
import { TimeTravelBar } from '@/components/TimeTravelBar';
import {
  LayoutDashboard,
  Building2,
  Inbox,
  CalendarCheck,
  FileCheck,
  School,
  Sliders,
  FileBarChart,
  ShieldAlert,
  Award,
  Globe,
  UserCheck,
} from 'lucide-react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [activeRole, setActiveRole] = useState<string>('BUREAU_HEAD');

  const navItems = [
    { href: '/bureau-hq', label: lang === 'en' ? 'Command Center' : 'कमांड सेंटर', icon: LayoutDashboard },
    { href: '/regional-desk', label: lang === 'en' ? 'Regional Desk' : 'क्षेत्रीय डेस्क', icon: Building2 },
    { href: '/my-work', label: lang === 'en' ? 'Officer Scrutiny' : 'अधिकारी जांच', icon: Inbox },
    { href: '/evc', label: lang === 'en' ? 'EVC Queue' : 'ईवीसी कतार', icon: CalendarCheck },
    { href: '/compliance', label: lang === 'en' ? 'Undertakings & Docs' : 'वचनबद्धता एवं दस्तावेज', icon: FileCheck },
    { href: '/institution', label: lang === 'en' ? 'Institution Portal' : 'संस्थान पोर्टल', icon: School },
    { href: '/admin', label: lang === 'en' ? 'Policy Configurator' : 'नीति विन्यासकर्ता', icon: Sliders },
    { href: '/reports', label: lang === 'en' ? 'Reports (R1–R6)' : 'रिपोर्ट (R1–R6)', icon: FileBarChart },
    { href: '/audit', label: lang === 'en' ? 'Audit Trail' : 'ऑडिट ट्रेल', icon: ShieldAlert },
    { href: '/proof-panel', label: lang === 'en' ? 'Proof Panel (Judge)' : 'प्रूफ पैनल (मूल्यांकन)', icon: Award, highlight: true },
  ];

  return (
    <html lang={lang}>
      <head>
        <title>PRAVAH-AICTE | Regulatory Approval & Vigilance Automation</title>
        <meta
          name="description"
          content="Integrated AICTE Approval Workflow Automation, Compliance Monitoring and Alert Management System (SIH 2026)"
        />
      </head>
      <body className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
        {/* Top Government Banner */}
        <header className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white shadow-md border-b border-indigo-900/50 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Emblem and Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg ring-2 ring-white/20">
                  प्र
                </div>
                <div>
                  <div className="flex items-center gap-2">
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

              {/* Header Right Actions */}
              <div className="flex items-center gap-3 text-xs">
                {/* Language Switcher */}
                <button
                  onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 text-white font-medium flex items-center gap-1 transition-all"
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
                </button>

                {/* Role Switcher */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg p-1 border border-white/20">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400 ml-1" />
                  <select
                    value={activeRole}
                    onChange={(e) => setActiveRole(e.target.value)}
                    className="bg-transparent text-white text-xs font-semibold focus:outline-none pr-1 cursor-pointer"
                  >
                    <option value="BUREAU_HEAD" className="text-slate-900">Dr. Ramesh Sharma (Bureau Head)</option>
                    <option value="REGIONAL_OFFICER" className="text-slate-900">K. Balasubramanian (RO South)</option>
                    <option value="SCRUTINY_OFFICER" className="text-slate-900">P. Meenakshi (Scrutiny Officer)</option>
                    <option value="INSTITUTION_ADMIN" className="text-slate-900">Principal (Apex Institute / Inst A)</option>
                    <option value="AUDITOR" className="text-slate-900">CAG Statutory Auditor</option>
                    <option value="SYSTEM_ADMIN" className="text-slate-900">Policy Administrator</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Navigation Bar */}
            <nav className="flex space-x-1 overflow-x-auto py-2 border-t border-white/10 no-scrollbar">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/bureau-hq' && pathname.startsWith(item.href));
                const Icon = item.icon;
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
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </header>

        {/* Main View Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>

        {/* Floating Time Travel Controller */}
        <TimeTravelBar />

        {/* Official Footer */}
        <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 text-center">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div>
              <strong>All India Council for Technical Education (AICTE)</strong> • Approval Process Handbook (APH) 2026-27 Compliance
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span>GIGW 3.0 & WCAG 2.1 AA Compliant</span>
              <span>•</span>
              <span>Per-stream SHA-256 Hash Chaining</span>
              <span>•</span>
              <span>Strict HITL Guard</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
