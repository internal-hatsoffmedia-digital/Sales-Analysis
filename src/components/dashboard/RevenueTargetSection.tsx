'use client';

import React from 'react';
import { Trophy, Target, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export function RevenueTargetSection() {
  const { salesTarget, employees } = useApp();

  const achieved = salesTarget.achieved_revenue; // ₹7,80,000
  const target = salesTarget.target_revenue; // ₹10,00,000
  const achievementPct = Math.round((achieved / target) * 100); // 78%
  const remaining = target - achieved; // ₹2,20,000

  // Calculate required daily revenue assuming 8 days left in month
  const daysLeft = 8;
  const requiredDaily = Math.round(remaining / daysLeft);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFCC00]" />
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
              REVENUE VS TARGET TRACKER
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            September 2026 Monthly Control Center Performance
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-bold">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
            Achieved: <span className="text-sm font-black">{formatINR(achieved, 'full')}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 border border-slate-200">
            Target: <span className="text-sm font-black">{formatINR(target, 'full')}</span>
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-[#FFCC00] text-slate-950 font-black text-sm shadow-xs">
            {achievementPct}%
          </div>
        </div>
      </div>

      {/* Main Progress Bar Component */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700">
          <span>Overall Monthly Goal Progress</span>
          <span>{achievementPct}% Complete</span>
        </div>
        <div className="h-5 w-full bg-slate-100 rounded-full overflow-hidden p-1 border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-[#FFCC00] to-emerald-500 rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${Math.min(achievementPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-slate-500">
          <span>₹0</span>
          <span>Remaining Target: {formatINR(remaining, 'full')}</span>
          <span>Target: {formatINR(target, 'full')}</span>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
        <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
          <div className="text-slate-500 font-semibold mb-1">Remaining Gap</div>
          <div className="text-lg font-black text-slate-900">{formatINR(remaining, 'full')}</div>
          <div className="text-[10px] text-slate-500">To reach 100% target</div>
        </div>

        <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-200 text-xs">
          <div className="text-amber-800 font-semibold mb-1">Required Daily Revenue</div>
          <div className="text-lg font-black text-amber-900">{formatINR(requiredDaily, 'full')} / day</div>
          <div className="text-[10px] text-amber-700">Based on {daysLeft} remaining business days</div>
        </div>

        <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-200 text-xs">
          <div className="text-emerald-800 font-semibold mb-1">Pacing Status</div>
          <div className="text-lg font-black text-emerald-900">On Track (78%)</div>
          <div className="text-[10px] text-emerald-700">+4% ahead of projected schedule</div>
        </div>
      </div>

      {/* Employee-wise Target Achievement Breakdowns */}
      <div className="pt-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Employee-Wise Target Achievement
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {employees.map((emp) => (
            <div key={emp.id} className="p-3 rounded-lg border border-slate-200 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-xs">{emp.full_name}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                  {emp.achievement_pct}%
                </span>
              </div>
              <div className="text-[11px] text-slate-600 font-medium">
                {formatINR(emp.revenue, 'compact')} / {formatINR(emp.target, 'compact')}
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FFCC00] rounded-full"
                  style={{ width: `${Math.min(emp.achievement_pct, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
