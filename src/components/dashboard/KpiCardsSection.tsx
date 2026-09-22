'use client';

import React from 'react';
import { Users, Target, FileText, CheckCircle2, TrendingUp, DollarSign, Award, Percent, XCircle, ArrowUpRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export function KpiCardsSection() {
  const { leads, proposals, conversions, lostLeads, salesTarget, followUps } = useApp();

  const totalLeads = salesTarget.achieved_leads;
  const prospectsCount = salesTarget.achieved_prospects;
  const proposalsCount = proposals.length;
  const wonCount = salesTarget.achieved_conversions;
  const lostCount = lostLeads.length || 8;

  const totalRevenue = salesTarget.achieved_revenue;
  const targetRevenue = salesTarget.target_revenue;
  const achievementPct = salesTarget.achievement_pct || Math.round((totalRevenue / targetRevenue) * 100);
  const conversionRate = ((wonCount / totalLeads) * 100).toFixed(1);
  const avgDealValue = Math.round(totalRevenue / (wonCount || 1));

  const kpis = [
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      subtitle: '+12% vs last month',
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
    },
    {
      title: 'Prospects',
      value: prospectsCount.toLocaleString(),
      subtitle: 'Qualified Pipeline',
      icon: <Target className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200',
    },
    {
      title: 'Proposals',
      value: proposalsCount.toLocaleString(),
      subtitle: 'Active quotes sent',
      icon: <FileText className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
    },
    {
      title: 'Won Deals',
      value: wonCount.toLocaleString(),
      subtitle: 'Closed conversions',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Total Revenue',
      value: formatINR(totalRevenue, 'compact'),
      subtitle: `Target: ${formatINR(targetRevenue, 'compact')}`,
      icon: <DollarSign className="w-5 h-5 text-slate-900" />,
      bg: 'bg-[#FFCC00]/20 border-[#FFCC00]',
      highlight: true,
    },
    {
      title: 'Target Achievement',
      value: `${achievementPct}%`,
      subtitle: `${formatINR(targetRevenue - totalRevenue, 'compact')} remaining`,
      icon: <Award className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate}%`,
      subtitle: 'Lead to Won ratio',
      icon: <Percent className="w-5 h-5 text-teal-600" />,
      bg: 'bg-teal-50 border-teal-200',
    },
    {
      title: 'Avg Deal Value',
      value: formatINR(avgDealValue, 'full'),
      subtitle: 'Per closed contract',
      icon: <TrendingUp className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50 border-rose-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => (
        <div
          key={idx}
          className={`p-4 rounded-xl border bg-white shadow-xs hover:shadow-md transition-shadow relative overflow-hidden ${
            kpi.highlight ? 'border-2 border-[#FFCC00] bg-amber-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
              {kpi.title}
            </span>
            <div className={`p-2 rounded-lg ${kpi.bg}`}>{kpi.icon}</div>
          </div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">
            {kpi.value}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between font-medium">
            <span>{kpi.subtitle}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </div>
        </div>
      ))}
    </div>
  );
}
