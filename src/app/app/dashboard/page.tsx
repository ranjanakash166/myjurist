'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { fetchDashboardStats, type DashboardStats } from '@/lib/dashboardApi';
import { useResponsive } from './hooks/useResponsive';
import { LoadingSkeleton } from './components/shared/LoadingSkeleton';
import { ErrorDisplay } from './components/shared/ErrorDisplay';
import { DashboardDesktop } from './components/DashboardDesktop';
import { DashboardMobile } from './components/DashboardMobile';

export default function DashboardPage() {
  const { getAuthHeaders, isAuthenticated, token } = useAuth();
  const { isMobile } = useResponsive();
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

  // Loading state
  if (loading) {
    return <LoadingSkeleton isMobile={isMobile} />;
  }

  // Error state
  if (error) {
    return <ErrorDisplay error={error} isMobile={isMobile} />;
  }

  // No data state
  if (!dashboardData) {
    return null;
  }

  // Render appropriate component based on screen size
  return isMobile ? (
    <DashboardMobile dashboardData={dashboardData} />
  ) : (
    <DashboardDesktop dashboardData={dashboardData} />
  );
} 