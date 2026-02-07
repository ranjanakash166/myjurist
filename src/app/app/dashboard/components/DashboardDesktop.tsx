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

        {/* Recent Activity and Your Statistics - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Activity - Left Column */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Recent Activity
            </h2>
            <Card className="bg-card shadow-sm border border-border h-full">
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
                  <div className="text-center text-muted-foreground py-8">
                    <p>No recent activity</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Your Statistics - Right Column */}
          <div>
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              Your Statistics
            </h2>
            <div className="grid grid-cols-1 gap-6 h-full">
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
          </div>
        </div>

        {/* Charts Section - Desktop Layout */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Activity Insights
          </h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <Card className="bg-card shadow-sm border border-border hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
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
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--card-foreground))' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-6 flex-wrap">
                {pieData.map((entry) => (
                  <span key={entry.name} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: entry.color }}></span>
                    {entry.name} ({entry.value})
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-card shadow-sm border border-border hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">
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
                        background: 'hsl(var(--card))',
                        color: 'hsl(var(--card-foreground))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        padding: '8px 12px'
                      }}
                      itemStyle={{ color: 'hsl(var(--card-foreground))' }}
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
                <div className="text-center text-muted-foreground py-8">
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