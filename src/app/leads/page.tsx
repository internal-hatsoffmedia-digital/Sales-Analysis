'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Users, Search, Filter, Plus, Download, ChevronRight, PhoneCall, 
  MessageSquare, MoreHorizontal, UserCheck, Eye, CheckCircle2, XCircle
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { getStatusBadgeClass, getPriorityBadgeClass, formatINR } from '@/lib/utils';
import { LeadStatus, LeadSource, Priority } from '@/types';

export default function LeadMasterPage() {
  const { leads, employees, updateLeadStatus, openQuickAdd } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');

  const filteredLeads = leads.filter(lead => {
    const matchesSearch =
      lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.lead_code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    const matchesEmp = employeeFilter === 'all' || lead.assigned_employee_id === employeeFilter;

    return matchesSearch && matchesStatus && matchesSource && matchesPriority && matchesEmp;
  });

  const exportCSV = () => {
    const headers = ['Lead ID', 'Company Name', 'Contact Person', 'Phone', 'Source', 'Service', 'Assigned To', 'Status', 'Priority', 'Budget'];
    const rows = filteredLeads.map(l => [
      l.lead_code,
      `"${l.company_name}"`,
      `"${l.contact_person}"`,
      l.phone,
      l.source,
      `"${l.service}"`,
      `"${l.assigned_employee_name}"`,
      l.status,
      l.priority,
      l.estimated_budget,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Hatsoff_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            <span>LEAD MASTER DATABASE</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Complete list of all inbound and outbound sales opportunities ({filteredLeads.length} leads displayed)
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-200"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => openQuickAdd('lead')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search company, contact, phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Lead Status"
            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="all">All Lead Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Follow-up">Follow-up</option>
            <option value="Interested">Interested</option>
            <option value="Prospect">Prospect</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Source Filter */}
        <div>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            aria-label="Filter by Lead Source"
            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="all">All Lead Sources</option>
            <option value="Cold Call">Cold Call</option>
            <option value="Cold DM">Cold DM</option>
            <option value="Field Visit">Field Visit</option>
            <option value="Website">Website</option>
            <option value="Digital Marketing">Digital Marketing</option>
            <option value="Referral">Referral</option>
          </select>
        </div>

        {/* Employee Filter */}
        <div>
          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            aria-label="Filter by Assigned Sales Executive"
            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="all">All Sales Executives</option>
            {employees.map(e => (
              <option key={e.id} value={e.id}>{e.full_name}</option>
            ))}
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by Lead Priority"
            className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
          >
            <option value="all">All Priorities</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                <th className="p-3.5">Lead ID</th>
                <th className="p-3.5">Company Name</th>
                <th className="p-3.5">Contact Person</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Est. Budget</th>
                <th className="p-3.5">Assigned Rep</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Next Follow-up</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={11} className="p-8 text-center text-slate-400 font-medium">
                    No leads match your criteria.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-amber-50/30 transition-colors">
                    <td className="p-3.5 font-bold text-slate-500">{lead.lead_code}</td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      <Link href={`/leads/${lead.id}`} className="hover:underline hover:text-blue-600">
                        {lead.company_name}
                      </Link>
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-slate-800">{lead.contact_person}</div>
                      <div className="text-[11px] text-slate-500">{lead.phone}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-medium text-[11px]">
                        {lead.source}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-xs truncate" title={lead.service}>
                      {lead.service}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      {formatINR(lead.estimated_budget, 'compact')}
                    </td>
                    <td className="p-3.5 font-semibold text-slate-700">{lead.assigned_employee_name}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadgeClass(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getPriorityBadgeClass(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <div className="font-medium text-slate-800">{lead.next_followup_date}</div>
                      <div className="text-[10px] text-slate-400">{lead.next_followup_time}</div>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/leads/${lead.id}`}
                          className="p-1.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
