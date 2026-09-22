'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Award, DollarSign, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function ConversionsPage() {
  const { conversions } = useApp();

  const totalWonRevenue = conversions.reduce((acc, c) => acc + c.final_deal_value, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            <span>CLOSED-WON CONVERSIONS & REVENUE LOG</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Successfully closed client retainers & contracts ({conversions.length} conversions logged, Total: {formatINR(totalWonRevenue, 'full')})
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="p-3.5">Conversion ID</th>
              <th className="p-3.5">Company Name</th>
              <th className="p-3.5">Sales Executive</th>
              <th className="p-3.5">Service</th>
              <th className="p-3.5">Lead Source</th>
              <th className="p-3.5">Campaign</th>
              <th className="p-3.5">Deal Value</th>
              <th className="p-3.5">Converted Date</th>
              <th className="p-3.5">Payment Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {conversions.map((conv) => (
              <tr key={conv.id} className="hover:bg-emerald-50/40 transition-colors">
                <td className="p-3.5 font-bold text-emerald-700">{conv.conversion_code}</td>
                <td className="p-3.5 font-extrabold text-slate-900">{conv.company_name}</td>
                <td className="p-3.5 font-semibold text-slate-800">{conv.sales_executive_name}</td>
                <td className="p-3.5 text-slate-700">{conv.service}</td>
                <td className="p-3.5 text-slate-600">{conv.original_lead_source}</td>
                <td className="p-3.5 text-slate-500">{conv.campaign_name || 'Direct'}</td>
                <td className="p-3.5 font-black text-slate-900">{formatINR(conv.final_deal_value, 'full')}</td>
                <td className="p-3.5 font-medium text-slate-700">{conv.converted_date}</td>
                <td className="p-3.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px] border border-emerald-200">
                    {conv.payment_status}
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
