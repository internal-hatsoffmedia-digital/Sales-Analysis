'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, User, Phone, Mail, MapPin, Globe, Calendar, Clock, 
  DollarSign, CheckCircle2, XCircle, FileText, MessageSquare, PhoneCall, 
  Plus, History, ArrowLeft, Award, Sparkles, Tag, Shield
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getStatusBadgeClass, getPriorityBadgeClass, formatINR } from '@/lib/utils';
import { LeadStatus } from '@/types';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { leads, followUps, proposals, activities, updateLeadStatus, recordConversion, markLeadLost, openQuickAdd } = useApp();

  const leadId = params.id as string;
  const lead = leads.find(l => l.id === leadId) || leads[0];

  const leadFollowups = followUps.filter(f => f.lead_id === lead.id);
  const leadProposals = proposals.filter(p => p.lead_id === lead.id);
  const leadActivities = activities.filter(a => a.lead_id === lead.id);

  const [showLostModal, setShowLostModal] = useState(false);
  const [lostReason, setLostReason] = useState<any>('High Price');
  const [competitor, setCompetitor] = useState('');
  const [lostNotes, setLostNotes] = useState('');

  const [showWonModal, setShowWonModal] = useState(false);
  const [finalValue, setFinalValue] = useState(lead.estimated_budget.toString());

  const handleMarkWon = (e: React.FormEvent) => {
    e.preventDefault();
    recordConversion({
      lead_id: lead.id,
      company_name: lead.company_name,
      sales_executive_id: lead.assigned_employee_id,
      sales_executive_name: lead.assigned_employee_name,
      service: lead.service,
      original_lead_source: lead.source,
      proposal_value: lead.estimated_budget,
      final_deal_value: Number(finalValue),
      converted_date: new Date().toISOString().split('T')[0],
      payment_status: 'Paid Full',
      notes: 'Converted from Lead Detail page',
    });
    setShowWonModal(false);
  };

  const handleMarkLostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markLeadLost(lead.id, lostReason, competitor, lostNotes);
    setShowLostModal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Lead Master</span>
      </button>

      {/* Main CRM Header Card */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-[#FFCC00] flex items-center justify-center font-black text-xl shadow-sm">
              {lead.company_name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {lead.company_name}
                </h1>
                <span className="text-xs text-slate-500 font-mono font-bold">({lead.lead_code})</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${getStatusBadgeClass(lead.status)}`}>
                  {lead.status}
                </span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getPriorityBadgeClass(lead.priority)}`}>
                  {lead.priority} Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-4">
                <span>Contact: <strong>{lead.contact_person}</strong></span>
                <span>Assigned Rep: <strong>{lead.assigned_employee_name}</strong></span>
                <span>Source: <strong>{lead.source}</strong></span>
              </p>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`tel:${lead.phone}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold text-xs hover:bg-blue-100"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Call</span>
            </a>
            <a
              href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold text-xs hover:bg-emerald-100"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
            <button
              onClick={() => openQuickAdd('followup')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Follow-up</span>
            </button>
            <button
              onClick={() => openQuickAdd('proposal')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>+ Proposal</span>
            </button>
            <button
              onClick={() => setShowWonModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Won</span>
            </button>
            <button
              onClick={() => setShowLostModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs border border-rose-200"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Mark Lost</span>
            </button>
          </div>
        </div>

        {/* Lead Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500">Estimated Budget</span>
            <div className="font-extrabold text-slate-900 text-sm">
              {formatINR(lead.estimated_budget, 'full')}
            </div>
          </div>
          <div>
            <span className="text-slate-500">Service Required</span>
            <div className="font-bold text-slate-800 truncate" title={lead.service}>{lead.service}</div>
          </div>
          <div>
            <span className="text-slate-500">Next Follow-up</span>
            <div className="font-bold text-amber-900">{lead.next_followup_date} ({lead.next_followup_time})</div>
          </div>
          <div>
            <span className="text-slate-500">Location</span>
            <div className="font-bold text-slate-800">{lead.location}</div>
          </div>
        </div>
      </div>

      {/* Main Details & Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Information Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead & Contact Details */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2">
              Lead & Contact Profile
            </h2>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-500 font-medium">Contact Person</span>
                <div className="font-bold text-slate-900">{lead.contact_person}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Phone Number</span>
                <div className="font-bold text-slate-900">{lead.phone}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Email Address</span>
                <div className="font-bold text-slate-900">{lead.email}</div>
              </div>
              <div>
                <span className="text-slate-500 font-medium">Website</span>
                <div className="font-bold text-blue-600">{lead.website || 'N/A'}</div>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 font-medium">Initial Notes & Requirements</span>
                <p className="p-3 bg-slate-50 rounded-lg text-slate-700 mt-1 border border-slate-200">
                  {lead.notes || 'No notes attached.'}
                </p>
              </div>
            </div>
          </div>

          {/* Proposals History */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                Proposals History ({leadProposals.length})
              </h2>
              <button onClick={() => openQuickAdd('proposal')} className="text-xs font-bold text-blue-600">
                + Create Proposal
              </button>
            </div>
            {leadProposals.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No proposals generated yet for this lead.</p>
            ) : (
              <div className="space-y-2">
                {leadProposals.map(p => (
                  <div key={p.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{p.proposal_code} — {formatINR(p.proposal_value, 'full')}</div>
                      <div className="text-[11px] text-slate-500">Sent on {p.proposal_date} by {p.sent_by_name}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Follow-ups List */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide">
                Scheduled Follow-ups ({leadFollowups.length})
              </h2>
              <button onClick={() => openQuickAdd('followup')} className="text-xs font-bold text-blue-600">
                + Schedule Follow-up
              </button>
            </div>
            {leadFollowups.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No follow-ups recorded.</p>
            ) : (
              <div className="space-y-2">
                {leadFollowups.map(f => (
                  <div key={f.id} className="p-3 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{f.type} ({f.followup_date} at {f.followup_time})</div>
                      <div className="text-[11px] text-slate-500">{f.purpose}</div>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(f.status)}`}>
                      {f.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Activity Timeline */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-extrabold text-slate-900 text-sm uppercase tracking-wide border-b border-slate-100 pb-2 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <span>ACTIVITY TIMELINE</span>
          </h2>
          <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {leadActivities.length === 0 ? (
              <div className="pl-6 text-xs text-slate-400">No activity logged yet.</div>
            ) : (
              leadActivities.map(act => (
                <div key={act.id} className="relative pl-7 text-xs space-y-1">
                  <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-[#FFCC00] border-2 border-white ring-2 ring-slate-200" />
                  <div className="font-bold text-slate-900">{act.description}</div>
                  <div className="text-[10px] text-slate-400">
                    By {act.author_name} • {act.timestamp}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Mark Won Modal */}
      {showWonModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">MARK DEAL AS WON 🎉</h3>
              <button onClick={() => setShowWonModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleMarkWon} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Final Deal Value (₹)</label>
                <input
                  type="number"
                  required
                  value={finalValue}
                  onChange={(e) => setFinalValue(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 shadow-xs"
              >
                Confirm Closed-Won Conversion
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mark Lost Modal */}
      {showLostModal && (
        <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 space-y-4 border border-slate-200 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900">MARK LEAD AS LOST</h3>
              <button onClick={() => setShowLostModal(false)} className="text-slate-400">✕</button>
            </div>
            <form onSubmit={handleMarkLostSubmit} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lost Reason *</label>
                <select
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="High Price">High Price</option>
                  <option value="Competitor">Competitor</option>
                  <option value="No Response">No Response</option>
                  <option value="Requirement Dropped">Requirement Dropped</option>
                  <option value="Budget Issue">Budget Issue</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Delayed Decision">Delayed Decision</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Competitor Name (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. MediaAgency XYZ"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={lostNotes}
                  onChange={(e) => setLostNotes(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 shadow-xs"
              >
                Confirm Mark Lost
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
