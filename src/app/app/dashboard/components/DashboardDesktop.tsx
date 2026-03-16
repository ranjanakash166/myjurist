import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ActivityItem } from './shared/ActivityItem';
import { PlanInfo } from './shared/PlanInfo';
import { UsageDisplay } from './shared/UsageDisplay';
import { 
  formatDate, 
  type DashboardStats 
} from '@/lib/dashboardApi';
import { type PlanInfo as PlanInfoType, type PlanUsage } from '@/lib/planApi';
import { AlertCircle } from 'lucide-react';

interface DashboardDesktopProps {
  dashboardData: DashboardStats;
  planInfo: PlanInfoType | null;
  planUsage: PlanUsage | null;
  planInfoError?: string | null;
  planUsageError?: string | null;
}

export const DashboardDesktop: React.FC<DashboardDesktopProps> = ({ dashboardData, planInfo, planUsage, planInfoError, planUsageError }) => {

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {dashboardData.user_info.name}!
          </h1>
          <p className="text-muted-foreground">
            Member since {formatDate(dashboardData.user_info.member_since)}
          </p>
        </div>

        {/* Plan Information - First Section */}
        {planInfo ? (
          <PlanInfo planInfo={planInfo} isMobile={false} />
        ) : planInfoError ? (
          <Card className="bg-card shadow-sm border border-red-200 dark:border-red-800 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-400">
                Plan Information Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">Failed to load plan information</p>
                  <p className="text-xs text-muted-foreground mb-3 break-words">{planInfoError}</p>
                  <p className="text-xs text-muted-foreground">
                    Check browser console (F12) for more details. Verify API endpoint: <code className="bg-muted px-1 py-0.5 rounded text-xs">/api/v1/plans/me</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card shadow-sm border border-border mb-6">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Loading plan information...</p>
            </CardContent>
          </Card>
        )}

        {/* Usage Display - Second Section */}
        {planUsage ? (
          <UsageDisplay planUsage={planUsage} isMobile={false} />
        ) : planUsageError ? (
          <Card className="bg-card shadow-sm border border-red-200 dark:border-red-800 mb-6">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-red-600 dark:text-red-400">
                Usage Data Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground mb-1">Failed to load usage data</p>
                  <p className="text-xs text-muted-foreground mb-3 break-words">{planUsageError}</p>
                  <p className="text-xs text-muted-foreground">
                    Check browser console (F12) for more details. Verify API endpoint: <code className="bg-muted px-1 py-0.5 rounded text-xs">/api/v1/plans/me/usage</code>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card shadow-sm border border-border mb-6">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Loading usage data...</p>
            </CardContent>
          </Card>
        )}

        {/* Recent Activity Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Recent Activity
          </h2>
          <Card className="bg-card shadow-sm border border-border">
            <CardContent className="pt-6">
              {dashboardData.recent_activity && Array.isArray(dashboardData.recent_activity) && dashboardData.recent_activity.length > 0 ? (
                <div className="space-y-4">
                  {dashboardData.recent_activity.slice(0, 10).map((activity, index) => (
                    <ActivityItem
                      key={`activity-${index}-${activity.timestamp}`}
                      activity={activity}
                      isMobile={false}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 