'use client';

import React, { useState } from 'react';
import { 
  AlertCircle, Clock, CalendarCheck, CheckCircle2, PhoneCall, MessageSquare, 
  MoreHorizontal, ChevronRight, Check, RefreshCw, FileText, ExternalLink, AlertTriangle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getStatusBadgeClass, getPriorityBadgeClass } from '@/lib/utils';
import Link from 'next/link';

export function FollowUpControlSection() {
  const { followUps, completeFollowUp } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Overdue' | 'Today' | 'Upcoming'>('All');
  const [selectedFuForComplete, setSelectedFuForComplete] = useState<string | null>(null);
  const [outcomeNotes, setOutcomeNotes] = useState('');
  const [nextDate, setNextDate] = useState('2026-09-24');
  const [nextTime, setNextTime] = useState('11:00');
  const [nextPurpose, setNextPurpose] = useState('');

  const overdueCount = followUps.filter(f => f.status === 'Overdue').length;
  const todayCount = followUps.filter(f => f.status === 'Today').length;
  const upcomingCount = followUps.filter(f => f.status === 'Upcoming').length;
  const completedCount = followUps.filter(f => f.status === 'Completed').length;

  const filteredFollowups = followUps.filter(f => {
    if (activeTab === 'Overdue') return f.status === 'Overdue';
    if (activeTab === 'Today') return f.status === 'Today';
    if (activeTab === 'Upcoming') return f.status === 'Upcoming';
    return f.status === 'Overdue' || f.status === 'Today';
  });

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFuForComplete) return;

    completeFollowUp(selectedFuForComplete, outcomeNotes || 'Follow-up completed.', {
      date: nextDate,
      time: nextTime,
      type: 'Call',
      purpose: nextPurpose || 'Next follow-up',
    });

    setSelectedFuForComplete(null);
    setOutcomeNotes('');
    setNextPurpose('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>FOLLOW-UP CONTROL CENTER</span>
            <span className="text-xs bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded border border-rose-200">
              High Priority Focus
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Never lose a prospect due to missed follow-ups
          </p>
        </div>

        <Link
          href="/activities/follow-ups"
          className="text-xs font-bold text-slate-900 hover:text-[#FFCC00] flex items-center gap-1"
        >
          <span>View All Agenda</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Summary Indicator Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveTab('Overdue')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'Overdue'
              ? 'bg-rose-50 border-rose-400 ring-2 ring-rose-400/30'
              : 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase">OVERDUE</span>
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
          </div>
          <div className="text-2xl font-black text-rose-900 mt-1">{overdueCount}</div>
          <div className="text-[10px] text-rose-700 font-medium">Requires immediate action</div>
        </button>

        <button
          onClick={() => setActiveTab('Today')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'Today'
              ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-400/30'
              : 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase">TODAY</span>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">{todayCount}</div>
          <div className="text-[10px] text-amber-800 font-medium">Scheduled for today</div>
        </button>

        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`p-3 rounded-xl border text-left transition-all ${
            activeTab === 'Upcoming'
              ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-400/30'
              : 'bg-emerald-50/50 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase">UPCOMING</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-2xl font-black text-emerald-950 mt-1">{upcomingCount}</div>
          <div className="text-[10px] text-emerald-700 font-medium">Future scheduled queue</div>
        </button>

        <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-left">
          <span className="text-xs font-bold text-slate-500 uppercase">COMPLETED</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{completedCount}</div>
          <div className="text-[10px] text-slate-500 font-medium">This month</div>
        </div>
      </div>

      {/* Follow-up Action Table */}
      <div className="overflow-x-auto border border-slate-200 rounded-lg">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
              <th className="p-3">Status</th>
              <th className="p-3">Lead / Company</th>
              <th className="p-3">Contact & Phone</th>
              <th className="p-3">Assigned Rep</th>
              <th className="p-3">Type</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Priority</th>
              <th className="p-3">Last Activity</th>
              <th className="p-3 text-right">Quick Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {filteredFollowups.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-slate-400 font-medium">
                  No follow-ups found in this filter category.
                </td>
              </tr>
            ) : (
              filteredFollowups.map((fu) => (
                <tr
                  key={fu.id}
                  className={`hover:bg-slate-50 transition-colors ${
                    fu.status === 'Overdue' ? 'bg-rose-50/30' : ''
                  }`}
                >
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(fu.status)}`}>
                      {fu.status}
                    </span>
                  </td>
                  <td className="p-3 font-bold text-slate-900">
                    <Link href={`/leads/${fu.lead_id}`} className="hover:underline">
                      {fu.company_name}
                    </Link>
                  </td>
                  <td className="p-3">
                    <div className="font-semibold text-slate-800">{fu.contact_person}</div>
                    <div className="text-[11px] text-slate-500">{fu.phone}</div>
                  </td>
                  <td className="p-3 font-medium text-slate-700">{fu.assigned_employee_name}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-semibold text-[10px] border border-slate-200">
                      {fu.type}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <div className="font-semibold text-slate-800">{fu.followup_date}</div>
                    <div className="text-[11px] text-slate-500">{fu.followup_time}</div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadgeClass(fu.priority)}`}>
                      {fu.priority}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 max-w-xs truncate" title={fu.last_activity}>
                    {fu.last_activity || fu.purpose}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={`tel:${fu.phone}`}
                        className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700"
                        title="Call"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`https://wa.me/${fu.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => setSelectedFuForComplete(fu.id)}
                        className="px-2.5 py-1 rounded bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-[11px] shadow-xs"
                      >
                        Complete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Completion Modal Popover */}
      {selectedFuForComplete && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">COMPLETE FOLLOW-UP</h3>
              <button onClick={() => setSelectedFuForComplete(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Outcome & Discussion Notes *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record call summary, client feedback, next steps..."
                  value={outcomeNotes}
                  onChange={(e) => setOutcomeNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg space-y-2">
                <div className="font-bold text-amber-900 text-xs">Schedule Next Follow-up (Recommended)</div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-amber-800">Date</label>
                    <input
                      type="date"
                      value={nextDate}
                      onChange={(e) => setNextDate(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-amber-800">Time</label>
                    <input
                      type="time"
                      value={nextTime}
                      onChange={(e) => setNextTime(e.target.value)}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] text-amber-800">Purpose</label>
                  <input
                    type="text"
                    placeholder="Next objective..."
                    value={nextPurpose}
                    onChange={(e) => setNextPurpose(e.target.value)}
                    className="w-full p-1.5 border border-slate-300 rounded bg-white text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedFuForComplete(null)}
                  className="px-3 py-1.5 rounded bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold shadow-xs"
                >
                  Mark Complete & Next Follow-up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
