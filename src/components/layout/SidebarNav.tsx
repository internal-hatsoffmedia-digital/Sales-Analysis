'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Users, UserCheck, FileText, 
  CheckCircle2, Clock, Phone, Calendar, MapPin, History, 
  Megaphone, UserPlus, Target, BarChart3, Settings, 
  ChevronDown, ChevronRight, Layers, PhoneCall, Sparkles, Building2, Workflow
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: number | string;
  children?: { title: string; href: string; badge?: number | string }[];
}

export function SidebarNav() {
  const pathname = usePathname();
  const { currentRole, followUps } = useApp();

  const overdueCount = followUps.filter(f => f.status === 'Overdue').length;

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    Leads: true,
    Pipeline: true,
    Activities: true,
    Campaigns: false,
    Team: false,
    Reports: false,
    Settings: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const navGroups: { groupLabel?: string; items: NavItem[] }[] = [
    {
      items: [
        {
          title: 'Dashboard',
          href: '/',
          icon: <LayoutDashboard className="w-4 h-4" />,
        },
      ],
    },
    {
      groupLabel: 'LEADS',
      items: [
        {
          title: 'Leads',
          icon: <Users className="w-4 h-4" />,
          children: [
            { title: 'Lead Master', href: '/leads' },
            { title: 'Add Lead', href: '/leads/new' },
            { title: 'My Leads', href: '/leads/my-leads' },
            { title: 'Assigned Leads', href: '/leads/assigned' },
          ],
        },
      ],
    },
    {
      groupLabel: 'SALES PIPELINE',
      items: [
        {
          title: 'Pipeline',
          icon: <Workflow className="w-4 h-4" />,
          children: [
            { title: 'Prospects', href: '/pipeline/prospects', badge: '142' },
            { title: 'Proposals', href: '/pipeline/proposals', badge: '51' },
            { title: 'Conversions', href: '/pipeline/conversions', badge: '17' },
          ],
        },
      ],
    },
    {
      groupLabel: 'ACTIVITIES & FIELD',
      items: [
        {
          title: 'Activities',
          icon: <Clock className="w-4 h-4" />,
          children: [
            { title: 'Follow-up Center', href: '/activities/follow-ups', badge: overdueCount > 0 ? `${overdueCount} Overdue` : undefined },
            { title: 'Calls Log', href: '/activities/calls' },
            { title: 'Meetings', href: '/activities/meetings' },
            { title: 'Field Visits', href: '/activities/field-visits' },
            { title: 'Activity History', href: '/activities/history' },
          ],
        },
        {
          title: 'Outbound Sales',
          href: '/outbound',
          icon: <PhoneCall className="w-4 h-4" />,
        },
      ],
    },
    {
      groupLabel: 'CAMPAIGNS',
      items: [
        {
          title: 'Campaigns',
          icon: <Megaphone className="w-4 h-4" />,
          children: [
            { title: 'Campaign List', href: '/campaigns' },
            { title: 'Campaign Leads', href: '/campaigns/leads' },
            { title: 'Campaign Analytics', href: '/campaigns/performance' },
          ],
        },
      ],
    },
    {
      groupLabel: 'ORGANIZATION & TARGETS',
      items: [
        {
          title: 'Team',
          icon: <UserCheck className="w-4 h-4" />,
          children: [
            { title: 'Sales Team', href: '/team/members' },
            { title: 'Team Performance', href: '/team/performance' },
            { title: 'Targets', href: '/team/targets' },
          ],
        },
        {
          title: 'Reports & Analytics',
          href: '/reports',
          icon: <BarChart3 className="w-4 h-4" />,
        },
      ],
    },
    ...(currentRole === 'Admin' ? [
      {
        groupLabel: 'ADMINISTRATION',
        items: [
          {
            title: 'Settings',
            icon: <Settings className="w-4 h-4" />,
            children: [
              { title: 'Users & Roles', href: '/settings/users' },
              { title: 'Lead Sources', href: '/settings/lead-sources' },
              { title: 'Lead Statuses', href: '/settings/lead-statuses' },
              { title: 'Services Catalog', href: '/settings/services' },
              { title: 'System Settings', href: '/settings/system' },
            ],
          },
        ],
      },
    ] : []),
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col h-screen fixed left-0 top-0 z-30 border-r border-slate-800 shadow-xl">
      {/* Brand Header */}
      <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-[#FFCC00] flex items-center justify-center text-slate-950 font-black text-xl shadow-md">
          H
        </div>
        <div>
          <div className="font-bold text-white text-sm tracking-wide uppercase flex items-center gap-1.5">
            Hatsoff Media
          </div>
          <div className="text-[11px] text-[#FFCC00] font-medium tracking-wider uppercase">
            Control Center v2.0
          </div>
        </div>
      </div>

      {/* Role Badge Indicator */}
      <div className="px-4 py-2 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-400">Role Mode:</span>
        <span className="px-2 py-0.5 rounded font-semibold bg-[#FFCC00]/20 text-[#FFCC00] border border-[#FFCC00]/30">
          {currentRole}
        </span>
      </div>

      {/* Navigation Links Scrollable Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {group.groupLabel && (
              <div className="px-3 text-[10px] font-bold text-slate-500 tracking-wider uppercase mb-1">
                {group.groupLabel}
              </div>
            )}
            {group.items.map((item, iIdx) => {
              if (item.href) {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-[#FFCC00] text-slate-950 font-semibold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 text-[10px] rounded bg-rose-500 text-white font-bold">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              }

              const isOpen = openSections[item.title] ?? false;
              const hasActiveChild = item.children?.some(c => pathname === c.href);

              return (
                <div key={iIdx} className="space-y-1">
                  <button
                    onClick={() => toggleSection(item.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs font-medium transition-all ${
                      hasActiveChild
                        ? 'text-[#FFCC00] bg-slate-800/80 font-semibold'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    {isOpen ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>

                  {isOpen && item.children && (
                    <div className="pl-7 pr-1 space-y-0.5 border-l border-slate-800 ml-4 py-1">
                      {item.children.map((child, cIdx) => {
                        const isChildActive = pathname === child.href;
                        return (
                          <Link
                            key={cIdx}
                            href={child.href}
                            className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs transition-colors ${
                              isChildActive
                                ? 'bg-[#FFCC00]/15 text-[#FFCC00] font-semibold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                            }`}
                          >
                            <span>{child.title}</span>
                            {child.badge && (
                              <span className={`px-1.5 py-0.2 text-[10px] rounded font-semibold ${
                                child.badge.toString().includes('Overdue')
                                  ? 'bg-rose-500 text-white animate-pulse'
                                  : 'bg-slate-800 text-slate-300'
                              }`}>
                                {child.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
        <div>
          <div className="text-slate-200 font-medium">Hatsoff Media Pvt Ltd</div>
          <div className="text-slate-500 text-[10px]">Sales & Marketing CRM</div>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" title="Supabase Connected" />
      </div>
    </aside>
  );
}
