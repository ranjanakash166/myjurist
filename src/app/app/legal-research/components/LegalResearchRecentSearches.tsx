"use client";

import React from "react";
import type { LegalResearchHistoryItem } from "@/lib/legalResearchApi";
import { formatHistoryDate, formatCourtLabel } from "../lib/legalResearchUtils";

interface LegalResearchRecentSearchesProps {
  items: LegalResearchHistoryItem[];
  isLoading: boolean;
  onSelect: (query: string) => void;
}

function searchTypeLabel(type: string): string {
  if (type === "general") return "General";
  if (type === "supreme_court") return "Supreme Court";
  if (type === "high_court") return "High Court";
  return formatCourtLabel(type);
}

export default function LegalResearchRecentSearches({
  items,
  isLoading,
  onSelect,
}: LegalResearchRecentSearchesProps) {
  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl mt-10 space-y-3">
        <p className="text-sm text-slate-500">Recent Searches</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 rounded-lg bg-slate-200 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl mt-10">
        <p className="text-sm text-slate-500 mb-3">Recent Searches</p>
        <p className="text-sm text-slate-400">No recent searches yet. Start searching to build your history.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl mt-10 space-y-3">
      <p className="text-sm text-slate-500">Recent Searches</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {items.map((item) => (
          <button
            key={item.research_id}
            type="button"
            onClick={() => onSelect(item.query)}
            className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-left hover:bg-slate-100 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-base text-slate-900 truncate">{item.query}</p>
              <p className="text-xs text-slate-500 mt-1">{formatHistoryDate(item.created_at)}</p>
            </div>
            <p className="text-xs text-slate-600 shrink-0">
              {item.total_results} {item.total_results === 1 ? "Result" : "Results"}
            </p>
            <span className="shrink-0 rounded-full bg-slate-200 px-2 py-1 text-[9px] font-medium text-slate-600">
              {searchTypeLabel(item.search_type)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
