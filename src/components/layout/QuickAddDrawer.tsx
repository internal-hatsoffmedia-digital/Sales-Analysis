'use client';

import React, { useState } from 'react';
import { X, Building2, User, Phone, Mail, MapPin, DollarSign, Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { LeadSource, Priority, FollowUpType } from '@/types';

export function QuickAddDrawer() {
  const { isQuickAddOpen, setIsQuickAddOpen, quickAddType, addLead, addFollowUp, createProposal, addFieldVisit, employees, leads } = useApp();

  const [activeTab, setActiveTab] = useState<'lead' | 'followup' | 'call' | 'fieldvisit' | 'proposal'>(quickAddType as any || 'lead');

  // Form states
  const [companyName, setCompanyName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [source, setSource] = useState<LeadSource>('Cold Call');
  const [service, setService] = useState('Social Media Management');
  const [budget, setBudget] = useState('100000');
  const [assignedEmp, setAssignedEmp] = useState('emp-01');
  const [priority, setPriority] = useState<Priority>('High');

  const [selectedLeadId, setSelectedLeadId] = useState(leads[0]?.id || '');
  const [followupDate, setFollowupDate] = useState('2026-09-23');
  const [followupTime, setFollowupTime] = useState('11:00');
  const [followupType, setFollowupType] = useState<FollowUpType>('Call');
  const [purpose, setPurpose] = useState('');

  const [visitLocation, setVisitLocation] = useState('');
  const [visitDiscussion, setVisitDiscussion] = useState('');

  const [proposalValue, setProposalValue] = useState('150000');

  if (!isQuickAddOpen) return null;

  const handleSubmitLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactPerson) return;

    const emp = employees.find(e => e.id === assignedEmp);

    addLead({
      company_name: companyName,
      contact_person: contactPerson,
      phone: phone || '+91 98000 00000',
      email: email || `${contactPerson.toLowerCase().replace(/\s+/g, '')}@example.com`,
      location: 'Mumbai',
      source,
      service,
      estimated_budget: Number(budget),
      assigned_employee_id: assignedEmp,
      assigned_employee_name: emp?.full_name || 'Unassigned',
      status: 'New',
      priority,
      next_followup_date: followupDate,
      next_followup_time: followupTime,
      created_by: 'Current User',
    });

    setIsQuickAddOpen(false);
    resetForms();
  };

  const handleSubmitFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLead = leads.find(l => l.id === selectedLeadId);
    if (!targetLead) return;

    addFollowUp({
      lead_id: targetLead.id,
      company_name: targetLead.company_name,
      contact_person: targetLead.contact_person,
      phone: targetLead.phone,
      assigned_employee_id: targetLead.assigned_employee_id,
      assigned_employee_name: targetLead.assigned_employee_name,
      type: followupType,
      followup_date: followupDate,
      followup_time: followupTime,
      priority,
      purpose: purpose || 'Follow up discussion',
      status: 'Upcoming',
    });

    setIsQuickAddOpen(false);
    resetForms();
  };

  const handleSubmitFieldVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const emp = employees.find(e => e.id === assignedEmp);

    addFieldVisit({
      employee_id: assignedEmp,
      employee_name: emp?.full_name || 'Staff',
      date: followupDate,
      company_name: companyName || 'Client Visit',
      contact_person: contactPerson || 'Decision Maker',
      location: visitLocation || 'Mumbai Office',
      visit_purpose: purpose || 'In-person Pitch',
      meeting_status: 'Completed',
      discussion: visitDiscussion || 'Discussed marketing strategy.',
      potential_value: Number(budget),
    });

    setIsQuickAddOpen(false);
    resetForms();
  };

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault();
    const targetLead = leads.find(l => l.id === selectedLeadId);
    if (!targetLead) return;

    createProposal({
      lead_id: targetLead.id,
      company_name: targetLead.company_name,
      contact_person: targetLead.contact_person,
      proposal_date: new Date().toISOString().split('T')[0],
      proposal_value: Number(proposalValue),
      service: targetLead.service,
      status: 'Sent',
      sent_by_id: assignedEmp,
      sent_by_name: employees.find(e => e.id === assignedEmp)?.full_name || 'Staff',
      expected_decision_date: followupDate,
      notes: purpose || 'Standard proposal terms.',
    });

    setIsQuickAddOpen(false);
    resetForms();
  };

  const resetForms = () => {
    setCompanyName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setPurpose('');
    setVisitLocation('');
    setVisitDiscussion('');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FFCC00] text-slate-950 flex items-center justify-center font-bold text-lg">
              +
            </div>
            <div>
              <h2 className="font-extrabold text-sm tracking-wide text-white">QUICK WORKBENCH</h2>
              <p className="text-[11px] text-slate-400">Fast action logger for daily sales tasks</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('lead')}
            className={`flex-1 py-2.5 px-3 border-b-2 text-center whitespace-nowrap ${
              activeTab === 'lead'
                ? 'border-[#FFCC00] text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Lead
          </button>
          <button
            onClick={() => setActiveTab('followup')}
            className={`flex-1 py-2.5 px-3 border-b-2 text-center whitespace-nowrap ${
              activeTab === 'followup'
                ? 'border-[#FFCC00] text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Follow-up
          </button>
          <button
            onClick={() => setActiveTab('fieldvisit')}
            className={`flex-1 py-2.5 px-3 border-b-2 text-center whitespace-nowrap ${
              activeTab === 'fieldvisit'
                ? 'border-[#FFCC00] text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Field Visit
          </button>
          <button
            onClick={() => setActiveTab('proposal')}
            className={`flex-1 py-2.5 px-3 border-b-2 text-center whitespace-nowrap ${
              activeTab === 'proposal'
                ? 'border-[#FFCC00] text-slate-900 font-bold bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Proposal
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs">
          {activeTab === 'lead' && (
            <form onSubmit={handleSubmitLead} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Apex Global Solutions"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Sharma"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                  <select
                    value={source}
                    onChange={(e) => setSource(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Cold Call">Cold Call</option>
                    <option value="Cold DM">Cold DM</option>
                    <option value="Field Visit">Field Visit</option>
                    <option value="Website">Website</option>
                    <option value="Digital Marketing">Digital Marketing</option>
                    <option value="Referral">Referral</option>
                    <option value="Social Media">Social Media</option>
                    <option value="WhatsApp">WhatsApp</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Sales Rep</label>
                  <select
                    value={assignedEmp}
                    onChange={(e) => setAssignedEmp(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.full_name} ({emp.team_name})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Service Interested</label>
                  <input
                    type="text"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Estimated Budget (₹)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Next Follow-up Date</label>
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold rounded-lg shadow-sm text-xs mt-4"
              >
                Create Lead Now
              </button>
            </form>
          )}

          {activeTab === 'followup' && (
            <form onSubmit={handleSubmitFollowUp} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Lead *</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.company_name} — {lead.contact_person} ({lead.status})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-up Type</label>
                  <select
                    value={followupType}
                    onChange={(e) => setFollowupType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="Call">Call</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Email">Email</option>
                    <option value="Meeting">Meeting</option>
                    <option value="Field Visit">Field Visit</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Follow-up Date</label>
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={followupTime}
                    onChange={(e) => setFollowupTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details about what to discuss..."
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold rounded-lg shadow-sm text-xs mt-4"
              >
                Schedule Follow-up
              </button>
            </form>
          )}

          {activeTab === 'fieldvisit' && (
            <form onSubmit={handleSubmitFieldVisit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  placeholder="Target company name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Contact Person</label>
                  <input
                    type="text"
                    placeholder="Person visited"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Bandra, Mumbai"
                    value={visitLocation}
                    onChange={(e) => setVisitLocation(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discussion Summary</label>
                <textarea
                  rows={3}
                  placeholder="Key discussion points, feedback, requirements..."
                  value={visitDiscussion}
                  onChange={(e) => setVisitDiscussion(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold rounded-lg shadow-sm text-xs mt-4"
              >
                Record Field Visit
              </button>
            </form>
          )}

          {activeTab === 'proposal' && (
            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Lead / Prospect</label>
                <select
                  value={selectedLeadId}
                  onChange={(e) => setSelectedLeadId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-white"
                >
                  {leads.map((lead) => (
                    <option key={lead.id} value={lead.id}>
                      {lead.company_name} — {lead.contact_person} (Budget: ₹{lead.estimated_budget.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proposal Value (₹)</label>
                  <input
                    type="number"
                    value={proposalValue}
                    onChange={(e) => setProposalValue(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Expected Decision Date</label>
                  <input
                    type="date"
                    value={followupDate}
                    onChange={(e) => setFollowupDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold rounded-lg shadow-sm text-xs mt-4"
              >
                Create & Send Proposal
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
