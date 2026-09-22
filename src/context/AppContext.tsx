'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Lead, FollowUp, Prospect, Proposal, Conversion, LostLead, Campaign, 
  FieldVisit, SalesTarget, Employee, NotificationItem, LeadActivityLog, 
  UserRole, DateFilterRange, LeadStatus, LeadSource, Priority 
} from '@/types';
import { 
  INITIAL_LEADS, INITIAL_FOLLOWUPS, INITIAL_PROPOSALS, INITIAL_CONVERSIONS, 
  INITIAL_CAMPAIGNS, INITIAL_FIELD_VISITS, INITIAL_SALES_TARGET, INITIAL_EMPLOYEES, 
  INITIAL_ACTIVITIES, INITIAL_NOTIFICATIONS 
} from '@/lib/mockData';
import { supabase } from '@/lib/supabaseClient';

interface AppContextType {
  // User & Filter state
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  activeEmployeeId: string;
  setActiveEmployeeId: (id: string) => void;
  dateFilter: DateFilterRange;
  setDateFilter: (filter: DateFilterRange) => void;
  selectedEmployeeFilter: string;
  setSelectedEmployeeFilter: (id: string) => void;
  selectedSourceFilter: string;
  setSelectedSourceFilter: (source: string) => void;
  selectedCampaignFilter: string;
  setSelectedCampaignFilter: (campaign: string) => void;

  // Data Collections
  leads: Lead[];
  followUps: FollowUp[];
  proposals: Proposal[];
  conversions: Conversion[];
  lostLeads: LostLead[];
  campaigns: Campaign[];
  fieldVisits: FieldVisit[];
  salesTarget: SalesTarget;
  employees: Employee[];
  activities: LeadActivityLog[];
  notifications: NotificationItem[];

  // Quick Add Drawer State
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddType: 'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal';
  openQuickAdd: (type?: 'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal') => void;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'lead_code' | 'created_at'>) => void;
  updateLeadStatus: (leadId: string, status: LeadStatus) => void;
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => void;
  completeFollowUp: (id: string, outcome: string, scheduleNext?: { date: string; time: string; type: any; purpose: string }) => void;
  createProposal: (proposal: Omit<Proposal, 'id' | 'proposal_code'>) => void;
  recordConversion: (conversion: Omit<Conversion, 'id' | 'conversion_code'>) => void;
  markLeadLost: (leadId: string, lostReason: LostLead['lost_reason'], competitorName?: string, notes?: string) => void;
  addFieldVisit: (visit: Omit<FieldVisit, 'id'>) => void;
  markNotificationRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('Admin');
  const [activeEmployeeId, setActiveEmployeeId] = useState<string>('emp-01');
  const [dateFilter, setDateFilter] = useState<DateFilterRange>({ label: 'This Month' });
  const [selectedEmployeeFilter, setSelectedEmployeeFilter] = useState<string>('all');
  const [selectedSourceFilter, setSelectedSourceFilter] = useState<string>('all');
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState<string>('all');

  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS);
  const [followUps, setFollowUps] = useState<FollowUp[]>(INITIAL_FOLLOWUPS);
  const [proposals, setProposals] = useState<Proposal[]>(INITIAL_PROPOSALS);
  const [conversions, setConversions] = useState<Conversion[]>(INITIAL_CONVERSIONS);
  const [lostLeads, setLostLeads] = useState<LostLead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>(INITIAL_CAMPAIGNS);
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>(INITIAL_FIELD_VISITS);
  const [salesTarget, setSalesTarget] = useState<SalesTarget>(INITIAL_SALES_TARGET);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [activities, setActivities] = useState<LeadActivityLog[]>(INITIAL_ACTIVITIES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal'>('lead');

  // Supabase Realtime Setup
  useEffect(() => {
    const channel = supabase
      .channel('hatsoff-control-center-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leads' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setLeads((prev) => [payload.new as Lead, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setLeads((prev) =>
              prev.map((l) => (l.id === payload.new.id ? { ...l, ...(payload.new as Lead) } : l))
            );
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'follow_ups' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setFollowUps((prev) => [payload.new as FollowUp, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setFollowUps((prev) =>
              prev.map((f) => (f.id === payload.new.id ? { ...f, ...(payload.new as FollowUp) } : f))
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openQuickAdd = (type: 'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal' = 'lead') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'lead_code' | 'created_at'>) => {
    const newId = `lead-${Date.now()}`;
    const newCode = `LEAD-${leads.length + 866}`;
    const nowIso = new Date().toISOString();
    
    const newLead: Lead = {
      ...leadData,
      id: newId,
      lead_code: newCode,
      created_at: nowIso,
    };

    setLeads(prev => [newLead, ...prev]);

    // Update target metrics & employee stats
    setSalesTarget(prev => ({
      ...prev,
      achieved_leads: prev.achieved_leads + 1,
    }));

    setEmployees(prev => prev.map(emp => {
      if (emp.id === leadData.assigned_employee_id) {
        return {
          ...emp,
          leads_assigned: emp.leads_assigned + 1,
          new_leads_created: emp.new_leads_created + 1,
        };
      }
      return emp;
    }));

    // Add activity log
    const newActivity: LeadActivityLog = {
      id: `act-${Date.now()}`,
      lead_id: newId,
      company_name: leadData.company_name,
      author_name: leadData.created_by || 'User',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Status Change',
      description: `Lead created with status: ${leadData.status}`,
    };
    setActivities(prev => [newActivity, ...prev]);

    // If next follow up is scheduled, add to follow-ups list
    if (leadData.next_followup_date) {
      const newFU: FollowUp = {
        id: `fu-${Date.now()}`,
        lead_id: newId,
        company_name: leadData.company_name,
        contact_person: leadData.contact_person,
        phone: leadData.phone,
        assigned_employee_id: leadData.assigned_employee_id,
        assigned_employee_name: leadData.assigned_employee_name,
        type: 'Call',
        followup_date: leadData.next_followup_date,
        followup_time: leadData.next_followup_time || '11:00',
        priority: leadData.priority,
        purpose: 'Initial Follow-up after creation',
        status: 'Upcoming',
      };
      setFollowUps(prev => [newFU, ...prev]);
    }
  };

  const updateLeadStatus = (leadId: string, status: LeadStatus) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status } : l));

    const targetLead = leads.find(l => l.id === leadId);
    if (targetLead) {
      const newActivity: LeadActivityLog = {
        id: `act-${Date.now()}`,
        lead_id: leadId,
        company_name: targetLead.company_name,
        author_name: 'Current User',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Status Change',
        description: `Lead status updated to: ${status}`,
      };
      setActivities(prev => [newActivity, ...prev]);
    }
  };

  const addFollowUp = (fuData: Omit<FollowUp, 'id'>) => {
    const newFU: FollowUp = {
      ...fuData,
      id: `fu-${Date.now()}`,
    };
    setFollowUps(prev => [newFU, ...prev]);
  };

  const completeFollowUp = (id: string, outcome: string, scheduleNext?: { date: string; time: string; type: any; purpose: string }) => {
    const target = followUps.find(f => f.id === id);
    if (!target) return;

    setFollowUps(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          status: 'Completed',
          outcome,
          completed_at: new Date().toISOString(),
        };
      }
      return f;
    }));

    // Update employee metrics
    setEmployees(prev => prev.map(emp => {
      if (emp.id === target.assigned_employee_id) {
        return {
          ...emp,
          followups_completed: emp.followups_completed + 1,
        };
      }
      return emp;
    }));

    // Add activity log
    const newActivity: LeadActivityLog = {
      id: `act-${Date.now()}`,
      lead_id: target.lead_id,
      company_name: target.company_name,
      author_name: target.assigned_employee_name,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Follow-up',
      description: `Follow-up completed (${target.type}). Outcome: ${outcome}`,
    };
    setActivities(prev => [newActivity, ...prev]);

    // Schedule next follow up if requested
    if (scheduleNext) {
      const nextFU: FollowUp = {
        id: `fu-${Date.now() + 1}`,
        lead_id: target.lead_id,
        company_name: target.company_name,
        contact_person: target.contact_person,
        phone: target.phone,
        assigned_employee_id: target.assigned_employee_id,
        assigned_employee_name: target.assigned_employee_name,
        type: scheduleNext.type,
        followup_date: scheduleNext.date,
        followup_time: scheduleNext.time,
        priority: target.priority,
        purpose: scheduleNext.purpose,
        status: 'Upcoming',
      };
      setFollowUps(prev => [nextFU, ...prev]);
    }
  };

  const createProposal = (proposalData: Omit<Proposal, 'id' | 'proposal_code'>) => {
    const newProp: Proposal = {
      ...proposalData,
      id: `prop-${Date.now()}`,
      proposal_code: `PROP-2026-0${proposals.length + 52}`,
    };
    setProposals(prev => [newProp, ...prev]);
    updateLeadStatus(proposalData.lead_id, 'Proposal Sent');

    setSalesTarget(prev => ({
      ...prev,
      achieved_prospects: prev.achieved_prospects + 1,
    }));
  };

  const recordConversion = (convData: Omit<Conversion, 'id' | 'conversion_code'>) => {
    const newConv: Conversion = {
      ...convData,
      id: `conv-${Date.now()}`,
      conversion_code: `WON-2026-0${conversions.length + 18}`,
    };
    setConversions(prev => [newConv, ...prev]);

    // Mark lead status as Won
    updateLeadStatus(convData.lead_id, 'Won');

    // Update Sales Target & Employee Revenue
    setSalesTarget(prev => ({
      ...prev,
      achieved_conversions: prev.achieved_conversions + 1,
      achieved_revenue: prev.achieved_revenue + convData.final_deal_value,
    }));

    setEmployees(prev => prev.map(emp => {
      if (emp.id === convData.sales_executive_id) {
        const newWon = emp.won_count + 1;
        const newRev = emp.revenue + convData.final_deal_value;
        const newRate = Number(((newWon / emp.leads_assigned) * 100).toFixed(2));
        const newAch = Number(((newRev / emp.target) * 100).toFixed(1));
        return {
          ...emp,
          won_count: newWon,
          revenue: newRev,
          conversion_rate: newRate,
          achievement_pct: newAch,
        };
      }
      return emp;
    }));
  };

  const markLeadLost = (leadId: string, lostReason: LostLead['lost_reason'], competitorName?: string, notes?: string) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;

    const lostRecord: LostLead = {
      id: `lost-${Date.now()}`,
      lead_id: leadId,
      company_name: target.company_name,
      lost_reason: lostReason,
      competitor_name: competitorName,
      notes,
      marked_by_name: 'Current User',
      created_at: new Date().toISOString(),
    };

    setLostLeads(prev => [lostRecord, ...prev]);
    updateLeadStatus(leadId, 'Lost');
  };

  const addFieldVisit = (visitData: Omit<FieldVisit, 'id'>) => {
    const newVisit: FieldVisit = {
      ...visitData,
      id: `fv-${Date.now()}`,
    };
    setFieldVisits(prev => [newVisit, ...prev]);

    // Update employee field visit / activity counter
    setEmployees(prev => prev.map(emp => {
      if (emp.id === visitData.employee_id) {
        return {
          ...emp,
          activities_count: emp.activities_count + 1,
        };
      }
      return emp;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        activeEmployeeId,
        setActiveEmployeeId,
        dateFilter,
        setDateFilter,
        selectedEmployeeFilter,
        setSelectedEmployeeFilter,
        selectedSourceFilter,
        setSelectedSourceFilter,
        selectedCampaignFilter,
        setSelectedCampaignFilter,
        leads,
        followUps,
        proposals,
        conversions,
        lostLeads,
        campaigns,
        fieldVisits,
        salesTarget,
        employees,
        activities,
        notifications,
        isQuickAddOpen,
        setIsQuickAddOpen,
        quickAddType,
        openQuickAdd,
        addLead,
        updateLeadStatus,
        addFollowUp,
        completeFollowUp,
        createProposal,
        recordConversion,
        markLeadLost,
        addFieldVisit,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
