'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Plus, Bell, Calendar, User, Filter, 
  PhoneCall, MapPin, FileText, CheckCircle2, ChevronDown, 
  X, AlertCircle, ShieldAlert, Sparkles, Building2
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { UserRole, DateFilterRange } from '@/types';
import Link from 'next/link';

export function ControlHeader() {
  const {
    currentRole,
    setCurrentRole,
    dateFilter,
    setDateFilter,
    selectedEmployeeFilter,
    setSelectedEmployeeFilter,
    employees,
    leads,
    proposals,
    notifications,
    markNotificationRead,
    openQuickAdd,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  // Filter search results grouped by type
  const matchingLeads = searchQuery.trim()
    ? leads.filter(
        l =>
          l.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.contact_person.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.phone.includes(searchQuery) ||
          l.lead_code.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : [];

  const matchingProposals = searchQuery.trim()
    ? proposals.filter(
        p =>
          p.proposal_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingEmployees = searchQuery.trim()
    ? employees.filter(
        e =>
          e.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.designation.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const hasSearchResults =
    matchingLeads.length > 0 || matchingProposals.length > 0 || matchingEmployees.length > 0;

  // Close popovers on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setIsAddMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-20 px-6 flex items-center justify-between shadow-xs">
      {/* Left Title & Global Search */}
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>HATSOFF CONTROL CENTER</span>
            <span className="text-[10px] bg-[#FFCC00] text-slate-900 font-bold px-2 py-0.5 rounded uppercase">
              Live Operations
            </span>
          </h1>
        </div>

        {/* Global Search Bar */}
        <div ref={searchRef} className="relative w-72">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Global Search (Lead ID, Company, Phone)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full pl-9 pr-8 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#FFCC00] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Grouped Search Results Popover */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-96 bg-white border border-slate-200 rounded-xl shadow-xl py-2 z-50 text-xs">
              {!hasSearchResults ? (
                <div className="p-4 text-center text-slate-400">
                  No matching leads, proposals, or staff found for &quot;{searchQuery}&quot;
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {matchingLeads.length > 0 && (
                    <div>
                      <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50 border-y border-slate-100">
                        Leads ({matchingLeads.length})
                      </div>
                      {matchingLeads.map((lead) => (
                        <Link
                          key={lead.id}
                          href={`/leads/${lead.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-3 py-2 hover:bg-amber-50/60 transition-colors border-b border-slate-50"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 flex items-center gap-2">
                              {lead.company_name}
                              <span className="text-[10px] text-slate-500">({lead.lead_code})</span>
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {lead.contact_person} • {lead.phone}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-semibold text-slate-700">
                            {lead.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchingProposals.length > 0 && (
                    <div>
                      <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50 border-y border-slate-100">
                        Proposals ({matchingProposals.length})
                      </div>
                      {matchingProposals.map((prop) => (
                        <Link
                          key={prop.id}
                          href="/pipeline/proposals"
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-3 py-2 hover:bg-amber-50/60 transition-colors border-b border-slate-50"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">
                              {prop.company_name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {prop.proposal_code} • ₹{prop.proposal_value.toLocaleString()}
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                            {prop.status}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  {matchingEmployees.length > 0 && (
                    <div>
                      <div className="px-3 py-1 font-bold text-slate-400 uppercase text-[10px] tracking-wider bg-slate-50 border-y border-slate-100">
                        Team Members ({matchingEmployees.length})
                      </div>
                      {matchingEmployees.map((emp) => (
                        <Link
                          key={emp.id}
                          href={`/team/${emp.id}`}
                          onClick={() => setIsSearchOpen(false)}
                          className="flex items-center justify-between px-3 py-2 hover:bg-amber-50/60 transition-colors"
                        >
                          <div>
                            <div className="font-semibold text-slate-900">{emp.full_name}</div>
                            <div className="text-[11px] text-slate-500">{emp.designation}</div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 font-medium">
                            {emp.team_name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Controls: Filters, Role Switcher, Quick Add & Notifications */}
      <div className="flex items-center gap-3">
        {/* Date Range Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
          <Calendar className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={dateFilter.label}
            onChange={(e) => setDateFilter({ label: e.target.value as any })}
            aria-label="Filter by Date Range"
            className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="Today">Today</option>
            <option value="This Week">This Week</option>
            <option value="This Month">This Month</option>
            <option value="Last Month">Last Month</option>
            <option value="Custom Range">Custom Range</option>
          </select>
        </div>

        {/* Employee Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
          <User className="w-3.5 h-3.5 text-slate-500" />
          <select
            value={selectedEmployeeFilter}
            onChange={(e) => setSelectedEmployeeFilter(e.target.value)}
            aria-label="Filter by Employee"
            className="bg-transparent text-slate-800 font-medium focus:outline-none cursor-pointer"
          >
            <option value="all">All Sales reps</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Role Switcher Toggle */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-900 text-white rounded-lg p-0.5 text-[11px] font-semibold">
          {(['Admin', 'Manager', 'Sales Executive'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setCurrentRole(r)}
              className={`px-2.5 py-1 rounded-md transition-all ${
                currentRole === r
                  ? 'bg-[#FFCC00] text-slate-950 shadow-xs font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Notifications Dropdown Bell */}
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                {unreadNotifCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 text-xs">
              <div className="p-3 border-b border-slate-100 font-bold text-slate-900 flex items-center justify-between">
                <span>In-App Notifications</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {unreadNotifCount} unread
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`p-3 cursor-pointer transition-colors ${
                      n.is_read ? 'bg-white opacity-70' : 'bg-amber-50/50 font-medium'
                    }`}
                  >
                    <div className="font-semibold text-slate-900 mb-0.5">{n.title}</div>
                    <div className="text-[11px] text-slate-600 mb-1">{n.message}</div>
                    <div className="text-[10px] text-slate-400">{n.timestamp}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Global "+ Add" Button & Quick Menu */}
        <div ref={addMenuRef} className="relative">
          <button
            onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFCC00] hover:bg-[#E5B800] text-slate-950 font-bold text-xs shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </button>

          {isAddMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 text-slate-200 border border-slate-800 rounded-xl shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 uppercase">
                Quick Actions
              </div>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  openQuickAdd('lead');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <Building2 className="w-3.5 h-3.5 text-[#FFCC00]" />
                <span>New Lead</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  openQuickAdd('followup');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Schedule Follow-up</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  openQuickAdd('call');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
                <span>Log Call Activity</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  openQuickAdd('meeting');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 text-purple-400" />
                <span>Schedule Meeting</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  openQuickAdd('fieldvisit');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Record Field Visit</span>
              </button>
              <button
                onClick={() => {
                  setIsAddMenuOpen(false);
                  openQuickAdd('proposal');
                }}
                className="w-full text-left px-3 py-2 hover:bg-slate-800 text-white flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span>Create Proposal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
