'use client';

import React from 'react';
import Link from 'next/link';
import { UserCheck, Mail, Phone, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function TeamMembersPage() {
  const { employees } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-indigo-600" />
            <span>SALES TEAM DIRECTORY</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Active sales executives, account managers, and field staff ({employees.length} team members)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {employees.map(emp => (
          <div key={emp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-[#FFCC00] flex items-center justify-center font-bold text-lg">
                {emp.full_name.charAt(0)}
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm">{emp.full_name}</h3>
                <p className="text-xs text-slate-500">{emp.designation}</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{emp.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{emp.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-medium text-slate-800">{emp.team_name}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/team/${emp.id}`}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center justify-center"
              >
                View Performance Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
