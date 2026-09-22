'use client';

import React, { useState } from 'react';
import { BarChart3, Download, Filter, Calendar, Users, Layers } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function ReportsPage() {
  const { leads, proposals, conversions, lostLeads, employees, salesTarget } = useApp();

  const [activeReport, setActiveReport] = useState<'sales' | 'leads' | 'sources' | 'revenue' | 'lost'>('sales');

  const exportCurrentReportCSV = () => {
    let headers: string[] = [];
    let rows: any[][] = [];
    let filename = `Hatsoff_${activeReport}_report.csv`;

    if (activeReport === 'sales' || activeReport === 'revenue') {
      headers = ['Executive Name', 'Designation', 'Leads', 'Prospects', 'Won', 'Revenue', 'Target', 'Achievement %'];
      rows = employees.map(e => [e.full_name, e.designation, e.leads_assigned, e.prospects_count, e.won_count, e.revenue, e.target, `${e.achievement_pct}%`]);
    } else if (activeReport === 'leads') {
      headers = ['Lead Code', 'Company', 'Contact', 'Phone', 'Source', 'Service', 'Status', 'Budget'];
      rows = leads.map(l => [l.lead_code, `"${l.company_name}"`, `"${l.contact_person}"`, l.phone, l.source, `"${l.service}"`, l.status, l.estimated_budget]);
    } else if (activeReport === 'lost') {
      headers = ['Lead ID', 'Company', 'Lost Reason', 'Competitor', 'Marked By', 'Created At'];
      rows = lostLeads.map(l => [l.lead_id, `"${l.company_name}"`, l.lost_reason, l.competitor_name || 'N/A', l.marked_by_name, l.created_at]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#FFCC00]" />
            <span>COMPREHENSIVE REPORTS ENGINE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Exportable executive reporting on sales performance, conversions, lost reasons, and revenue
          </p>
        </div>

        <button
          onClick={exportCurrentReportCSV}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs rounded-lg shadow-xs"
        >
          <Download className="w-4 h-4" />
          <span>Export {activeReport.toUpperCase()} Report (CSV)</span>
        </button>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 text-xs font-bold gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveReport('sales')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap ${
            activeReport === 'sales'
              ? 'border-[#FFCC00] text-slate-900 font-extrabold bg-amber-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Sales & Team Performance Report
        </button>

        <button
          onClick={() => setActiveReport('leads')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap ${
            activeReport === 'leads'
              ? 'border-[#FFCC00] text-slate-900 font-extrabold bg-amber-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Lead Master & Pipeline Report
        </button>

        <button
          onClick={() => setActiveReport('revenue')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap ${
            activeReport === 'revenue'
              ? 'border-[#FFCC00] text-slate-900 font-extrabold bg-amber-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Revenue & Target Achievement Report
        </button>

        <button
          onClick={() => setActiveReport('lost')}
          className={`py-3 px-4 border-b-2 whitespace-nowrap ${
            activeReport === 'lost'
              ? 'border-[#FFCC00] text-slate-900 font-extrabold bg-amber-50/30'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Lost Lead Reason Analysis
        </button>
      </div>

      {/* Report Data Views */}
      <div className="bg-white p-5 rounded-b-xl border border-slate-200 shadow-xs">
        {activeReport === 'sales' && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Team Executive Summary</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                    <th className="p-3">Executive</th>
                    <th className="p-3">Leads Handled</th>
                    <th className="p-3">Prospects</th>
                    <th className="p-3">Won Deals</th>
                    <th className="p-3 text-right">Revenue</th>
                    <th className="p-3 text-right">Target</th>
                    <th className="p-3 text-right">Achievement %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {employees.map(e => (
                    <tr key={e.id}>
                      <td className="p-3 font-bold text-slate-900">{e.full_name}</td>
                      <td className="p-3 font-medium text-slate-800">{e.leads_assigned}</td>
                      <td className="p-3 font-medium text-amber-800">{e.prospects_count}</td>
                      <td className="p-3 font-bold text-emerald-700">{e.won_count}</td>
                      <td className="p-3 text-right font-black text-slate-900">{formatINR(e.revenue, 'full')}</td>
                      <td className="p-3 text-right font-medium text-slate-500">{formatINR(e.target, 'full')}</td>
                      <td className="p-3 text-right font-bold text-[#FFCC00]">{e.achievement_pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeReport === 'revenue' && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Monthly Revenue Breakdown</h2>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-xs flex justify-between items-center">
              <div>
                <span className="text-slate-600">September 2026 Total Target:</span>
                <span className="font-black text-slate-900 text-base ml-2">{formatINR(salesTarget.target_revenue, 'full')}</span>
              </div>
              <div>
                <span className="text-slate-600">Achieved Revenue:</span>
                <span className="font-black text-emerald-700 text-base ml-2">{formatINR(salesTarget.achieved_revenue, 'full')}</span>
              </div>
              <span className="px-3 py-1 bg-[#FFCC00] text-slate-950 font-black rounded text-sm">
                {salesTarget.achievement_pct}% Achieved
              </span>
            </div>
          </div>
        )}

        {activeReport === 'lost' && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm">Lost Opportunities Audit</h2>
            {lostLeads.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No lost leads logged in current session.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px]">
                      <th className="p-3">Company Name</th>
                      <th className="p-3">Lost Reason</th>
                      <th className="p-3">Competitor</th>
                      <th className="p-3">Marked By</th>
                      <th className="p-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lostLeads.map(l => (
                      <tr key={l.id}>
                        <td className="p-3 font-bold text-slate-900">{l.company_name}</td>
                        <td className="p-3 font-bold text-rose-700">{l.lost_reason}</td>
                        <td className="p-3 text-slate-700">{l.competitor_name || 'N/A'}</td>
                        <td className="p-3 text-slate-600">{l.marked_by_name}</td>
                        <td className="p-3 text-slate-500">{l.notes || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
