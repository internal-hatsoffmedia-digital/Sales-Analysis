'use client';

import React from 'react';
import { Settings, Shield, UserPlus } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function UsersSettingsPage() {
  const { currentRole, employees } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-700" />
            <span>SYSTEM USER & ROLE MANAGEMENT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure system access, role permissions, and user accounts
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4 text-xs">
        <h2 className="font-extrabold text-slate-900 text-sm">System Users & Supabase Auth Profiles</h2>

        <div className="divide-y divide-slate-200">
          {employees.map(e => (
            <div key={e.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-bold text-slate-900">{e.full_name} ({e.email})</div>
                <div className="text-[11px] text-slate-500">{e.designation} • {e.team_name}</div>
              </div>
              <span className="px-2.5 py-1 rounded bg-slate-900 text-[#FFCC00] font-bold text-[11px]">
                {e.full_name === 'Abinaya' ? 'Manager' : 'Sales Executive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
