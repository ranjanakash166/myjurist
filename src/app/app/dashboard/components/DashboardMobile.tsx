import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { StatsCard } from './shared/StatsCard';
import { ActivityItem } from './shared/ActivityItem';
import { formatDate, type DashboardStats } from '@/lib/dashboardApi';
import { Upload, Scale, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface DashboardMobileProps {
  dashboardData: DashboardStats;
}

export const DashboardMobile: React.FC<DashboardMobileProps> = ({ dashboardData }) => {
  return (
    <div className="dashboard-mobile min-h-screen bg-gray-50 dark:bg-neutral-900 px-2 py-3 overflow-x-hidden">
      <div className="w-full max-w-full mx-auto">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-1.5 leading-tight">
            Welcome back, {dashboardData.user_info.name}! 👋
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Member since {formatDate(dashboardData.user_info.member_since)}
          </p>
        </div>

        {/* Quick Actions - Mobile Layout */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              Quick Actions
            </h2>
            <Badge variant="secondary" className="text-xs">
              Start
            </Badge>
          </div>
          <div className="space-y-2">
            {/* Document Analysis Action */}
            <Link href="/app/document-analysis" className="block group">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:scale-[1.01] transition-all duration-200">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600 dark:bg-blue-700 rounded-md group-hover:scale-110 transition-transform duration-200">
                      <Upload className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Upload & Analyze
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Analyze documents
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </CardContent>
              </Card>
            </Link>

            {/* Patent Analysis Action */}
            <Link href="/app/patent-analysis" className="block group">
              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:scale-[1.01] transition-all duration-200">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-600 dark:bg-green-700 rounded-md group-hover:scale-110 transition-transform duration-200">
                      <Scale className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Patent Analysis
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Analyze patents
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-green-600 dark:text-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </CardContent>
              </Card>
            </Link>

            {/* Chat History Action */}
            <Link href="/app/document-analysis?tab=history" className="block group">
              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:scale-[1.01] transition-all duration-200">
                <CardContent className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-600 dark:bg-purple-700 rounded-md group-hover:scale-110 transition-transform duration-200">
                      <Clock className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        Chat History
                      </div>
                      <div className="text-xs text-gray-700 dark:text-gray-300">
                        Review past chats
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        <Separator className="mb-5" />

        {/* Stats Cards - Mobile Layout */}
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-2.5">
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

        {/* Recent Activity - Mobile Layout */}
        <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
          <CardHeader className="pb-2 px-3 pt-3">
            <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
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
              <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                <p className="text-xs">No recent activity</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 