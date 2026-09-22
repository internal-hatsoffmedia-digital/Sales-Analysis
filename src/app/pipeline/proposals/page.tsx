'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Plus, ChevronRight, Download, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR, getStatusBadgeClass } from '@/lib/utils';

export default function ProposalsPage() {
  const { proposals, openQuickAdd } = useApp();

  const totalValue = proposals.reduce((acc, p) => acc + p.proposal_value, 0);

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            <span>PROPOSAL TRACKING MODULE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track active quotes, sent proposals, and closing decision dates ({proposals.length} active proposals totaling {formatINR(totalValue, 'compact')})
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('proposal')}
          className="px-4 py-2 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs rounded-lg shadow-xs"
        >
          + Create Proposal
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="p-3.5">Proposal Code</th>
              <th className="p-3.5">Company Name</th>
              <th className="p-3.5">Contact Person</th>
              <th className="p-3.5">Service</th>
              <th className="p-3.5">Proposal Date</th>
              <th className="p-3.5">Proposal Value</th>
              <th className="p-3.5">Sent By</th>
              <th className="p-3.5">Expected Decision</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {proposals.map((prop) => (
              <tr key={prop.id} className="hover:bg-amber-50/30 transition-colors">
                <td className="p-3.5 font-bold text-purple-700">{prop.proposal_code}</td>
                <td className="p-3.5 font-extrabold text-slate-900">{prop.company_name}</td>
                <td className="p-3.5 font-medium text-slate-800">{prop.contact_person}</td>
                <td className="p-3.5 text-slate-700">{prop.service}</td>
                <td className="p-3.5 text-slate-600">{prop.proposal_date}</td>
                <td className="p-3.5 font-black text-slate-900">{formatINR(prop.proposal_value, 'full')}</td>
                <td className="p-3.5 font-semibold text-slate-700">{prop.sent_by_name}</td>
                <td className="p-3.5 font-medium text-amber-900">{prop.expected_decision_date}</td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(prop.status)}`}>
                    {prop.status}
                  </span>
                </td>
                <td className="p-3.5 text-right">
                  <Link
                    href={`/leads/${prop.lead_id}`}
                    className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                  >
                    View Lead
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
