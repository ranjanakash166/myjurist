import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatsCard } from './shared/StatsCard';
import { ActivityItem } from './shared/ActivityItem';
import { formatDate, type DashboardStats } from '@/lib/dashboardApi';

interface DashboardMobileProps {
  dashboardData: DashboardStats;
}

export const DashboardMobile: React.FC<DashboardMobileProps> = ({ dashboardData }) => {
  return (
    <div className="dashboard-mobile min-h-screen bg-background px-2 py-3 overflow-x-hidden">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-lg font-bold text-foreground mb-1.5 leading-tight">
            Welcome back, {dashboardData.user_info.name}!
          </h1>
          <p className="text-xs text-muted-foreground">
            Member since {formatDate(dashboardData.user_info.member_since)}
          </p>
        </div>

        {/* Recent Activity - Mobile Layout (Now at top) */}
        <Card className="bg-card shadow-sm border border-border mb-5">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            <div className="space-y-1.5">
              {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
                <ActivityItem
                  key={index}
                  activity={activity}
                  isMobile={true}
                />
              ))}
            </div>
            {dashboardData.recent_activity.length === 0 && (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-xs">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards - Mobile Layout */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-foreground mb-2.5">
            Your Statistics
          </h2>
        </div>
        <div className="space-y-2.5 mb-5">
          <StatsCard
            title="Total Documents Analyzed"
            value={dashboardData.total_documents_analyzed}
            description="Documents processed successfully"
            color="blue"
            isMobile={true}
          />
          <StatsCard
            title="Total Patents Analyzed"
            value={dashboardData.total_patents_analyzed}
            description="Patent analyses completed"
            color="green"
            isMobile={true}
          />
          <StatsCard
            title="Recent Activity"
            value={dashboardData.recent_activity.length}
            description="Activities in the last 30 days"
            color="purple"
            isMobile={true}
          />
        </div>
      </div>
    </div>
  );
}; 