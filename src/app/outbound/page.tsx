'use client';

import React from 'react';
import { PhoneCall, MessageSquare, Mail, Users, TrendingUp } from 'lucide-react';

export default function OutboundPage() {
  const outboundMetrics = [
    { title: 'Cold Calls Made', count: 480, icon: <PhoneCall className="w-5 h-5 text-blue-600" /> },
    { title: 'Cold DMs Sent', count: 320, icon: <MessageSquare className="w-5 h-5 text-purple-600" /> },
    { title: 'Emails Sent', count: 650, icon: <Mail className="w-5 h-5 text-emerald-600" /> },
    { title: 'WhatsApp Outreach', count: 290, icon: <MessageSquare className="w-5 h-5 text-amber-600" /> },
    { title: 'Positive Responses', count: 142, icon: <TrendingUp className="w-5 h-5 text-indigo-600" /> },
    { title: 'Interested Leads', count: 85, icon: <Users className="w-5 h-5 text-teal-600" /> },
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <PhoneCall className="w-6 h-6 text-blue-600" />
            <span>OUTBOUND SALES CONTROL MODULE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Cold outreach volume, email campaigns, WhatsApp touches, and response conversion rates
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {outboundMetrics.map((item, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase">{item.title}</span>
              <div className="p-2 rounded-lg bg-slate-100">{item.icon}</div>
            </div>
            <div className="text-2xl font-black text-slate-900">{item.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
