import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import {
  DashboardBanner,
  KpiCardGrid,
  RecentJobsPanel,
  QuickActionShortcuts,
} from '../../features/dashboard';

export default function AdminDashboardPage() {
  const { user, isAdmin, stats, recentJobs } = useDashboard();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <DashboardBanner user={user} isAdmin={isAdmin} />

      {/* KPI Cards */}
      <KpiCardGrid stats={stats} />

      {/* Quick Access Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentJobsPanel jobs={recentJobs} />
        <QuickActionShortcuts isAdmin={isAdmin} />
      </div>
    </div>
  );
}
