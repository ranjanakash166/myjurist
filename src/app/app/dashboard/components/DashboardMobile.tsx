import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityItem } from './shared/ActivityItem';
import { PlanInfo } from './shared/PlanInfo';
import { UsageDisplay } from './shared/UsageDisplay';
import { formatDate, type DashboardStats } from '@/lib/dashboardApi';
import { type PlanInfo as PlanInfoType, type PlanUsage } from '@/lib/planApi';
import { AlertCircle } from 'lucide-react';

interface DashboardMobileProps {
  dashboardData: DashboardStats;
  planInfo: PlanInfoType | null;
  planUsage: PlanUsage | null;
  planInfoError?: string | null;
  planUsageError?: string | null;
}

export const DashboardMobile: React.FC<DashboardMobileProps> = ({ dashboardData, planInfo, planUsage, planInfoError, planUsageError }) => {
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

        {/* Plan Information - First Section */}
        {planInfo ? (
          <PlanInfo planInfo={planInfo} isMobile={true} />
        ) : planInfoError ? (
          <Card className="bg-card shadow-sm border border-red-200 dark:border-red-800 mb-5">
            <CardContent className="pt-4 px-3 pb-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Failed to load plan information</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{planInfoError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card shadow-sm border border-border mb-5">
            <CardContent className="pt-4 px-3 pb-3">
              <p className="text-xs text-muted-foreground">Loading plan information...</p>
            </CardContent>
          </Card>
        )}

        {/* Usage Display - Second Section */}
        {planUsage ? (
          <UsageDisplay planUsage={planUsage} isMobile={true} />
        ) : planUsageError ? (
          <Card className="bg-card shadow-sm border border-red-200 dark:border-red-800 mb-5">
            <CardContent className="pt-4 px-3 pb-3">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium">Failed to load usage data</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{planUsageError}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card shadow-sm border border-border mb-5">
            <CardContent className="pt-4 px-3 pb-3">
              <p className="text-xs text-muted-foreground">Loading usage data...</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity - Mobile Layout */}
        <Card className="bg-card shadow-sm border border-border mb-5">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-base font-semibold text-foreground">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3">
            {dashboardData.recent_activity && Array.isArray(dashboardData.recent_activity) && dashboardData.recent_activity.length > 0 ? (
              <div className="space-y-1.5">
                {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
                  <ActivityItem
                    key={`activity-${index}-${activity.timestamp}`}
                    activity={activity}
                    isMobile={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-4">
                <p className="text-xs">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 