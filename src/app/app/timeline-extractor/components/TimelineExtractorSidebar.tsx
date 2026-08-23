"use client";

import React, { useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import type { TimelineListItem } from "@/lib/timelineApi";
import { formatTimelineDate } from "../lib/timelineExtractorUtils";
import TimelineExtractorUsageWidget from "./TimelineExtractorUsageWidget";

interface TimelineExtractorSidebarProps {
  groupedTimelines: { label: string; items: TimelineListItem[] }[];
  timelinesLoading: boolean;
  activeTimelineId: string | null;
  onNewTimeline: () => void;
  onSelectTimeline: (item: TimelineListItem) => void;
  onDeleteTimeline: (timelineId: string) => void;
  className?: string;
}

export default function TimelineExtractorSidebar({
  groupedTimelines,
  timelinesLoading,
  activeTimelineId,
  onNewTimeline,
  onSelectTimeline,
  onDeleteTimeline,
  className,
}: TimelineExtractorSidebarProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);

  return (
    <>
      <div
        className={cn(
          "flex h-full min-h-[700px] flex-col rounded-lg bg-white shadow-sm border border-slate-200",
          className
        )}
      >
        <div className="p-4 border-b border-slate-200">
          <Button
            type="button"
            onClick={onNewTimeline}
            className="w-full h-auto py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg gap-2"
          >
            <Plus className="h-5 w-5" />
            New Timeline
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
            Recent Timelines
          </p>

          {timelinesLoading ? (
            <div className="flex items-center justify-center py-8 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : groupedTimelines.length === 0 ? (
            <p className="text-sm text-slate-400 py-4">
              No timelines yet. Upload documents to extract your first timeline.
            </p>
          ) : (
            groupedTimelines.map((group) => (
              <div key={group.label} className="space-y-2">
                <p className="text-xs text-slate-500">{group.label}</p>
                {group.items.map((item) => {
                  const active = activeTimelineId === item.timeline_id;
                  return (
                    <div
                      key={item.timeline_id}
                      className={cn(
                        "w-full rounded-lg border p-3 transition-colors",
                        active
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectTimeline(item)}
                          className="min-w-0 flex-1 text-left"
                        >
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {item.title}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {formatTimelineDate(item.updated_at || item.created_at)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.document_count} Files, {item.total_events} Events
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(item.timeline_id);
                          }}
                          className="p-1 text-slate-400 hover:text-red-600 transition-colors shrink-0"
                          aria-label={`Delete ${item.title}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-200">
          <TimelineExtractorUsageWidget />
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete timeline?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The timeline and its extracted events will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                if (deleteId) {
                  onDeleteTimeline(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
