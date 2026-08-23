"use client";

import React from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { HistoryListItem } from "../lib/documentCategorizationUtils";
import { formatHistoryDate, formatSessionLabel } from "../lib/documentCategorizationUtils";
import DocumentCategorizationUsageWidget from "./DocumentCategorizationUsageWidget";

interface DocumentCategorizationSidebarProps {
  groupedHistory: { label: string; items: HistoryListItem[] }[];
  historyLoading: boolean;
  activeRequestId: string | null;
  onNewSession: () => void;
  onSelectHistoryItem: (item: HistoryListItem) => void;
  className?: string;
}

export default function DocumentCategorizationSidebar({
  groupedHistory,
  historyLoading,
  activeRequestId,
  onNewSession,
  onSelectHistoryItem,
  className,
}: DocumentCategorizationSidebarProps) {
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
          onClick={onNewSession}
          className="w-full h-auto py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg gap-2"
        >
          <Plus className="h-5 w-5" />
          New Session
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Recent Sessions</p>

        {historyLoading ? (
          <div className="flex items-center justify-center py-8 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : groupedHistory.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">
            No sessions yet. Upload documents to categorize your first batch.
          </p>
        ) : (
          groupedHistory.map((group) => (
            <div key={group.label} className="space-y-2">
              <p className="text-xs text-slate-500">{group.label}</p>
              {group.items.map((item) => {
                const active = activeRequestId === item.request_id;
                const categoryLabel =
                  item.category_count != null
                    ? `${item.total_documents} Files, ${item.category_count} Categories`
                    : `${item.total_documents} Files`;
                return (
                  <button
                    key={item.request_id}
                    type="button"
                    onClick={() => onSelectHistoryItem(item)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-blue-200 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <p className="text-sm font-semibold text-slate-900 truncate">
                      {formatSessionLabel(item)}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{formatHistoryDate(item.created_at)}</p>
                    <p className="text-xs text-slate-500">{categoryLabel}</p>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <DocumentCategorizationUsageWidget />
      </div>
    </div>
  );
}
