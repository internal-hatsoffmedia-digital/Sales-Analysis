'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { UserCheck, ArrowLeft, Trophy, Target, TrendingUp, CheckCircle2, Clock, PhoneCall, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function EmployeeProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { employees } = useApp();

  const empId = params.id as string;
  const emp = employees.find(e => e.id === empId) || employees[0];

  return (
    <div className="space-y-6 pb-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Team Leaderboard</span>
      </button>

      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-slate-900 text-[#FFCC00] flex items-center justify-center font-black text-2xl shadow-sm">
            {emp.full_name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{emp.full_name}</span>
              <span className="text-xs bg-[#FFCC00] text-slate-950 font-bold px-2 py-0.5 rounded">
                {emp.employee_code}
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {emp.designation} • {emp.team_name} • {emp.email} • {emp.phone}
            </p>
          </div>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 font-medium">Monthly Target</span>
            <div className="text-lg font-black text-slate-900">{formatINR(emp.target, 'full')}</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Revenue Achieved</span>
            <div className="text-lg font-black text-emerald-700">{formatINR(emp.revenue, 'full')}</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Target Achievement</span>
            <div className="text-lg font-black text-[#FFCC00]">{emp.achievement_pct}%</div>
          </div>

          <div>
            <span className="text-slate-500 font-medium">Conversion Rate</span>
            <div className="text-lg font-black text-indigo-700">{emp.conversion_rate}%</div>
          </div>
        </div>
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Leads Handled</span>
          <div className="text-2xl font-black text-slate-900">{emp.leads_assigned}</div>
          <div className="text-[11px] text-slate-500">{emp.new_leads_created} created by {emp.full_name.split(' ')[0]}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Activities Logged</span>
          <div className="text-2xl font-black text-purple-700">{emp.activities_count}</div>
          <div className="text-[11px] text-slate-500">{emp.calls_count} phone calls completed</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs font-bold text-slate-500">Follow-ups Completed</span>
          <div className="text-2xl font-black text-emerald-700">{emp.followups_completed}</div>
          <div className="text-[11px] text-rose-600 font-bold">{emp.overdue_followups} overdue pending</div>
        </div>
      </div>
    </div>
  );
}
