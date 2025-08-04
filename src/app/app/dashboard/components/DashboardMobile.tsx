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
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {dashboardData.user_info.name}! 👋
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Member since {formatDate(dashboardData.user_info.member_since)}
          </p>
        </div>

        {/* Stats Cards - Mobile Layout */}
        <div className="space-y-4 mb-8">
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

        {/* Quick Actions - Mobile Layout */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Button asChild className="w-full h-14 text-base font-medium">
              <Link href="/app/document-analysis">
                📄 Upload & Analyze Document
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-14 text-base font-medium">
              <Link href="/app/patent-analysis">
                📋 Patent Analysis
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full h-14 text-base font-medium">
              <Link href="/app/document-analysis?tab=history">
                💬 View Chat History
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity - Mobile Layout */}
        <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboardData.recent_activity.slice(0, 8).map((activity, index) => (
                <ActivityItem
                  key={index}
                  activity={activity}
                  isMobile={true}
                />
              ))}
            </div>
            {dashboardData.recent_activity.length === 0 && (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 