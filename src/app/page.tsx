'use client';

import React from 'react';
import { KpiCardsSection } from '@/components/dashboard/KpiCardsSection';
import { RevenueTargetSection } from '@/components/dashboard/RevenueTargetSection';
import { FollowUpControlSection } from '@/components/dashboard/FollowUpControlSection';
import { TeamPerformanceSection } from '@/components/dashboard/TeamPerformanceSection';
import { LeadSourceSection } from '@/components/dashboard/LeadSourceSection';
import { DashboardChartsSection } from '@/components/dashboard/DashboardChartsSection';

export default function DashboardPage() {
  return (
    <div className="space-y-6 pb-12">
      {/* KPI Summary Cards */}
      <KpiCardsSection />

      {/* Revenue vs Target Indicator Section */}
      <RevenueTargetSection />

      {/* Follow-up Control Center Section */}
      <FollowUpControlSection />

      {/* Team Performance Leaderboard */}
      <TeamPerformanceSection />

      {/* Lead Source Performance Breakdown */}
      <LeadSourceSection />

      {/* Recharts Visualizations */}
      <DashboardChartsSection />
    </div>
  );
}
