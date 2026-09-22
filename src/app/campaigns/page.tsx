'use client';

import React from 'react';
import { Megaphone, Plus, TrendingUp, DollarSign } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function CampaignsPage() {
  const { campaigns } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="w-6 h-6 text-purple-600" />
            <span>CAMPAIGN MANAGEMENT MODULE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track digital marketing drives, outbound call blitzes, and field campaigns ({campaigns.length} campaigns active)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {campaigns.map(camp => (
          <div key={camp.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">{camp.name}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {camp.status}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>Type: <span className="font-semibold text-slate-800">{camp.type}</span></div>
              <div>Owner: <span className="font-semibold text-slate-800">{camp.owner_name}</span></div>
              <div>Duration: <span className="text-slate-500">{camp.start_date} to {camp.end_date}</span></div>
            </div>

            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-500">Target / Actual Leads</span>
                <div className="font-bold text-slate-900">{camp.actual_leads} / {camp.target_leads}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500">Conversions</span>
                <div className="font-bold text-emerald-700">{camp.conversions_count} Won</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500">Budget</span>
                <div className="font-bold text-slate-900">{formatINR(camp.budget, 'compact')}</div>
              </div>

              <div>
                <span className="text-[10px] text-slate-500">Revenue Generated</span>
                <div className="font-black text-slate-900">{formatINR(camp.revenue_generated, 'compact')}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
