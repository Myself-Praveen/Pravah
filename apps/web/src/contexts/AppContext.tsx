'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Lang = 'en' | 'hi';
export type Role =
  | 'INSTITUTION_ADMIN'
  | 'SCRUTINY_OFFICER'
  | 'EVC_MEMBER'
  | 'SAC_SHC_MEMBER'
  | 'REGIONAL_OFFICER'
  | 'BUREAU_OFFICER'
  | 'BUREAU_HEAD'
  | 'AUDITOR'
  | 'SYSTEM_ADMIN';

interface AppContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  role: Role;
  setRole: (r: Role) => void;
  t: (en: string, hi: string) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');
  const [role, setRole] = useState<Role>('BUREAU_HEAD');
  const t = (en: string, hi: string) => (lang === 'en' ? en : hi);
  return (
    <AppContext.Provider value={{ lang, setLang, role, setRole, t }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}