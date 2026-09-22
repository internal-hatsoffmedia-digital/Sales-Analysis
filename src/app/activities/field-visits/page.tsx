'use client';

import React from 'react';
import { MapPin, Plus, Calendar, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { formatINR } from '@/lib/utils';

export default function FieldVisitsPage() {
  const { fieldVisits, openQuickAdd } = useApp();

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-emerald-600" />
            <span>FIELD SALES VISIT TRACKING</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            In-person corporate client meetings, location logs, discussion summaries, and deal potentials ({fieldVisits.length} visits recorded)
          </p>
        </div>

        <button
          onClick={() => openQuickAdd('fieldvisit')}
          className="px-4 py-2 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs rounded-lg shadow-xs"
        >
          + Record Field Visit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fieldVisits.map((visit) => (
          <div key={visit.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-slate-900 text-sm">{visit.company_name}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                {visit.meeting_status}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div>Contact Person: <strong className="text-slate-900">{visit.contact_person}</strong></div>
              <div>Visited By: <span className="font-semibold text-slate-700">{visit.employee_name}</span></div>
              <div>Location: <span className="font-medium text-slate-800">{visit.location}</span></div>
              <div>Date: <span className="font-medium text-slate-800">{visit.date}</span></div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 border border-slate-200 space-y-1">
              <div className="font-bold text-slate-900 text-[11px]">Discussion Summary:</div>
              <p>{visit.discussion}</p>
              {visit.outcome && (
                <div className="text-emerald-800 font-semibold text-[11px] pt-1">
                  Outcome: {visit.outcome}
                </div>
              )}
            </div>

            {visit.potential_value && (
              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-slate-500 font-medium">Potential Deal Value:</span>
                <span className="font-black text-slate-900">{formatINR(visit.potential_value, 'full')}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
