"use client";

import React from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionListItem } from "@/lib/documentAnalysisApi";
import { formatSessionDate } from "../lib/documentAnalysisUtils";
import DocumentAnalysisUsageWidget from "./DocumentAnalysisUsageWidget";

interface DocumentAnalysisSidebarProps {
  groupedSessions: { label: string; items: SessionListItem[] }[];
  sessionsLoading: boolean;
  activeSessionId: string | null;
  onNewSession: () => void;
  onSelectSession: (item: SessionListItem) => void;
  className?: string;
}

export default function DocumentAnalysisSidebar({
  groupedSessions,
  sessionsLoading,
  activeSessionId,
  onNewSession,
  onSelectSession,
  className,
}: DocumentAnalysisSidebarProps) {
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

        {sessionsLoading ? (
          <div className="flex items-center justify-center py-8 text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ) : groupedSessions.length === 0 ? (
          <p className="text-sm text-slate-400 py-4">No sessions yet. Upload documents to get started.</p>
        ) : (
          groupedSessions.map((group) => (
            <div key={group.label} className="space-y-2">
              <p className="text-xs text-slate-500">{group.label}</p>
              {group.items.map((item) => {
                const active = activeSessionId === item.session.id;
                const fileCount =
                  item.session.selected_document_count ??
                  item.session.selected_documents?.length ??
                  0;
                return (
                  <button
                    key={item.session.id}
                    type="button"
                    onClick={() => onSelectSession(item)}
                    className={cn(
                      "w-full rounded-lg border p-3 text-left transition-colors",
                      active
                        ? "border-blue-200 bg-blue-50"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {item.session.name}
                          </span>
                          <Pencil className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
                        </div>
                        <p className="text-xs text-slate-500 mt-1">
                          {formatSessionDate(item.session.last_activity)}
                        </p>
                        <p className="text-xs text-slate-500">{fileCount} Files</p>
                      </div>
                      <Trash2
                        className="h-4 w-4 shrink-0 text-slate-300 cursor-not-allowed"
                        aria-label="Delete session (not available)"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      <div className="p-4 border-t border-slate-200">
        <DocumentAnalysisUsageWidget />
      </div>
    </div>
  );
}
