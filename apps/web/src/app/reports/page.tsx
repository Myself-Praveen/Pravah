'use client';

import React, { useState, useEffect } from 'react';
import {
  FileBarChart,
  Download,
  FileSpreadsheet,
  FileText,
  Filter,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState<string>('R1');
  const [reportData, setReportData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const reportTypes = [
    { code: 'R1', title: 'R1: Application Pendency & Ageing Matrix', desc: 'Region × stage × ageing bucket, officer-wise, SLA state' },
    { code: 'R2', title: 'R2: EVC Inspection Status & Modes', desc: 'Queued / scheduled / completed / overdue, mode split' },
    { code: 'R3', title: 'R3: Conditional Undertakings Compliance', desc: 'Due / submitted / verified / breached by region & condition' },
    { code: 'R4', title: 'R4: Document Validity & Expiry Surveillance', desc: 'Expiring ≤ 90 days, expired, renewal-in-progress' },
    { code: 'R5', title: 'R5: Overdue & Multi-Tier Escalations', desc: 'Level-wise open escalations, time-to-acknowledge' },
    { code: 'R6', title: 'R6: Region Processing Performance', desc: 'Median turnaround, SLA adherence %, throughput' },
  ];

  const fetchReport = async (code: string) => {
    setLoading(true);
    setSelectedReport(code);
    try {
      const res = await fetch(`http://localhost:4000/api/v1/reports/${code}`);
      const data = await res.json();
      setReportData(data);
    } catch {
      // fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport('R1');
  }, []);

  const handleExportCsv = () => {
    if (!reportData?.rows) return;
    const keys = Object.keys(reportData.rows[0]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [keys.join(','), ...reportData.rows.map((r: any) => keys.map((k) => `"${r[k] || ''}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${selectedReport}_AICTE_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
              Module F: Statutory Intelligence
            </span>
            <span className="text-xs text-slate-400">• Prescribed APH Reports R1–R6</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Statutory Reports & Regulatory Analytics
          </h1>
          <p className="text-xs text-slate-500">
            Exportable compliance matrices for AICTE Executive Committee, Bureau Heads, RTI responses, and Parliament queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            disabled={!reportData?.rows || reportData.rows.length === 0}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export to Excel (XLSX/CSV)</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Report Switcher Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {reportTypes.map((r) => (
          <button
            key={r.code}
            onClick={() => fetchReport(r.code)}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedReport === r.code
                ? 'border-indigo-600 bg-indigo-50 text-indigo-950 ring-2 ring-indigo-200 font-bold'
                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
            }`}
          >
            <div className="font-mono text-xs font-bold text-indigo-700 mb-0.5">{r.code}</div>
            <div className="text-[11px] leading-tight font-semibold line-clamp-2">{r.title.slice(4)}</div>
          </button>
        ))}
      </div>

      {/* Report Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">{reportData?.report || `${selectedReport} Report`}</h2>
            <span className="text-[11px] text-slate-500">Generated: {reportData?.generatedAt ? new Date(reportData.generatedAt).toLocaleString() : new Date().toLocaleString()}</span>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            {reportData?.rows?.length || 0} Records
          </span>
        </div>

        {reportData?.rows && reportData.rows.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-100/75 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  {Object.keys(reportData.rows[0]).map((key) => (
                    <th key={key} className="p-3 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reportData.rows.map((row: any, i: number) => (
                  <tr key={i} className="hover:bg-slate-50">
                    {Object.values(row).map((val: any, j: number) => (
                      <td key={j} className="p-3 font-medium text-slate-800">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-400">
            <FileBarChart className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Select report to load live aggregates from database.</p>
          </div>
        )}
      </div>
    </div>
  );
}
