"use client";

import React, { useRef } from "react";
import {
  Upload,
  Files,
  Settings,
  ChevronDown,
  ChevronUp,
  Calendar,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,.rtf";

interface TimelineExtractorUploadHeroProps {
  timelineTitle: string;
  onTimelineTitleChange: (value: string) => void;
  includeSummary: boolean;
  onIncludeSummaryChange: (value: boolean) => void;
  eventTypesFilter: string;
  onEventTypesFilterChange: (value: string) => void;
  dateRangeFilter: string;
  onDateRangeFilterChange: (value: string) => void;
  advancedOpen: boolean;
  onAdvancedOpenChange: (open: boolean) => void;
  onSelectFiles: (files: FileList) => void;
}

export default function TimelineExtractorUploadHero({
  timelineTitle,
  onTimelineTitleChange,
  includeSummary,
  onIncludeSummaryChange,
  eventTypesFilter,
  onEventTypesFilterChange,
  dateRangeFilter,
  onDateRangeFilterChange,
  advancedOpen,
  onAdvancedOpenChange,
  onSelectFiles,
}: TimelineExtractorUploadHeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) onSelectFiles(files);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-700 bg-clip-text text-transparent">
          Timeline Extractor
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          Extract chronological events from documents. Automatically generates visual timeline of
          key dates and milestones.
        </p>
      </div>

      <div className="space-y-2 max-w-xl mx-auto">
        <Label htmlFor="timeline-title" className="text-sm font-semibold text-slate-900">
          Timeline Title
        </Label>
        <Input
          id="timeline-title"
          value={timelineTitle}
          onChange={(e) => onTimelineTitleChange(e.target.value)}
          placeholder="Enter a descriptive title for your timeline"
          className="bg-white"
        />
      </div>

      <div
        className="rounded-2xl bg-white border-2 border-dashed border-slate-300 p-8 md:p-12 flex flex-col items-center gap-6 shadow-sm"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="w-[72px] h-[72px] rounded-lg bg-slate-100 flex items-center justify-center">
          <Upload className="h-10 w-10 text-slate-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Upload Documents</h2>
          <p className="text-sm text-slate-500">
            Drop files here or click to browse
            <br />
            Supports PDF, DOC, DOCX, TXT &amp; RTF files | Multiple files allowed
          </p>
        </div>
        <Button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-[246px] h-auto py-3.5 bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Files className="h-5 w-5" />
          Select Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div className="max-w-xl mx-auto rounded-xl bg-white border border-slate-200 overflow-hidden">
        <button
          type="button"
          onClick={() => onAdvancedOpenChange(!advancedOpen)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-slate-900"
        >
          <span className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced Settings
          </span>
          {advancedOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        {advancedOpen && (
          <div className="px-4 pb-4 space-y-4 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-slate-900">Include Summary</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generate an AI summary of the timeline events
                </p>
              </div>
              <Switch checked={includeSummary} onCheckedChange={onIncludeSummaryChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-types" className="text-sm font-medium flex items-center gap-1">
                <Filter className="h-3.5 w-3.5" />
                Event Types Filter (optional)
              </Label>
              <Input
                id="event-types"
                value={eventTypesFilter}
                onChange={(e) => onEventTypesFilterChange(e.target.value)}
                placeholder="e.g., filings, hearings, judgments"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date-range" className="text-sm font-medium flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Date Range Filter (optional)
              </Label>
              <Input
                id="date-range"
                value={dateRangeFilter}
                onChange={(e) => onDateRangeFilterChange(e.target.value)}
                placeholder="e.g., 2020-01-01 to 2024-12-31"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
