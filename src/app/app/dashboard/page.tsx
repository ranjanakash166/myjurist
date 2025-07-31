'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/AuthProvider';
import { 
  fetchDashboardStats, 
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

export default function DashboardPage() {
  const { getAuthHeaders, isAuthenticated, token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || !token) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchDashboardStats(getAuthHeaders());
        setDashboardData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, token, getAuthHeaders]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        {/* Mobile Loading */}
        <div className="block lg:hidden">
          <div className="p-4 space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2 mb-4"></div>
              
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-1/2 mb-1"></div>
                        <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded w-2/3"></div>
                      </div>
                      <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-12"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-4">
                    <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2 mb-3"></div>
                    <div className="h-48 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                  </div>
                ))}
              </div>
              
              <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 mt-4">
                <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-3"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                      <div className="w-6 h-6 bg-gray-200 dark:bg-neutral-700 rounded mr-3"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-1"></div>
                        <div className="h-2 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
                      </div>
                      <div className="w-12 h-4 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Loading */}
        <div className="hidden lg:block">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/4 mb-2"></div>
                <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-1/5 mb-8"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                      <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-1/2 mb-3"></div>
                      <div className="h-8 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {[1, 2].map((i) => (
                    <div key={i} className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                      <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
                      <div className="h-80 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                  ))}
                </div>
                
                <div className="mb-8">
                  <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/4 mb-4"></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                  <div className="h-6 bg-gray-200 dark:bg-neutral-700 rounded w-1/3 mb-6"></div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                        <div className="flex-1">
                          <div className="h-5 bg-gray-200 dark:bg-neutral-700 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-neutral-700 rounded w-1/2"></div>
                        </div>
                        <div className="w-20 h-8 bg-gray-200 dark:bg-neutral-700 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
        {/* Mobile Error */}
        <div className="block lg:hidden">
          <div className="p-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-red-800 font-semibold mb-2 text-sm">Error Loading Dashboard</h2>
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          </div>
        </div>

        {/* Desktop Error */}
        <div className="hidden lg:block">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h2 className="text-red-800 font-semibold mb-2 text-lg">Error Loading Dashboard</h2>
                <p className="text-red-600 text-base">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

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
    // Group by date (YYYY-MM-DD) and format for display
    const map: Record<string, { date: string; displayDate: string; Documents: number; Patents: number; Chats: number }> = {};
    recent_activity.forEach((item) => {
      const date = item.timestamp.slice(0, 10);
      const displayDate = new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      if (!map[date]) map[date] = { date, displayDate, Documents: 0, Patents: 0, Chats: 0 };
      if (item.type === 'document') map[date].Documents++;
      if (item.type === 'patent') map[date].Patents++;
      if (item.type === 'chat') map[date].Chats++;
    });
    // Sort by date ascending and take last 7 entries
    const sorted = Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
    return sorted.slice(-7); // Show last 7 days
  }

  const pieData = getActivityTypeData(dashboardData.recent_activity);
  const barData = getActivityOverTimeData(dashboardData.recent_activity);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              Welcome back, {dashboardData.user_info.name}! 👋
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Member since {formatDate(dashboardData.user_info.member_since)}
            </p>
          </div>

          {/* Stats Cards - Mobile Stack */}
          <div className="space-y-3">
            <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Total Documents Analyzed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Documents processed successfully
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {dashboardData.total_documents_analyzed.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Total Patents Analyzed
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Patent analyses completed
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {dashboardData.total_patents_analyzed.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                      Recent Activity
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Activities in the last 30 days
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {dashboardData.recent_activity.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Mobile Stack */}
          <div>
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <Button asChild className="w-full h-12 text-sm">
                <Link href="/app/document-analysis">
                  📄 Upload & Analyze Document
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 text-sm">
                <Link href="/app/patent-analysis">
                  📋 Patent Analysis
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full h-12 text-sm">
                <Link href="/app/document-analysis?tab=history">
                  💬 View Chat History
                </Link>
              </Button>
            </div>
          </div>

          {/* Charts - Mobile Stack */}
          <div className="space-y-4">
            {/* Pie Chart */}
            <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Activity Type Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        innerRadius={20}
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
                <div className="flex flex-wrap justify-center gap-2 mt-3">
                  {pieData.map((entry) => (
                    <span key={entry.name} className="flex items-center gap-1 text-xs text-gray-700 dark:text-gray-300">
                      <span className="inline-block w-2 h-2 rounded-full" style={{ background: entry.color }}></span>
                      {entry.name} ({entry.value})
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Activity Over Time (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="w-full h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart 
                      data={barData} 
                      margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={document.documentElement.classList.contains('dark') ? '#374151' : '#e5e7eb'} 
                      />
                      <XAxis 
                        dataKey="displayDate" 
                        stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b'}
                        tick={{ fill: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b' }}
                        fontSize={8}
                      />
                      <YAxis 
                        stroke={document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b'}
                        tick={{ fill: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b' }}
                        fontSize={8}
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
                          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#64748b',
                          fontSize: '10px'
                        }}
                      />
                      <Bar dataKey="Documents" fill="#2563eb" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Patents" fill="#16a34a" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="Chats" fill="#a21caf" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                {barData.length === 0 && (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-4 text-xs">
                    No activity data available for the selected time period.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity - Mobile Stack */}
          <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-gray-900 dark:text-gray-100">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {dashboardData.recent_activity.slice(0, 5).map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 dark:bg-neutral-700 rounded-lg"
                  >
                    <div className="text-lg mr-3">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                    <Badge className={`${getStatusColor(activity.status)} text-xs ml-2`}>
                      {activity.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="p-6">
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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Documents Analyzed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {dashboardData.total_documents_analyzed.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Documents processed successfully
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Total Patents Analyzed
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {dashboardData.total_patents_analyzed.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Patent analyses completed
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {dashboardData.recent_activity.length}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Activities in the last 30 days
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Pie Chart */}
              <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 transition-opacity duration-700 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200" style={{ opacity: loading ? 0 : 1 }}>
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
              <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0 transition-opacity duration-700 hover:scale-[1.02] hover:shadow-xl transition-transform duration-200" style={{ opacity: loading ? 0 : 1 }}>
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

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button asChild className="h-16 text-lg hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
                  <Link href="/app/document-analysis">
                    📄 Upload & Analyze Document
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 text-lg hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
                  <Link href="/app/patent-analysis">
                    📋 Patent Analysis
                  </Link>
                </Button>
                <Button asChild variant="outline" className="h-16 text-lg hover:scale-[1.02] hover:shadow-xl transition-transform duration-200">
                  <Link href="/app/document-analysis?tab=history">
                    💬 View Chat History
                  </Link>
                </Button>
              </div>
            </div>

            {/* Recent Activity */}
            <Card className="bg-white dark:bg-neutral-800 shadow-sm border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardData.recent_activity.slice(0, 10).map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-neutral-700 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-600 hover:scale-[1.02] hover:shadow-xl transition-all duration-200 cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getActivityIcon(activity.type)}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 dark:text-gray-100">
                            {activity.title}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(activity.timestamp)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(activity.status)}>
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 