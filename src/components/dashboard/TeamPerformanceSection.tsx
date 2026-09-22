'use client';

import React from 'react';
import { UserCheck, Trophy, ChevronRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';
import Link from 'next/link';

export function TeamPerformanceSection() {
  const { employees } = useApp();

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>TEAM PERFORMANCE LEADERBOARD</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Individual sales executive activity, conversion quality, and target achievement
          </p>
        </div>

        <Link
          href="/team/performance"
          className="text-xs font-bold text-slate-900 hover:text-[#FFCC00] flex items-center gap-1"
        >
          <span>View Team Analytics</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="p-3">Rank</th>
              <th className="p-3">Member</th>
              <th className="p-3">Team / Role</th>
              <th className="p-3 text-center">Leads</th>
              <th className="p-3 text-center">Activity</th>
              <th className="p-3 text-center">Prospects</th>
              <th className="p-3 text-center">Won</th>
              <th className="p-3 text-right">Revenue</th>
              <th className="p-3 text-right">Target</th>
              <th className="p-3 text-right">Achievement %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {employees.map((emp, idx) => (
              <tr key={emp.id} className="hover:bg-amber-50/40 transition-colors">
                <td className="p-3 font-bold text-slate-400">#{idx + 1}</td>
                <td className="p-3 font-bold text-slate-900">
                  <Link href={`/team/${emp.id}`} className="hover:underline flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-[#FFCC00] flex items-center justify-center font-extrabold text-xs">
                      {emp.full_name.charAt(0)}
                    </div>
                    <span>{emp.full_name}</span>
                  </Link>
                </td>
                <td className="p-3 text-slate-600">
                  <div>{emp.designation}</div>
                  <div className="text-[10px] text-slate-400">{emp.team_name}</div>
                </td>
                <td className="p-3 text-center font-bold text-slate-800">{emp.leads_assigned}</td>
                <td className="p-3 text-center font-bold text-purple-700 bg-purple-50/50 rounded">
                  {emp.activities_count}
                </td>
                <td className="p-3 text-center font-bold text-amber-800 bg-amber-50/50 rounded">
                  {emp.prospects_count}
                </td>
                <td className="p-3 text-center font-extrabold text-emerald-700 bg-emerald-50/60 rounded">
                  {emp.won_count}
                </td>
                <td className="p-3 text-right font-black text-slate-900">
                  {formatINR(emp.revenue, 'compact')}
                </td>
                <td className="p-3 text-right font-medium text-slate-500">
                  {formatINR(emp.target, 'compact')}
                </td>
                <td className="p-3 text-right">
                  <span className="px-2 py-1 rounded bg-[#FFCC00] text-slate-950 font-black text-[11px] shadow-xs">
                    {emp.achievement_pct}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
