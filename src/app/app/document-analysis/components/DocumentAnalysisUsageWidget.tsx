"use client";

import React, { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { fetchPlanUsage, type FeatureUsage } from "@/lib/planApi";

function findDocumentAnalysisFeature(features: FeatureUsage[]): FeatureUsage | undefined {
  return features.find(
    (f) =>
      f.display_key.toLowerCase().includes("document") ||
      f.display_name.toLowerCase().includes("document analysis") ||
      f.display_name.toLowerCase().includes("document")
  );
}

export default function DocumentAnalysisUsageWidget() {
  const { getAuthHeaders, refreshToken } = useAuth();
  const [feature, setFeature] = useState<FeatureUsage | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const usage = await fetchPlanUsage(getAuthHeaders, refreshToken);
        if (!cancelled) {
          setFeature(findDocumentAnalysisFeature(usage.features) ?? null);
        }
      } catch {
        if (!cancelled) setFeature(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getAuthHeaders, refreshToken]);

  if (!feature) {
    return (
      <div className="rounded-lg bg-slate-100 p-3 space-y-2">
        <p className="text-xs text-slate-500">Queries this month</p>
        <p className="text-xs text-slate-400">Usage data unavailable</p>
      </div>
    );
  }

  const pct = Math.min(feature.usage_percentage, 100);

  return (
    <div className="rounded-lg bg-slate-100 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">Queries this month</p>
        <TrendingUp className="h-4 w-4 text-slate-500" />
      </div>
      <p className="text-sm font-semibold text-slate-900">
        <span className="text-slate-900">{feature.current_count}</span>
        <span className="text-slate-500 font-normal">/{feature.max_count}</span>
      </p>
      <div className="h-1 w-full rounded-full bg-slate-300 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-600"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
