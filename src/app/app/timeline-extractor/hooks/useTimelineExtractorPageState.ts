"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { getUserFacingError } from "@/lib/apiClientErrors";
import {
  createTimelineApi,
  type EnhancedTimelineResponse,
  type TimelineDocument,
  type TimelineListItem,
  type TimelineResponse,
} from "@/lib/timelineApi";
import { validateAndLogDate } from "@/lib/utils";
import { groupTimelinesByDate, parseTimelineSummary, parseTimelineSummaryParts } from "../lib/timelineExtractorUtils";

export type ViewMode = "upload" | "file-selection" | "extracting" | "results";

export interface TimelineDisplayEvent {
  date: string;
  event_title: string;
  event_description: string;
  event_type: string;
  document_source: string;
  confidence_score: number;
  paragraph_reference?: string;
  raw_text?: string;
}

export interface TimelineDisplayData {
  timelineId: string;
  title: string;
  totalEvents: number;
  summary: string;
  summaryShort: string;
  summaryDetailed: string;
  events: TimelineDisplayEvent[];
}

function toSummaryFields(timeline: TimelineResponse, enhanced?: EnhancedTimelineResponse | null) {
  const fromEnhanced = enhanced?.summary ? parseTimelineSummaryParts(enhanced.summary) : { short: "", detailed: "" };
  const fromTimeline = parseTimelineSummaryParts(timeline.summary);

  const summaryShort = fromEnhanced.short || fromTimeline.short;
  const summaryDetailed = fromEnhanced.detailed || fromTimeline.detailed;
  const raw = enhanced?.summary ?? timeline.summary;

  return {
    summaryShort,
    summaryDetailed,
    summary:
      summaryDetailed && summaryShort
        ? `${summaryShort}\n\n${summaryDetailed}`
        : summaryDetailed || summaryShort || parseTimelineSummary(raw),
  };
}

function toDisplayData(
  timeline: TimelineResponse,
  enhanced?: EnhancedTimelineResponse | null
): TimelineDisplayData {
  const summaryFields = toSummaryFields(timeline, enhanced);
  if (enhanced) {
    return {
      timelineId: enhanced.timeline_id,
      title: enhanced.timeline_title,
      totalEvents: enhanced.metadata.total_events,
      ...summaryFields,
      events: enhanced.events.map((e) => ({
        date: e.formatted_date || e.date,
        event_title: e.event_title,
        event_description: e.event_description,
        event_type: e.event_type,
        document_source: e.document_source,
        confidence_score: e.confidence_score,
        paragraph_reference: e.paragraph_reference,
        raw_text: e.raw_text,
      })),
    };
  }
  return {
    timelineId: timeline.timeline_id,
    title: timeline.timeline_title,
    totalEvents: timeline.total_events,
    ...summaryFields,
    events: timeline.events.map((e) => ({
      date: e.date,
      event_title: e.event_title,
      event_description: e.event_description,
      event_type: e.event_type,
      document_source: e.document_source,
      confidence_score: e.confidence_score,
      paragraph_reference: e.paragraph_reference,
      raw_text: e.raw_text,
    })),
  };
}

export function useTimelineExtractorPageState() {
  const { getAuthHeaders } = useAuth();
  const timelineApi = useMemo(() => createTimelineApi(getAuthHeaders), [getAuthHeaders]);

  const [recentTimelines, setRecentTimelines] = useState<TimelineListItem[]>([]);
  const [timelinesLoading, setTimelinesLoading] = useState(false);

  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [timelineTitle, setTimelineTitle] = useState("");
  const [includeSummary, setIncludeSummary] = useState(true);
  const [eventTypesFilter, setEventTypesFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const [processing, setProcessing] = useState(false);
  const [extractError, setExtractError] = useState<string | null>(null);

  const [activeTimelineId, setActiveTimelineId] = useState<string | null>(null);
  const [timelineResult, setTimelineResult] = useState<TimelineResponse | null>(null);
  const [enhancedTimelineResult, setEnhancedTimelineResult] = useState<EnhancedTimelineResponse | null>(null);
  const [timelineDocuments, setTimelineDocuments] = useState<TimelineDocument[]>([]);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [documentUrl, setDocumentUrl] = useState("");
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [documentModalFilename, setDocumentModalFilename] = useState("");
  const [documentModalType, setDocumentModalType] = useState("");
  const [documentModalSize, setDocumentModalSize] = useState(0);

  const groupedTimelines = useMemo(
    () => groupTimelinesByDate(recentTimelines),
    [recentTimelines]
  );

  const displayData = useMemo((): TimelineDisplayData | null => {
    if (!timelineResult) return null;
    return toDisplayData(timelineResult, enhancedTimelineResult);
  }, [timelineResult, enhancedTimelineResult]);

  const viewMode: ViewMode = useMemo(() => {
    if (processing) return "extracting";
    if (timelineResult) return "results";
    if (localFiles.length > 0) return "file-selection";
    return "upload";
  }, [processing, timelineResult, localFiles.length]);

  const loadRecentTimelines = useCallback(async () => {
    setTimelinesLoading(true);
    try {
      const data = await timelineApi.listTimelines(1, 50);
      setRecentTimelines(data.timelines);
    } catch (err) {
      console.error("Failed to load timelines:", err);
    } finally {
      setTimelinesLoading(false);
    }
  }, [timelineApi]);

  useEffect(() => {
    void loadRecentTimelines();
  }, [loadRecentTimelines]);

  const loadTimelineDocuments = useCallback(
    async (timelineId: string) => {
      try {
        const docs = await timelineApi.getTimelineDocuments(timelineId);
        setTimelineDocuments(docs.documents);
      } catch {
        setTimelineDocuments([]);
      }
    },
    [timelineApi]
  );

  const loadTimelineById = useCallback(
    async (timelineId: string, title?: string) => {
      setResultsLoading(true);
      setExtractError(null);
      setActiveTimelineId(timelineId);
      if (title) setTimelineTitle(title);

      try {
        const data = await timelineApi.getTimeline(timelineId);
        data.events?.forEach((event, index) => {
          if (event.date) validateAndLogDate(event.date, `event ${index}`);
        });

        let enhanced: EnhancedTimelineResponse | null = null;
        try {
          enhanced = await timelineApi.getEnhancedTimeline(timelineId);
        } catch {
          enhanced = null;
        }

        setTimelineResult(data);
        setEnhancedTimelineResult(enhanced);
        setLocalFiles([]);
        await loadTimelineDocuments(timelineId);

        const url = new URL(window.location.href);
        url.searchParams.set("timeline", timelineId);
        window.history.replaceState({}, "", url.toString());
      } catch (err) {
        const msg = getUserFacingError(err, "Could not load this timeline. Please try again.");
        setExtractError(msg);
        toast({ title: "Load failed", description: msg, variant: "destructive" });
      } finally {
        setResultsLoading(false);
      }
    },
    [timelineApi, loadTimelineDocuments]
  );

  useEffect(() => {
    const timelineId = new URLSearchParams(window.location.search).get("timeline");
    if (timelineId && !timelineResult && recentTimelines.length > 0) {
      const item = recentTimelines.find((t) => t.timeline_id === timelineId);
      if (item) void loadTimelineById(item.timeline_id, item.title);
    }
  }, [recentTimelines, timelineResult, loadTimelineById]);

  const resetToNewTimeline = useCallback(() => {
    setLocalFiles([]);
    setTimelineTitle("");
    setExtractError(null);
    setTimelineResult(null);
    setEnhancedTimelineResult(null);
    setActiveTimelineId(null);
    setTimelineDocuments([]);
    setProcessing(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("timeline");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const handleSelectFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setExtractError(null);
    setLocalFiles((prev) => {
      const keys = new Set(prev.map((f) => f.name + f.size));
      const merged = [...prev];
      for (const f of arr) {
        if (!keys.has(f.name + f.size)) merged.push(f);
      }
      return merged;
    });
  }, []);

  const handleRemoveLocalFile = useCallback((index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProceedAndExtract = useCallback(async () => {
    if (localFiles.length === 0 || !timelineTitle.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a timeline title and select at least one file.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setExtractError(null);
    setTimelineResult(null);
    setEnhancedTimelineResult(null);

    try {
      const data = await timelineApi.generateTimeline({
        files: localFiles,
        timeline_title: timelineTitle.trim(),
        include_summary: includeSummary,
        event_types_filter: eventTypesFilter || undefined,
        date_range_filter: dateRangeFilter || undefined,
      });

      setActiveTimelineId(data.timeline_id);
      setTimelineResult(data);

      let enhanced: EnhancedTimelineResponse | null = null;
      try {
        enhanced = await timelineApi.getEnhancedTimeline(data.timeline_id);
        setEnhancedTimelineResult(enhanced);
      } catch {
        setEnhancedTimelineResult(null);
      }

      if (data.documents?.length) {
        setTimelineDocuments(data.documents);
      } else {
        await loadTimelineDocuments(data.timeline_id);
      }

      setLocalFiles([]);
      void loadRecentTimelines();

      const url = new URL(window.location.href);
      url.searchParams.set("timeline", data.timeline_id);
      window.history.replaceState({}, "", url.toString());

      toast({
        title: "Timeline generated",
        description: `Successfully extracted ${data.total_events} events from ${data.document_sources.length} documents.`,
      });
    } catch (err) {
      const msg = getUserFacingError(err, "Could not generate this timeline. Please try again.");
      setExtractError(msg);
      toast({ title: "Generation failed", description: msg, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  }, [
    localFiles,
    timelineTitle,
    includeSummary,
    eventTypesFilter,
    dateRangeFilter,
    timelineApi,
    loadTimelineDocuments,
    loadRecentTimelines,
  ]);

  const handleSelectTimeline = useCallback(
    (item: TimelineListItem) => {
      void loadTimelineById(item.timeline_id, item.title);
    },
    [loadTimelineById]
  );

  const handleDeleteTimeline = useCallback(
    async (timelineId: string) => {
      try {
        await timelineApi.deleteTimeline(timelineId);
        toast({ title: "Timeline deleted", description: "Timeline has been successfully deleted." });
        if (activeTimelineId === timelineId) resetToNewTimeline();
        void loadRecentTimelines();
      } catch (err) {
        toast({
          title: "Delete failed",
          description: getUserFacingError(err, "Could not delete this timeline. Please try again."),
          variant: "destructive",
        });
      }
    },
    [timelineApi, activeTimelineId, resetToNewTimeline, loadRecentTimelines]
  );

  const handleExportCSV = useCallback(async () => {
    if (!displayData) return;
    try {
      let csvContent: string;
      if (enhancedTimelineResult) {
        const headers = [
          "Date",
          "Formatted Date",
          "Event Title",
          "Event Description",
          "Event Type",
          "Confidence Score",
          "Document Source",
          "Paragraph Reference",
          "Raw Text",
        ];
        const rows = enhancedTimelineResult.events.map((event) => [
          event.date,
          `"${event.formatted_date.replace(/"/g, '""')}"`,
          `"${event.event_title.replace(/"/g, '""')}"`,
          `"${event.event_description.replace(/"/g, '""')}"`,
          `"${event.event_type.replace(/"/g, '""')}"`,
          event.confidence_score,
          `"${event.document_source.replace(/"/g, '""')}"`,
          `"${event.paragraph_reference.replace(/"/g, '""')}"`,
          `"${event.raw_text.replace(/"/g, '""')}"`,
        ]);
        csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
      } else if (timelineResult) {
        csvContent = await timelineApi.exportTimelineAsCSV(timelineResult);
      } else {
        return;
      }

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${displayData.title}_timeline.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast({ title: "Timeline exported", description: "Timeline data exported as CSV file." });
    } catch {
      toast({ title: "Export failed", description: "Failed to export timeline as CSV.", variant: "destructive" });
    }
  }, [displayData, enhancedTimelineResult, timelineResult, timelineApi]);

  const handleViewDocument = useCallback(
    async (documentId: string, filename: string, contentType: string, fileSize: number) => {
      if (!activeTimelineId) return;
      try {
        const blob = await timelineApi.downloadTimelineDocument(activeTimelineId, documentId);
        const url = window.URL.createObjectURL(blob);
        setDocumentUrl(url);
        setDocumentModalFilename(filename);
        setDocumentModalType(contentType);
        setDocumentModalSize(fileSize);
        setDocumentModalOpen(true);
      } catch (err) {
        toast({
          title: "Could not open document",
          description: getUserFacingError(err, "Could not open this document. Please try again."),
          variant: "destructive",
        });
      }
    },
    [activeTimelineId, timelineApi]
  );

  const handleDownloadDocument = useCallback(
    async (documentId: string, filename: string) => {
      if (!activeTimelineId) return;
      try {
        const blob = await timelineApi.downloadTimelineDocument(activeTimelineId, documentId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        toast({
          title: "Download failed",
          description: getUserFacingError(err, "Could not download this document. Please try again."),
          variant: "destructive",
        });
      }
    },
    [activeTimelineId, timelineApi]
  );

  const handleCloseDocumentModal = useCallback(() => {
    setDocumentModalOpen(false);
    if (documentUrl) {
      window.URL.revokeObjectURL(documentUrl);
      setDocumentUrl("");
    }
  }, [documentUrl]);

  return {
    groupedTimelines,
    timelinesLoading,
    activeTimelineId,
    localFiles,
    timelineTitle,
    setTimelineTitle,
    includeSummary,
    setIncludeSummary,
    eventTypesFilter,
    setEventTypesFilter,
    dateRangeFilter,
    setDateRangeFilter,
    advancedOpen,
    setAdvancedOpen,
    processing,
    extractError,
    displayData,
    timelineDocuments,
    resultsLoading,
    viewMode,
    documentModalOpen,
    documentUrl,
    documentModalFilename,
    documentModalType,
    documentModalSize,
    resetToNewTimeline,
    handleSelectFiles,
    handleRemoveLocalFile,
    handleProceedAndExtract,
    handleSelectTimeline,
    handleDeleteTimeline,
    handleExportCSV,
    handleViewDocument,
    handleDownloadDocument,
    handleCloseDocumentModal,
    loadRecentTimelines,
  };
}
