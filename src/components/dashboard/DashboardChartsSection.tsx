'use client';

import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';

export function DashboardChartsSection() {
  const { employees } = useApp();

  const funnelData = [
    { stage: 'Total Leads', count: 865, fill: '#3B82F6' },
    { stage: 'Prospects', count: 142, fill: '#F59E0B' },
    { stage: 'Proposals', count: 51, fill: '#8B5CF6' },
    { stage: 'Won Deals', count: 17, fill: '#10B981' },
  ];

  const employeeRevenueData = employees.map(emp => ({
    name: emp.full_name,
    revenue: emp.revenue / 100000, // In Lakhs ₹
    target: emp.target / 100000,
  }));

  const sourceData = [
    { name: 'Cold Call', value: 1.8 },
    { name: 'Cold DM', value: 1.2 },
    { name: 'Field Visit', value: 2.4 },
    { name: 'Website', value: 1.6 },
    { name: 'Digital Mktg', value: 3.2 },
  ];

  const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart 1: Sales Conversion Funnel */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span>SALES PIPELINE CONVERSION FUNNEL</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Stage Volume Breakdown</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={funnelData} layout="vertical" margin={{ top: 10, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
              <XAxis type="number" stroke="#94A3B8" fontSize={11} />
              <YAxis dataKey="stage" type="category" stroke="#475569" fontSize={11} fontWeight={600} width={90} />
              <Tooltip
                formatter={(val: any) => [`${val ?? 0} Records`, 'Volume']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                {funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Employee Revenue Performance */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <PieChartIcon className="w-4 h-4 text-emerald-600" />
            <span>EMPLOYEE REVENUE VS TARGET (₹ LAKHS)</span>
          </h3>
          <span className="text-[10px] text-slate-400 font-medium">Monthly Retainer Revenue</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={employeeRevenueData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" stroke="#475569" fontSize={11} fontWeight={600} />
              <YAxis stroke="#94A3B8" fontSize={11} unit="L" />
              <Tooltip
                formatter={(val: any) => [`₹${val ?? 0} Lakhs`, 'Amount']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '12px' }}
              />
              <Bar dataKey="revenue" fill="#FFCC00" name="Achieved Revenue" radius={[4, 4, 0, 0]} />
              <Bar dataKey="target" fill="#CBD5E1" name="Target" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
