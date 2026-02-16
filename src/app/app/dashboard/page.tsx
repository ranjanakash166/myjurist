'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { fetchDashboardStats, type DashboardStats } from '@/lib/dashboardApi';
import { fetchPlanInfo, fetchPlanUsage, type PlanInfo, type PlanUsage } from '@/lib/planApi';
import { useResponsive } from './hooks/useResponsive';
import { LoadingSkeleton } from './components/shared/LoadingSkeleton';
import { ErrorDisplay } from './components/shared/ErrorDisplay';
import { DashboardDesktop } from './components/DashboardDesktop';
import { DashboardMobile } from './components/DashboardMobile';

export default function DashboardPage() {
  const { getAuthHeaders, isAuthenticated, token, refreshToken } = useAuth();
  const { isMobile } = useResponsive();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planInfoError, setPlanInfoError] = useState<string | null>(null);
  const [planUsageError, setPlanUsageError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || !token) {
        setError("Please log in to view your dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [dashboardDataResult, planInfoResult, planUsageResult] = await Promise.allSettled([
          fetchDashboardStats(getAuthHeaders(), getAuthHeaders, refreshToken),
          fetchPlanInfo(getAuthHeaders, refreshToken),
          fetchPlanUsage(getAuthHeaders, refreshToken),
        ]);

        // Handle dashboard data
        if (dashboardDataResult.status === 'fulfilled') {
          setDashboardData(dashboardDataResult.value);
        } else {
          console.error('Failed to load dashboard stats:', dashboardDataResult.reason);
        }

        // Handle plan info
        if (planInfoResult.status === 'fulfilled') {
          setPlanInfo(planInfoResult.value);
          setPlanInfoError(null);
        } else {
          const errorMsg = planInfoResult.reason instanceof Error ? planInfoResult.reason.message : String(planInfoResult.reason);
          setPlanInfoError(errorMsg);
          setPlanInfo(null);
        }

        // Handle plan usage
        if (planUsageResult.status === 'fulfilled') {
          setPlanUsage(planUsageResult.value);
          setPlanUsageError(null);
        } else {
          const errorMsg = planUsageResult.reason instanceof Error ? planUsageResult.reason.message : String(planUsageResult.reason);
          setPlanUsageError(errorMsg);
          setPlanUsage(null);
        }

        // Set error only if dashboard data failed (required)
        if (dashboardDataResult.status === 'rejected') {
          setError(dashboardDataResult.reason instanceof Error ? dashboardDataResult.reason.message : 'Failed to load dashboard data');
        }
      } catch (err) {
        console.error('Unexpected error loading dashboard:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [isAuthenticated, token, getAuthHeaders, refreshToken]);

  // Loading state
  if (loading) {
    return <LoadingSkeleton isMobile={isMobile} />;
  }

  // Error state - but still show dashboard if we have data
  if (error && !dashboardData) {
    return <ErrorDisplay error={error} isMobile={isMobile} />;
  }

  // No data state
  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No dashboard data available.</p>
          <p className="text-sm text-muted-foreground">
            {planInfo ? 'Plan info loaded' : 'Plan info not loaded'} | 
            {planUsage ? ' Usage data loaded' : ' Usage data not loaded'}
          </p>
        </div>
      </div>
    );
  }

  // Render appropriate component based on screen size
  return isMobile ? (
    <DashboardMobile 
      dashboardData={dashboardData} 
      planInfo={planInfo}
      planUsage={planUsage}
      planInfoError={planInfoError}
      planUsageError={planUsageError}
    />
  ) : (
    <DashboardDesktop 
      dashboardData={dashboardData} 
      planInfo={planInfo}
      planUsage={planUsage}
      planInfoError={planInfoError}
      planUsageError={planUsageError}
    />
  );
} 