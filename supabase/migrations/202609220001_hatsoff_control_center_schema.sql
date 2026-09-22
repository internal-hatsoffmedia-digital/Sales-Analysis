-- ====================================================================
-- HATSOFF SALES & MARKETING CONTROL CENTER DATABASE SCHEMA
-- Company: Hatsoff Media Pvt Ltd
-- Database Engine: PostgreSQL / Supabase
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------------------
-- 1. PROFILES & EMPLOYEES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Sales Executive' CHECK (role IN ('Admin', 'Manager', 'Sales Executive')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    employee_code TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    designation TEXT NOT NULL,
    team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
    team_name TEXT DEFAULT 'Outbound & Corporate',
    leads_assigned INT DEFAULT 0,
    new_leads_created INT DEFAULT 0,
    calls_count INT DEFAULT 0,
    activities_count INT DEFAULT 0,
    followups_completed INT DEFAULT 0,
    overdue_followups INT DEFAULT 0,
    prospects_count INT DEFAULT 0,
    proposals_count INT DEFAULT 0,
    won_count INT DEFAULT 0,
    lost_count INT DEFAULT 0,
    conversion_rate NUMERIC(5,2) DEFAULT 0.00,
    revenue NUMERIC(12,2) DEFAULT 0.00,
    target NUMERIC(12,2) DEFAULT 0.00,
    achievement_pct NUMERIC(5,2) DEFAULT 0.00,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. LOOKUPS: LEAD SOURCES, STATUSES, SERVICES
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lead_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS public.lead_statuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    stage_order INT NOT NULL,
    is_won BOOLEAN DEFAULT FALSE,
    is_lost BOOLEAN DEFAULT FALSE
);

-- --------------------------------------------------------------------
-- 3. CAMPAIGNS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    owner_name TEXT NOT NULL,
    budget NUMERIC(12,2) DEFAULT 0.00,
    target_leads INT DEFAULT 0,
    actual_leads INT DEFAULT 0,
    prospects_count INT DEFAULT 0,
    conversions_count INT DEFAULT 0,
    revenue_generated NUMERIC(12,2) DEFAULT 0.00,
    status TEXT DEFAULT 'Active' CHECK (status IN ('Draft', 'Active', 'Paused', 'Completed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. LEAD MASTER
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_code TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    location TEXT DEFAULT 'Mumbai',
    source TEXT NOT NULL,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    campaign_name TEXT,
    service TEXT NOT NULL,
    estimated_budget NUMERIC(12,2) DEFAULT 0.00,
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    assigned_employee_name TEXT,
    status TEXT NOT NULL DEFAULT 'New',
    priority TEXT DEFAULT 'High' CHECK (priority IN ('High', 'Medium', 'Low')),
    next_followup_date DATE,
    next_followup_time TIME,
    last_contacted_at TIMESTAMPTZ,
    notes TEXT,
    created_by TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. FOLLOW-UPS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follow_ups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    phone TEXT NOT NULL,
    assigned_employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    assigned_employee_name TEXT,
    type TEXT NOT NULL CHECK (type IN ('Call', 'WhatsApp', 'Email', 'Meeting', 'Field Visit', 'Other')),
    followup_date DATE NOT NULL,
    followup_time TIME DEFAULT '11:00',
    priority TEXT DEFAULT 'High',
    purpose TEXT NOT NULL,
    notes TEXT,
    outcome TEXT,
    status TEXT DEFAULT 'Upcoming' CHECK (status IN ('Upcoming', 'Today', 'Overdue', 'Completed', 'Cancelled', 'Rescheduled')),
    last_activity TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. PROSPECTS & PROPOSALS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.prospects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    decision_maker TEXT NOT NULL,
    interested_service TEXT NOT NULL,
    requirement_details TEXT,
    expected_budget NUMERIC(12,2) DEFAULT 0.00,
    expected_closing_date DATE,
    probability_pct INT DEFAULT 50,
    sales_owner_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    sales_owner_name TEXT,
    stage TEXT DEFAULT 'Qualified',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    proposal_code TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    prospect_id UUID REFERENCES public.prospects(id) ON DELETE SET NULL,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    proposal_date DATE NOT NULL DEFAULT CURRENT_DATE,
    proposal_value NUMERIC(12,2) NOT NULL,
    service TEXT NOT NULL,
    status TEXT DEFAULT 'Sent' CHECK (status IN ('Draft', 'Sent', 'Viewed', 'Follow-up Required', 'Negotiation', 'Accepted', 'Rejected', 'Expired')),
    sent_by_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    sent_by_name TEXT NOT NULL,
    expected_decision_date DATE,
    attachment_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. CONVERSIONS & LOST LEADS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversion_code TEXT UNIQUE NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    sales_executive_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    sales_executive_name TEXT NOT NULL,
    service TEXT NOT NULL,
    original_lead_source TEXT NOT NULL,
    campaign_name TEXT,
    proposal_value NUMERIC(12,2) DEFAULT 0.00,
    final_deal_value NUMERIC(12,2) NOT NULL,
    converted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_status TEXT DEFAULT 'Paid Full' CHECK (payment_status IN ('Pending', 'Partially Paid', 'Paid Full')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.lost_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    lost_reason TEXT NOT NULL,
    competitor_name TEXT,
    notes TEXT,
    marked_by_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. FIELD VISITS & TARGETS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.field_visits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    employee_name TEXT NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    location TEXT NOT NULL,
    visit_purpose TEXT NOT NULL,
    meeting_status TEXT DEFAULT 'Scheduled',
    discussion TEXT NOT NULL,
    requirement TEXT,
    outcome TEXT,
    next_followup_date DATE,
    potential_value NUMERIC(12,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sales_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    period_month TEXT NOT NULL,
    target_revenue NUMERIC(12,2) NOT NULL,
    target_leads INT NOT NULL,
    target_prospects INT NOT NULL,
    target_conversions INT NOT NULL,
    achieved_revenue NUMERIC(12,2) DEFAULT 0.00,
    achieved_leads INT DEFAULT 0,
    achieved_prospects INT DEFAULT 0,
    achieved_conversions INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. AUDIT LOGS & NOTIFICATIONS
-- --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    company_name TEXT NOT NULL,
    author_name TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    link TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. REALTIME PUBLICATION ENABLEMENT
-- --------------------------------------------------------------------
ALTER PUBLICATION supabase_realtime ADD TABLE public.leads;
ALTER PUBLICATION supabase_realtime ADD TABLE public.follow_ups;
ALTER PUBLICATION supabase_realtime ADD TABLE public.proposals;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.field_visits;
ALTER PUBLICATION supabase_realtime ADD TABLE public.employees;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sales_targets;

-- --------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on leads" ON public.leads
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert/update on leads" ON public.leads
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on follow_ups" ON public.follow_ups
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on proposals" ON public.proposals
    FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated read on conversions" ON public.conversions
    FOR ALL TO authenticated USING (true);
