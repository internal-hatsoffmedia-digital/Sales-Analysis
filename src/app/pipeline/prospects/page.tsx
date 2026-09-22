'use client';

import React from 'react';
import Link from 'next/link';
import { Target, Plus, ChevronRight, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function ProspectsPage() {
  const { leads, openQuickAdd } = useApp();

  const prospects = leads.filter(l => l.status === 'Prospect' || l.status === 'Interested' || l.status === 'Proposal Sent');

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-amber-600" />
            <span>PROSPECT PIPELINE MANAGEMENT</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Genuinely interested accounts moving towards proposal & closing ({prospects.length} active prospects)
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('lead')}
          className="px-4 py-2 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs rounded-lg shadow-xs"
        >
          + Add Prospect
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prospects.map(p => (
          <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">{p.company_name}</span>
              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                {p.status}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>Decision Maker: <strong className="text-slate-900">{p.contact_person}</strong></div>
              <div>Service: <span className="font-medium text-slate-800">{p.service}</span></div>
              <div>Owner: <span className="font-semibold text-slate-700">{p.assigned_employee_name}</span></div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">Expected Budget:</span>
              <span className="font-black text-slate-900 text-sm">{formatINR(p.estimated_budget, 'compact')}</span>
            </div>

            <div className="pt-2">
              <Link
                href={`/leads/${p.id}`}
                className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg flex items-center justify-center gap-1"
              >
                <span>View Prospect Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
