"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Circle,
  CheckCircle2,
  Clock3,
  FileSearch,
  FileText,
  FolderTree,
  LayoutGrid,
  MessageSquare,
  PenTool,
  Scale,
  Sparkles,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { getUserFacingError } from "@/lib/apiClientErrors";
import {
  fetchDashboardStats,
  formatDate,
  type ActivityItem,
  type DashboardStats,
} from "@/lib/dashboardApi";
import {
  fetchPlanInfo,
  fetchPlanUsage,
  formatPeriodDate,
  getIconName,
  getPlanTierColor,
  getStatusColor,
  type FeatureUsage,
  type PlanInfo,
  type PlanUsage,
} from "@/lib/planApi";

type FeatureCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  metricLabel: string;
  metricValue: (dashboardData: DashboardStats | null) => string;
};

const assistantTools: FeatureCard[] = [
  {
    title: "My Jurist Chat",
    description: "AI Assistant for instant answers",
    href: "/app/my-jurist-chat",
    icon: MessageSquare,
    metricLabel: "Chat Sessions",
    metricValue: (dashboardData) =>
      String(
        dashboardData?.recent_activity.filter((activity) => activity.type === "chat")
          .length ?? 0
      ),
  },
  {
    title: "Legal Research",
    description: "AI powered case law & precedent search",
    href: "/app/legal-research",
    icon: FileSearch,
    metricLabel: "Recent Actions",
    metricValue: (dashboardData) =>
      String(dashboardData?.recent_activity.length ?? 0),
  },
  {
    title: "Smart Drafting",
    description: "AI powered document creation & generation",
    href: "/app/smart-drafting",
    icon: Sparkles,
    metricLabel: "Patent Analyses",
    metricValue: (dashboardData) =>
      String(dashboardData?.total_patents_analyzed ?? 0),
  },
];

const documentTools: FeatureCard[] = [
  {
    title: "Document Analysis",
    description: "Upload & analyze legal documents with AI",
    href: "/app/document-analysis",
    icon: FileText,
    metricLabel: "Documents Analyzed",
    metricValue: (dashboardData) =>
      String(dashboardData?.total_documents_analyzed ?? 0),
  },
  {
    title: "Timeline Extractor",
    description: "Chronologically extract key dates & events",
    href: "/app/timeline-extractor",
    icon: Clock3,
    metricLabel: "Recent Actions",
    metricValue: (dashboardData) =>
      String(dashboardData?.recent_activity.length ?? 0),
  },
  {
    title: "Document Categorization",
    description: "Smart document classification & sorting",
    href: "/app/document-categorization",
    icon: Tags,
    metricLabel: "Document Actions",
    metricValue: (dashboardData) =>
      String(
        dashboardData?.recent_activity.filter((activity) => activity.type === "document")
          .length ?? 0
      ),
  },
];

const UsageIconMap: Record<string, LucideIcon> = {
  Scale,
  FileSearch,
  MessageCircle: MessageSquare,
  Clock: Clock3,
  FolderTree,
  PenTool,
  Circle,
};

function capitalizeWords(value: string) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getUsageFeatureIcon(iconKey: string) {
  const iconName = getIconName(iconKey);
  return UsageIconMap[iconName] ?? Circle;
}

function getUsageTextColor(percentage: number) {
  if (percentage >= 90) return "text-rose-600";
  if (percentage >= 75) return "text-amber-600";
  if (percentage >= 50) return "text-yellow-600";
  return "text-emerald-600";
}

function getUsageBarColor(percentage: number) {
  if (percentage >= 90) return "bg-rose-500";
  if (percentage >= 75) return "bg-amber-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-emerald-500";
}

function getActivityDisplayDetails(activity: ActivityItem) {
  if (activity.details.filename) {
    return activity.details.filename;
  }

  if (activity.details.document_name) {
    return activity.details.document_name;
  }

  if (activity.details.applicant) {
    return activity.details.applicant;
  }

  return activity.title;
}

function getActivityIcon(activity: ActivityItem) {
  switch (activity.type) {
    case "chat":
      return MessageSquare;
    case "patent":
      return FileSearch;
    default:
      return FileText;
  }
}

function ToolCard({
  feature,
}: {
  feature: FeatureCard;
}) {
  const Icon = feature.icon;

  return (
    <div className="rounded-[8px] bg-slate-100 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[20px] font-bold leading-6 tracking-tight text-slate-900">
            {feature.title}
          </p>
          <p className="mt-0.5 text-sm leading-5 text-slate-600">
            {feature.description}
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="h-9 shrink-0 rounded-[8px] bg-slate-800 px-4 text-white hover:bg-slate-700"
        >
          <Link href={feature.href}>
            Launch
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>

    </div>
  );
}

function ActivityRow({ activity }: { activity: ActivityItem }) {
  const Icon = getActivityIcon(activity);

  return (
    <div className="flex items-start justify-between gap-3 rounded-[8px] px-2 py-2 transition-colors hover:bg-slate-100">
      <div className="flex min-w-0 items-start gap-4">
        <div className="mt-0.5 flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-medium leading-[22px] tracking-[-0.18px] text-slate-900">
            {activity.title}
          </p>
          <p className="truncate text-xs leading-4 tracking-[-0.12px] text-slate-900">
            {getActivityDisplayDetails(activity)}
          </p>
          <p className="mt-1 text-xs leading-4 tracking-[-0.12px] text-slate-500">
            {formatDate(activity.timestamp)}
          </p>
        </div>
      </div>

      <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-500" />
    </div>
  );
}

function HomeLoadingState() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 md:px-6 lg:px-8">
      <div className="animate-pulse space-y-4">
        <div className="h-20 rounded-[8px] bg-white/70" />
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-4">
            <div className="h-40 rounded-[8px] bg-white/70" />
            <div className="h-40 rounded-[8px] bg-white/70" />
          </div>
          <div className="h-[28rem] rounded-[8px] bg-white/70" />
        </div>
      </div>
    </div>
  );
}

function PlanDetailsCard({ planInfo, planError }: { planInfo: PlanInfo | null; planError: string | null }) {
  if (!planInfo) {
    return (
      <section className="rounded-[8px] border-[5px] border-white bg-[linear-gradient(95.86deg,#dbeafe_0.28%,#fae8ff_114.56%)] p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <LayoutGrid className="h-5 w-5" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-medium leading-6 text-slate-900">Plan details</p>
            <p className="mt-1 text-sm leading-5 text-slate-700">
              {planError ?? "Plan information is not available right now."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-[8px] border-[5px] border-white bg-[linear-gradient(95.86deg,#dbeafe_0.28%,#fae8ff_114.56%)] p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <Scale className="h-5 w-5" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-medium leading-6 text-slate-900">Plan details</p>
            <p className="mt-1 text-sm leading-5 text-slate-700">
              Your current subscription summary and status.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getPlanTierColor(
              planInfo.plan_tier
            )}`}
          >
            {capitalizeWords(planInfo.plan_name)}
          </span>
          <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${getStatusColor(
              planInfo.status
            )}`}
          >
            {capitalizeWords(planInfo.status)}
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[8px] bg-slate-100 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Plan</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {capitalizeWords(planInfo.plan_name)}
          </p>
        </div>
        <div className="rounded-[8px] bg-slate-100 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Tier</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {capitalizeWords(planInfo.plan_tier)}
          </p>
        </div>
        <div className="rounded-[8px] bg-slate-100 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Type</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {capitalizeWords(planInfo.plan_kind)}
          </p>
        </div>
        <div className="rounded-[8px] bg-slate-100 p-3">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-500">Subscription</p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {planInfo.was_auto_created ? "Auto-created" : "Managed"}
          </p>
        </div>
      </div>

      {planError ? (
        <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {planError}
        </div>
      ) : null}
    </section>
  );
}

function UsageFeatureCard({ feature }: { feature: FeatureUsage }) {
  const Icon = getUsageFeatureIcon(feature.icon);
  const usageColor = getUsageTextColor(feature.usage_percentage);
  const usageBarColor = getUsageBarColor(feature.usage_percentage);

  return (
    <div className="rounded-[8px] bg-slate-100 p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <Icon className="h-4 w-4" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">{feature.display_name}</p>
            <p className="mt-1 text-xs leading-4 text-slate-500">{feature.description}</p>
          </div>
        </div>
        <p className={`shrink-0 text-xs font-semibold ${usageColor}`}>
          {feature.usage_percentage.toFixed(0)}%
        </p>
      </div>

      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full ${usageBarColor}`}
            style={{ width: `${Math.min(feature.usage_percentage, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-500">
          {feature.current_count.toLocaleString()} / {feature.max_count.toLocaleString()} used
        </span>
        <span className={`font-semibold ${usageColor}`}>
          {feature.remaining.toLocaleString()} remaining
        </span>
      </div>
    </div>
  );
}

function UsageSummaryCard({
  planUsage,
  usageError,
}: {
  planUsage: PlanUsage | null;
  usageError: string | null;
}) {
  if (!planUsage) {
    return (
      <section className="rounded-[8px] border-[5px] border-white bg-[linear-gradient(95.86deg,#dbeafe_0.28%,#fae8ff_114.56%)] p-4 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <FileSearch className="h-5 w-5" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-medium leading-6 text-slate-900">Usage & limits</p>
            <p className="mt-1 text-sm leading-5 text-slate-700">
              {usageError ?? "Usage details are not available right now."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  const features = planUsage.features.slice(0, 6);
  const periodStart = planUsage.features[0]?.period_start;
  const periodEnd = planUsage.features[0]?.period_end;

  return (
    <section className="rounded-[8px] border-[5px] border-white bg-[linear-gradient(95.86deg,#dbeafe_0.28%,#fae8ff_114.56%)] p-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
            <FileText className="h-5 w-5" strokeWidth={1.9} />
          </div>
          <div className="min-w-0">
            <p className="text-[20px] font-medium leading-6 text-slate-900">Usage & limits</p>
            <p className="mt-1 text-sm leading-5 text-slate-700">
              {periodStart && periodEnd
                ? `Current period: ${formatPeriodDate(periodStart)} - ${formatPeriodDate(periodEnd)}`
                : "Track usage across your available features."}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <UsageFeatureCard key={feature.display_key} feature={feature} />
        ))}
      </div>

      {usageError ? (
        <div className="mt-4 rounded-[8px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {usageError}
        </div>
      ) : null}
    </section>
  );
}

export default function HomePage() {
  const { isAuthenticated, token, getAuthHeaders, refreshToken } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [planInfoError, setPlanInfoError] = useState<string | null>(null);
  const [planUsageError, setPlanUsageError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const [dashboardDataResult, planInfoResult, planUsageResult] = await Promise.allSettled([
          fetchDashboardStats(getAuthHeaders(), getAuthHeaders, refreshToken),
          fetchPlanInfo(getAuthHeaders, refreshToken),
          fetchPlanUsage(getAuthHeaders, refreshToken),
        ]);

        if (dashboardDataResult.status === "fulfilled") {
          setDashboardData(dashboardDataResult.value);
        } else {
          console.error("Failed to load home dashboard data:", dashboardDataResult.reason);
          setError(
            getUserFacingError(
              dashboardDataResult.reason,
              "Could not load your home dashboard. Please try again."
            )
          );
        }

        if (planInfoResult.status === "fulfilled") {
          setPlanInfo(planInfoResult.value);
          setPlanInfoError(null);
        } else {
          setPlanInfo(null);
          setPlanInfoError(
            getUserFacingError(
              planInfoResult.reason,
              "Could not load your plan information. Please try again."
            )
          );
        }

        if (planUsageResult.status === "fulfilled") {
          setPlanUsage(planUsageResult.value);
          setPlanUsageError(null);
        } else {
          setPlanUsage(null);
          setPlanUsageError(
            getUserFacingError(
              planUsageResult.reason,
              "Could not load your usage details. Please try again."
            )
          );
        }
      } catch (loadError) {
        console.error("Failed to load home dashboard data:", loadError);
        setError(getUserFacingError(loadError, "Failed to load dashboard data."));
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [getAuthHeaders, isAuthenticated, refreshToken, token]);

  if (isLoading) {
    return <HomeLoadingState />;
  }

  const recentActivity = dashboardData?.recent_activity.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 md:px-6 lg:px-8">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_405px]">
        <div className="min-w-0 space-y-4">
          {error ? (
            <section className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Live dashboard data could not be loaded, so this view is showing safe fallbacks.
            </section>
          ) : null}

          <div className="grid gap-4">
            <PlanDetailsCard planInfo={planInfo} planError={planInfoError} />
            <UsageSummaryCard planUsage={planUsage} usageError={planUsageError} />
          </div>

          <section className="rounded-[8px] bg-white p-4 shadow-sm">
            <div className="mb-4">
              <p className="text-[20px] font-medium leading-6 text-slate-900">
                Explore AI Chat & Assistance tools
              </p>
              <p className="text-sm leading-5 text-slate-500">
                Conversational AI built for legal assistance
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {assistantTools.map((feature) => (
                <ToolCard
                  key={feature.title}
                  feature={feature}
                />
              ))}
            </div>
          </section>

          <section className="rounded-[8px] bg-white p-4 shadow-sm">
            <div className="mb-4">
              <p className="text-[20px] font-medium leading-6 text-slate-900">
                Explore Document Intelligence tools
              </p>
              <p className="text-sm leading-5 text-slate-500">
                Upload & analyze multiple documents
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {documentTools.map((feature) => (
                <ToolCard
                  key={feature.title}
                  feature={feature}
                />
              ))}
            </div>
          </section>
        </div>

        <aside className="rounded-[8px] bg-white p-4 shadow-sm">
          <p className="text-[20px] font-medium leading-6 text-slate-900">
            Recent Activity
          </p>

          <div className="mt-4 space-y-1">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => (
                <ActivityRow
                  key={`${activity.timestamp}-${activity.title}-${index}`}
                  activity={activity}
                />
              ))
            ) : (
              <div className="rounded-[8px] bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No recent activity yet.
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
