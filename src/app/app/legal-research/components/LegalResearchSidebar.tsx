"use client";

import React, { useState } from "react";
import {
  Plus,
  Filter,
  ChevronDown,
  ChevronUp,
  Search,
  History,
  Bookmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import LegalResearchFilters from "./LegalResearchFilters";
import LegalResearchUsageWidget from "./LegalResearchUsageWidget";
import type { SidebarTab, SearchType } from "../hooks/useLegalResearchPageState";

interface LegalResearchSidebarProps {
  sidebarTab: SidebarTab;
  onSidebarTabChange: (tab: SidebarTab) => void;
  onNewSearch: () => void;
  searchType: SearchType;
  topK: number;
  onSearchTypeChange: (value: SearchType) => void;
  onTopKChange: (value: number) => void;
  onClearFilters: () => void;
  quickSearchQueries: string[];
  onQuickSearch: (query: string) => void;
  className?: string;
}

const TAB_CONFIG: { id: SidebarTab; label: string; icon: React.ElementType }[] = [
  { id: "search", label: "Search", icon: Search },
  { id: "history", label: "History", icon: History },
  { id: "saved", label: "Saved", icon: Bookmark },
];

export default function LegalResearchSidebar({
  sidebarTab,
  onSidebarTabChange,
  onNewSearch,
  searchType,
  topK,
  onSearchTypeChange,
  onTopKChange,
  onClearFilters,
  quickSearchQueries,
  onQuickSearch,
  className,
}: LegalResearchSidebarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <div
      className={cn(
        "flex h-full min-h-[700px] flex-col rounded-lg bg-white shadow-sm border border-slate-200",
        className
      )}
    >
      <div className="p-4 border-b border-slate-200">
        <Button
          type="button"
          onClick={onNewSearch}
          className="w-full h-auto py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg gap-2"
        >
          <Plus className="h-5 w-5" />
          New Legal Search
        </Button>
      </div>

      <div className="flex border-b border-slate-200 px-4 pt-2">
        {TAB_CONFIG.map(({ id, label, icon: Icon }) => {
          const active = sidebarTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSidebarTabChange(id)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2 rounded-t-lg text-xs transition-colors",
                active
                  ? "bg-slate-900 text-white font-semibold"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {sidebarTab === "search" && (
          <>
            <div className="rounded-lg bg-slate-100 overflow-hidden">
              <button
                type="button"
                onClick={() => setFiltersOpen((o) => !o)}
                className="flex w-full items-center justify-between px-2 py-3 text-sm text-slate-900"
              >
                <span className="flex items-center gap-1">
                  <Filter className="h-5 w-5" />
                  Filters
                </span>
                {filtersOpen ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </button>
              {filtersOpen && (
                <div className="px-2 pb-4">
                  <LegalResearchFilters
                    searchType={searchType}
                    topK={topK}
                    onSearchTypeChange={onSearchTypeChange}
                    onTopKChange={onTopKChange}
                    onClearFilters={onClearFilters}
                  />
                </div>
              )}
            </div>

            {quickSearchQueries.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Quick Searches</p>
                <div className="space-y-0">
                  {quickSearchQueries.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => onQuickSearch(q)}
                      className="w-full rounded-lg px-2 py-3 text-left text-sm text-slate-900 hover:bg-slate-100 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {sidebarTab === "history" && (
          <p className="text-xs text-slate-500 leading-relaxed">
            Browse your past legal research queries and results in the main panel.
          </p>
        )}

        {sidebarTab === "saved" && (
          <p className="text-xs text-slate-500 leading-relaxed">
            Saved searches will appear here once the feature is available.
          </p>
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <LegalResearchUsageWidget />
      </div>
    </div>
  );
}
