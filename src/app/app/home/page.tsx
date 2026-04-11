"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  FileSearch,
  FileText,
  LayoutGrid,
  MessageSquare,
  Sparkles,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import {
  fetchDashboardStats,
  formatDate,
  type ActivityItem,
  type DashboardStats,
} from "@/lib/dashboardApi";

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
  dashboardData,
}: {
  feature: FeatureCard;
  dashboardData: DashboardStats | null;
}) {
  const Icon = feature.icon;

  return (
    <div className="rounded-[8px] bg-slate-100 p-4">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
          <Icon className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <div className="min-w-0">
          <p className="text-[20px] font-bold leading-6 tracking-tight text-slate-900">
            {feature.title}
          </p>
          <p className="mt-0.5 text-sm leading-5 text-slate-600">
            {feature.description}
          </p>
        </div>
      </div>

      <div className="my-6 h-px w-full bg-slate-200" />

      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-base font-bold leading-5 text-slate-900">
            {feature.metricValue(dashboardData)}
          </p>
          <p className="mt-1 text-sm leading-5 text-slate-600">
            {feature.metricLabel}
          </p>
        </div>

        <Button
          asChild
          size="sm"
          className="h-9 rounded-[8px] bg-slate-800 px-4 text-white hover:bg-slate-700"
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

export default function HomePage() {
  const { isAuthenticated, token, getAuthHeaders, refreshToken } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || !token) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchDashboardStats(
          getAuthHeaders(),
          getAuthHeaders,
          refreshToken
        );
        setDashboardData(data);
      } catch (loadError) {
        console.error("Failed to load home dashboard data:", loadError);
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load dashboard data."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [getAuthHeaders, isAuthenticated, refreshToken, token]);

  if (isLoading) {
    return <HomeLoadingState />;
  }

  const stats = [
    {
      label: "Chat Sessions",
      value: String(
        dashboardData?.recent_activity.filter((activity) => activity.type === "chat")
          .length ?? 0
      ),
      icon: MessageSquare,
    },
    {
      label: "Total Documents Analyzed",
      value: String(dashboardData?.total_documents_analyzed ?? 0),
      icon: FileText,
    },
    {
      label: "Patent Analyses",
      value: String(dashboardData?.total_patents_analyzed ?? 0),
      icon: FileSearch,
    },
    {
      label: "Activity Events",
      value: String(dashboardData?.recent_activity.length ?? 0),
      icon: LayoutGrid,
    },
  ];

  const recentActivity = dashboardData?.recent_activity.slice(0, 8) ?? [];

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 md:px-6 lg:px-8">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_405px]">
        <div className="min-w-0 space-y-4">
          <section className="rounded-[8px] border-[5px] border-white bg-[linear-gradient(95.86deg,#dbeafe_0.28%,#fae8ff_114.56%)] px-4 py-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:items-center">
              {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                  <div
                    key={stat.label}
                    className={`flex items-center gap-4 ${
                      index !== stats.length - 1
                        ? "xl:border-r xl:border-slate-300/80 xl:pr-4"
                        : ""
                    }`}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-white text-slate-700 shadow-sm">
                      <Icon className="h-5 w-5" strokeWidth={1.9} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[20px] font-bold leading-6 tracking-tight text-slate-900">
                        {stat.value}
                      </p>
                      <p className="text-sm leading-5 text-slate-700">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {error ? (
            <section className="rounded-[8px] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              Live dashboard data could not be loaded, so this view is showing safe fallbacks.
            </section>
          ) : null}

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
                  dashboardData={dashboardData}
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
                  dashboardData={dashboardData}
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
