'use client';

import React from 'react';
import { Target, Trophy, Plus, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function TargetsPage() {
  const { salesTarget, employees } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#FFCC00]" />
            <span>SALES TARGET MANAGEMENT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Monthly target allocations, team quotas, and historical performance retention
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Monthly Revenue Target</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{formatINR(salesTarget.target_revenue, 'full')}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1">
            Achieved: {formatINR(salesTarget.achieved_revenue, 'full')} ({salesTarget.achievement_pct}%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Monthly Lead Target</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{salesTarget.target_leads} Leads</div>
          <div className="text-xs text-blue-600 font-bold mt-1">
            Current: {salesTarget.achieved_leads} Leads ({Math.round((salesTarget.achieved_leads / salesTarget.target_leads) * 100)}%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Prospect Target</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{salesTarget.target_prospects} Prospects</div>
          <div className="text-xs text-amber-600 font-bold mt-1">
            Achieved: {salesTarget.achieved_prospects} ({Math.round((salesTarget.achieved_prospects / salesTarget.target_prospects) * 100)}%)
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500">Conversion Target</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{salesTarget.target_conversions} Won Deals</div>
          <div className="text-xs text-purple-600 font-bold mt-1">
            Achieved: {salesTarget.achieved_conversions} ({Math.round((salesTarget.achieved_conversions / salesTarget.target_conversions) * 100)}%)
          </div>
        </div>
      </div>

      {/* Employee Allocations */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
          Employee-Specific Target Allocations (September 2026)
        </h2>

        <div className="space-y-3">
          {employees.map(emp => (
            <div key={emp.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <div className="font-extrabold text-slate-900 text-sm">{emp.full_name}</div>
                <div className="text-slate-500">{emp.designation} • {emp.team_name}</div>
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Revenue Target</span>
                  <div className="font-bold text-slate-900">{formatINR(emp.target, 'full')}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Revenue Achieved</span>
                  <div className="font-extrabold text-emerald-700">{formatINR(emp.revenue, 'full')}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Achievement %</span>
                  <div className="font-black text-[#FFCC00] bg-slate-900 px-2 py-0.5 rounded text-center">
                    {emp.achievement_pct}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
