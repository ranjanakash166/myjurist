import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StatsCard } from './shared/StatsCard';
import { ActivityItem } from './shared/ActivityItem';
import { 
  formatDate, 
  getActivityIcon, 
  getStatusColor,
  type DashboardStats 
} from '@/lib/dashboardApi';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DashboardDesktopProps {
  dashboardData: DashboardStats;
}

export const DashboardDesktop: React.FC<DashboardDesktopProps> = ({ dashboardData }) => {
  function getActivityTypeData(recent_activity: DashboardStats['recent_activity']) {
    const counts = { document: 0, patent: 0, chat: 0 };
    recent_activity.forEach((item) => {
      if (item.type in counts) counts[item.type as keyof typeof counts]++;
    });
    return [
      { name: 'Documents', value: counts.document, color: '#2563eb' },
      { name: 'Patents', value: counts.patent, color: '#16a34a' },
      { name: 'Chats', value: counts.chat, color: '#a21caf' },
    ];
  }

  function getActivityOverTimeData(recent_activity: DashboardStats['recent_activity']) {
    const map: Record<string, { date: string; displayDate: string; Documents: number; Patents: number; Chats: number }> = {};
    recent_activity.forEach((item) => {
      const date = item.timestamp.slice(0, 10);
      const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[date]) map[date] = { date, displayDate, Documents: 0, Patents: 0, Chats: 0 };
      if (item.type === 'document') map[date].Documents++;
      if (item.type === 'patent') map[date].Patents++;
      if (item.type === 'chat') map[date].Chats++;
    });
    const sorted = Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-7);
  }

  const pieData = getActivityTypeData(dashboardData.recent_activity);
  const barData = getActivityOverTimeData(dashboardData.recent_activity);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Welcome back, {dashboardData.user_info.name}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Member since {formatDate(dashboardData.user_info.member_since)}
          </p>
        </div>

        {/* Recent Activity - Desktop Layout (Now at top) */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Recent Activity
          </h2>
          <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
            <CardContent className="pt-6">
              <div className="space-y-4">
                {dashboardData.recent_activity.slice(0, 10).map((activity, index) => (
                  <ActivityItem
                    key={index}
                    activity={activity}
                    isMobile={false}
                  />
                ))}
              </div>
              {dashboardData.recent_activity.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <p>No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards - Desktop Layout */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Your Statistics
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Total Documents Analyzed"
            value={dashboardData.total_documents_analyzed}
            description="Documents processed successfully"
            color="blue"
            isMobile={false}
          />
          <StatsCard
            title="Total Patents Analyzed"
            value={dashboardData.total_patents_analyzed}
            description="Patent analyses completed"
            color="green"
            isMobile={false}
          />
          <StatsCard
            title="Recent Activity"
            value={dashboardData.recent_activity.length}
            description="Activities in the last 30 days"
            color="purple"
            isMobile={false}
          />
        </div>

        {/* Charts Section - Desktop Layout */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Activity Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Activity Type Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{ 
                        background: 'rgba(30,41,59,0.95)', 
                        color: '#fff', 
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {pieData.map((entry) => (
                  <span key={entry.name} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                    {entry.name} ({entry.value})
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Activity Over Time (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={barData} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid 
                      strokeDasharray="3 3" 
                      stroke={document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'} 
                    />
                    <XAxis 
                      dataKey="displayDate" 
                      stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b'}
                      tick={{ fill: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b' }}
                      fontSize={12}
                    />
                    <YAxis 
                      stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b'}
                      tick={{ fill: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b' }}
                      fontSize={12}
                    />
                    <RechartsTooltip
                      contentStyle={{ 
                        background: 'rgba(30,41,59,0.95)', 
                        color: '#fff', 
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend 
                      wrapperStyle={{
                        color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b'
                      }}
                    />
                    <Bar dataKey="Documents" fill="#2563eb" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Patents" fill="#16a34a" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Chats" fill="#a21caf" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              {barData.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  No activity data available for the selected time period.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}; 