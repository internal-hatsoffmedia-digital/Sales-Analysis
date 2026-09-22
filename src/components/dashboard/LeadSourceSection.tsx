'use client';

import React from 'react';
import { Layers, ArrowRight, BarChart2 } from 'lucide-react';
import { formatINR } from '@/lib/utils';

export function LeadSourceSection() {
  const leadSources = [
    { source: 'Cold Call', leads: 120, won: 4, revenue: 180000, conversionRate: '3.3%' },
    { source: 'Cold DM', leads: 85, won: 3, revenue: 120000, conversionRate: '3.5%' },
    { source: 'Field Visit', leads: 45, won: 5, revenue: 240000, conversionRate: '11.1%', highlight: true },
    { source: 'Website', leads: 180, won: 4, revenue: 160000, conversionRate: '2.2%' },
    { source: 'Digital Mktg', leads: 150, won: 5, revenue: 320000, conversionRate: '3.3%', topRevenue: true },
    { source: 'Referral', leads: 95, won: 3, revenue: 150000, conversionRate: '3.1%' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-teal-600" />
            <span>LEAD SOURCE PERFORMANCE</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quantity vs Conversion Quality across marketing and outbound channels
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leadSources.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border bg-white space-y-3 relative transition-all hover:shadow-md ${
              item.highlight
                ? 'border-emerald-300 bg-emerald-50/20'
                : item.topRevenue
                ? 'border-[#FFCC00] bg-amber-50/20'
                : 'border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">{item.source}</span>
              {item.highlight && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Highest Conv %
                </span>
              )}
              {item.topRevenue && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FFCC00] text-slate-950">
                  Top Revenue
                </span>
              )}
            </div>

            <div className="flex items-center justify-between text-xs py-1 border-y border-slate-100">
              <span className="text-slate-600 font-medium">Volume:</span>
              <span className="font-extrabold text-slate-900">{item.leads} Leads</span>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Conversions:</span>
              <div className="flex items-center gap-1 font-extrabold text-emerald-700">
                <span>{item.won} Won</span>
                <ArrowRight className="w-3 h-3" />
                <span>{item.conversionRate}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-600 font-medium">Revenue Generated:</span>
              <span className="font-black text-slate-900 text-sm">
                {formatINR(item.revenue, 'compact')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
