export type UserRole = 'Admin' | 'Manager' | 'Sales Executive';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface Employee {
  id: string;
  profile_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  phone: string;
  designation: string;
  team_name: string;
  leads_assigned: number;
  new_leads_created: number;
  calls_count: number;
  activities_count: number;
  followups_completed: number;
  overdue_followups: number;
  prospects_count: number;
  proposals_count: number;
  won_count: number;
  lost_count: number;
  conversion_rate: number; // percentage
  revenue: number; // in INR ₹
  target: number; // in INR ₹
  achievement_pct: number;
  status: 'Active' | 'Inactive';
}

export type LeadSource = 
  | 'Cold Call'
  | 'Cold DM'
  | 'Field Visit'
  | 'Website'
  | 'Digital Marketing'
  | 'Referral'
  | 'Social Media'
  | 'WhatsApp'
  | 'Email'
  | 'Other';

export type LeadStatus =
  | 'New'
  | 'Contacted'
  | 'No Response'
  | 'Follow-up'
  | 'Interested'
  | 'Prospect'
  | 'Proposal Requested'
  | 'Proposal Sent'
  | 'Negotiation'
  | 'Won'
  | 'Lost'
  | 'Not Interested'
  | 'Invalid Lead';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Lead {
  id: string;
  lead_code: string;
  created_at: string;
  company_name: string;
  contact_person: string;
  phone: string;
  whatsapp?: string;
  email: string;
  website?: string;
  location: string;
  source: LeadSource;
  campaign_id?: string;
  campaign_name?: string;
  service: string;
  estimated_budget: number;
  assigned_employee_id: string;
  assigned_employee_name: string;
  status: LeadStatus;
  priority: Priority;
  next_followup_date: string;
  next_followup_time: string;
  last_contacted_at?: string;
  notes?: string;
  created_by: string;
}

export type FollowUpType = 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Field Visit' | 'Other';
export type FollowUpStatus = 'Upcoming' | 'Today' | 'Overdue' | 'Completed' | 'Cancelled' | 'Rescheduled';

export interface FollowUp {
  id: string;
  lead_id: string;
  company_name: string;
  contact_person: string;
  phone: string;
  assigned_employee_id: string;
  assigned_employee_name: string;
  type: FollowUpType;
  followup_date: string;
  followup_time: string;
  priority: Priority;
  purpose: string;
  notes?: string;
  outcome?: string;
  status: FollowUpStatus;
  last_activity?: string;
  completed_at?: string;
}

export interface Prospect {
  id: string;
  lead_id: string;
  company_name: string;
  decision_maker: string;
  interested_service: string;
  requirement_details: string;
  expected_budget: number;
  expected_closing_date: string;
  probability_pct: number;
  sales_owner_id: string;
  sales_owner_name: string;
  stage: 'Qualified' | 'Requirement Discussion' | 'Proposal Required' | 'Proposal Sent' | 'Negotiation' | 'Decision Pending' | 'Won' | 'Lost';
  notes?: string;
  created_at: string;
}

export type ProposalStatus = 'Draft' | 'Sent' | 'Viewed' | 'Follow-up Required' | 'Negotiation' | 'Accepted' | 'Rejected' | 'Expired';

export interface Proposal {
  id: string;
  proposal_code: string;
  lead_id: string;
  prospect_id?: string;
  company_name: string;
  contact_person: string;
  proposal_date: string;
  proposal_value: number;
  service: string;
  status: ProposalStatus;
  sent_by_id: string;
  sent_by_name: string;
  expected_decision_date: string;
  attachment_url?: string;
  notes?: string;
}

export interface Conversion {
  id: string;
  conversion_code: string;
  lead_id: string;
  company_name: string;
  sales_executive_id: string;
  sales_executive_name: string;
  service: string;
  original_lead_source: LeadSource;
  campaign_name?: string;
  proposal_value: number;
  final_deal_value: number;
  converted_date: string;
  payment_status: 'Pending' | 'Partially Paid' | 'Paid Full';
  notes?: string;
}

export interface LostLead {
  id: string;
  lead_id: string;
  company_name: string;
  lost_reason: 'High Price' | 'Competitor' | 'No Response' | 'Requirement Dropped' | 'Budget Issue' | 'Not Interested' | 'Delayed Decision' | 'Internal Decision' | 'Other';
  competitor_name?: string;
  notes?: string;
  marked_by_name: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'Outbound Calling' | 'Cold DM' | 'Field Campaign' | 'Digital Marketing' | 'Social Media' | 'Email' | 'Website' | 'Other';
  start_date: string;
  end_date: string;
  owner_name: string;
  budget: number;
  target_leads: number;
  actual_leads: number;
  prospects_count: number;
  conversions_count: number;
  revenue_generated: number;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
}

export interface FieldVisit {
  id: string;
  employee_id: string;
  employee_name: string;
  date: string;
  company_name: string;
  contact_person: string;
  location: string;
  visit_purpose: string;
  meeting_status: 'Scheduled' | 'Completed' | 'Postponed' | 'Cancelled';
  discussion: string;
  requirement?: string;
  outcome?: string;
  next_followup_date?: string;
  potential_value?: number;
  notes?: string;
}

export interface SalesTarget {
  id: string;
  period_month: string; // e.g. "September 2026"
  target_revenue: number;
  target_leads: number;
  target_prospects: number;
  target_conversions: number;
  achieved_revenue: number;
  achieved_leads: number;
  achieved_prospects: number;
  achieved_conversions: number;
  achievement_pct?: number;
}

export interface LeadActivityLog {
  id: string;
  lead_id: string;
  company_name: string;
  author_name: string;
  timestamp: string;
  type: 'Call' | 'WhatsApp' | 'Email' | 'Meeting' | 'Status Change' | 'Assignment' | 'Follow-up' | 'Proposal' | 'Conversion' | 'Note';
  description: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'followup_due' | 'followup_overdue' | 'lead_assigned' | 'proposal_due' | 'target_milestone' | 'general';
  is_read: boolean;
  link?: string;
}

export interface DateFilterRange {
  label: 'Today' | 'This Week' | 'This Month' | 'Last Month' | 'Custom Range';
  startDate?: string;
  endDate?: string;
}
