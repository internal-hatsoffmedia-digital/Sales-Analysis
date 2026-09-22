'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Lead, FollowUp, Prospect, Proposal, Conversion, LostLead, Campaign, 
  FieldVisit, SalesTarget, Employee, NotificationItem, LeadActivityLog, 
  UserRole, DateFilterRange, LeadStatus, LeadSource, Priority 
} from '@/types';
import { supabase } from '@/lib/supabaseClient';

const DEFAULT_TARGET: SalesTarget = {
  id: 'st-01',
  period_month: 'September 2026',
  target_revenue: 1000000,
  target_leads: 100,
  target_prospects: 20,
  target_conversions: 10,
  achieved_revenue: 0,
  achieved_leads: 0,
  achieved_prospects: 0,
  achieved_conversions: 0,
  achievement_pct: 0,
};

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
  isLoading: boolean;

  // Quick Add Drawer State
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  quickAddType: 'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal';
  openQuickAdd: (type?: 'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal') => void;

  // Actions
  addLead: (lead: Omit<Lead, 'id' | 'lead_code' | 'created_at'>) => Promise<void>;
  updateLeadStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  addFollowUp: (followUp: Omit<FollowUp, 'id'>) => Promise<void>;
  completeFollowUp: (id: string, outcome: string, scheduleNext?: { date: string; time: string; type: any; purpose: string }) => Promise<void>;
  createProposal: (proposal: Omit<Proposal, 'id' | 'proposal_code'>) => Promise<void>;
  recordConversion: (conversion: Omit<Conversion, 'id' | 'conversion_code'>) => Promise<void>;
  markLeadLost: (leadId: string, lostReason: LostLead['lost_reason'], competitorName?: string, notes?: string) => Promise<void>;
  addFieldVisit: (visit: Omit<FieldVisit, 'id'>) => Promise<void>;
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

  const [leads, setLeads] = useState<Lead[]>([]);
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [lostLeads, setLostLeads] = useState<LostLead[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [fieldVisits, setFieldVisits] = useState<FieldVisit[]>([]);
  const [salesTarget, setSalesTarget] = useState<SalesTarget>(DEFAULT_TARGET);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [activities, setActivities] = useState<LeadActivityLog[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState<'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal'>('lead');

  // Fetch initial data from Supabase DB tables
  useEffect(() => {
    async function fetchSupabaseData() {
      setIsLoading(true);
      try {
        const { data: dbLeads } = await supabase.from('leads').select('*').order('created_at', { ascending: false });
        if (dbLeads) setLeads(dbLeads as Lead[]);

        const { data: dbFollowups } = await supabase.from('follow_ups').select('*').order('created_at', { ascending: false });
        if (dbFollowups) setFollowUps(dbFollowups as FollowUp[]);

        const { data: dbProposals } = await supabase.from('proposals').select('*').order('created_at', { ascending: false });
        if (dbProposals) setProposals(dbProposals as Proposal[]);

        const { data: dbConversions } = await supabase.from('conversions').select('*').order('created_at', { ascending: false });
        if (dbConversions) setConversions(dbConversions as Conversion[]);

        const { data: dbFieldVisits } = await supabase.from('field_visits').select('*').order('created_at', { ascending: false });
        if (dbFieldVisits) setFieldVisits(dbFieldVisits as FieldVisit[]);

        const { data: dbEmployees } = await supabase.from('employees').select('*');
        if (dbEmployees && dbEmployees.length > 0) setEmployees(dbEmployees as Employee[]);

        const { data: dbTargets } = await supabase.from('sales_targets').select('*').limit(1);
        if (dbTargets && dbTargets.length > 0) {
          setSalesTarget(dbTargets[0] as SalesTarget);
        }
      } catch (err) {
        console.warn('Supabase fetch notice:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSupabaseData();

    // Live Realtime Subscriptions
    const channel = supabase
      .channel('hatsoff-realtime-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setLeads((prev) => [payload.new as Lead, ...prev.filter(l => l.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setLeads((prev) => prev.map((l) => (l.id === payload.new.id ? { ...l, ...(payload.new as Lead) } : l)));
        } else if (payload.eventType === 'DELETE') {
          setLeads((prev) => prev.filter((l) => l.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'follow_ups' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setFollowUps((prev) => [payload.new as FollowUp, ...prev.filter(f => f.id !== payload.new.id)]);
        } else if (payload.eventType === 'UPDATE') {
          setFollowUps((prev) => prev.map((f) => (f.id === payload.new.id ? { ...f, ...(payload.new as FollowUp) } : f)));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'proposals' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setProposals((prev) => [payload.new as Proposal, ...prev.filter(p => p.id !== payload.new.id)]);
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conversions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setConversions((prev) => [payload.new as Conversion, ...prev.filter(c => c.id !== payload.new.id)]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const openQuickAdd = (type: 'lead' | 'followup' | 'call' | 'meeting' | 'fieldvisit' | 'proposal' = 'lead') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  const addLead = async (leadData: Omit<Lead, 'id' | 'lead_code' | 'created_at'>) => {
    const newCode = `LEAD-${leads.length + 101}`;
    const nowIso = new Date().toISOString();
    
    const newLead: Lead = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lead-${Date.now()}`,
      lead_code: newCode,
      created_at: nowIso,
      ...leadData,
    };

    setLeads((prev) => [newLead, ...prev]);

    // Persist to Supabase Database
    try {
      await supabase.from('leads').insert([newLead]);
    } catch (e) {
      console.error('Supabase lead insert error:', e);
    }

    // Next follow-up insert if present
    if (leadData.next_followup_date) {
      const newFU: FollowUp = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `fu-${Date.now()}`,
        lead_id: newLead.id,
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
      setFollowUps((prev) => [newFU, ...prev]);
      try {
        await supabase.from('follow_ups').insert([newFU]);
      } catch (e) {
        console.error('Supabase follow_up insert error:', e);
      }
    }
  };

  const updateLeadStatus = async (leadId: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
    try {
      await supabase.from('leads').update({ status }).eq('id', leadId);
    } catch (e) {
      console.error('Supabase lead update error:', e);
    }
  };

  const addFollowUp = async (fuData: Omit<FollowUp, 'id'>) => {
    const newFU: FollowUp = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `fu-${Date.now()}`,
      ...fuData,
    };
    setFollowUps((prev) => [newFU, ...prev]);
    try {
      await supabase.from('follow_ups').insert([newFU]);
    } catch (e) {
      console.error('Supabase follow-up insert error:', e);
    }
  };

  const completeFollowUp = async (id: string, outcome: string, scheduleNext?: { date: string; time: string; type: any; purpose: string }) => {
    const target = followUps.find((f) => f.id === id);
    if (!target) return;

    const completedAt = new Date().toISOString();
    setFollowUps((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: 'Completed', outcome, completed_at: completedAt } : f))
    );

    try {
      await supabase.from('follow_ups').update({ status: 'Completed', outcome, completed_at: completedAt }).eq('id', id);
    } catch (e) {
      console.error('Supabase follow-up update error:', e);
    }

    if (scheduleNext) {
      const nextFU: FollowUp = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `fu-${Date.now() + 1}`,
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
      setFollowUps((prev) => [nextFU, ...prev]);
      try {
        await supabase.from('follow_ups').insert([nextFU]);
      } catch (e) {
        console.error('Supabase follow-up insert error:', e);
      }
    }
  };

  const createProposal = async (proposalData: Omit<Proposal, 'id' | 'proposal_code'>) => {
    const newProp: Proposal = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `prop-${Date.now()}`,
      proposal_code: `PROP-2026-0${proposals.length + 101}`,
      ...proposalData,
    };
    setProposals((prev) => [newProp, ...prev]);
    await updateLeadStatus(proposalData.lead_id, 'Proposal Sent');

    try {
      await supabase.from('proposals').insert([newProp]);
    } catch (e) {
      console.error('Supabase proposal insert error:', e);
    }
  };

  const recordConversion = async (convData: Omit<Conversion, 'id' | 'conversion_code'>) => {
    const newConv: Conversion = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `conv-${Date.now()}`,
      conversion_code: `WON-2026-0${conversions.length + 101}`,
      ...convData,
    };
    setConversions((prev) => [newConv, ...prev]);
    await updateLeadStatus(convData.lead_id, 'Won');

    try {
      await supabase.from('conversions').insert([newConv]);
    } catch (e) {
      console.error('Supabase conversion insert error:', e);
    }
  };

  const markLeadLost = async (leadId: string, lostReason: LostLead['lost_reason'], competitorName?: string, notes?: string) => {
    const target = leads.find((l) => l.id === leadId);
    if (!target) return;

    const lostRecord: LostLead = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `lost-${Date.now()}`,
      lead_id: leadId,
      company_name: target.company_name,
      lost_reason: lostReason,
      competitor_name: competitorName,
      notes,
      marked_by_name: 'Current User',
      created_at: new Date().toISOString(),
    };

    setLostLeads((prev) => [lostRecord, ...prev]);
    await updateLeadStatus(leadId, 'Lost');
  };

  const addFieldVisit = async (visitData: Omit<FieldVisit, 'id'>) => {
    const newVisit: FieldVisit = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `fv-${Date.now()}`,
      ...visitData,
    };
    setFieldVisits((prev) => [newVisit, ...prev]);

    try {
      await supabase.from('field_visits').insert([newVisit]);
    } catch (e) {
      console.error('Supabase field visit insert error:', e);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)));
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
        isLoading,
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
