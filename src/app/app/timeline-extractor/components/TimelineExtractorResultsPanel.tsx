"use client";

import React, { useMemo, useState } from "react";
import {
  Sparkles,
  Copy,
  Download,
  Calendar,
  Search,
  Filter,
  FileText,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import type { TimelineDisplayData } from "../hooks/useTimelineExtractorPageState";

interface TimelineExtractorResultsPanelProps {
  data: TimelineDisplayData;
  loading?: boolean;
  onExportCSV: () => void;
}

export default function TimelineExtractorResultsPanel({
  data,
  loading = false,
  onExportCSV,
}: TimelineExtractorResultsPanelProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState("all");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const eventTypes = useMemo(
    () =>
      Array.from(new Set(data.events.map((e) => e.event_type).filter(Boolean))).sort(),
    [data.events]
  );

  const filteredEvents = useMemo(() => {
    return data.events.filter((event) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        !q ||
        event.event_title.toLowerCase().includes(q) ||
        event.event_description.toLowerCase().includes(q) ||
        event.document_source.toLowerCase().includes(q) ||
        event.date.toLowerCase().includes(q);
      const matchesType = eventTypeFilter === "all" || event.event_type === eventTypeFilter;
      return matchesSearch && matchesType;
    });
  }, [data.events, searchTerm, eventTypeFilter]);

  const handleCopySummary = async () => {
    if (!data.summary) return;
    try {
      await navigator.clipboard.writeText(data.summary);
      toast({ title: "Copied", description: "Summary copied to clipboard." });
    } catch {
      toast({ title: "Copy failed", variant: "destructive" });
    }
  };

  const handleDownloadSummary = () => {
    if (!data.summary) return;
    const blob = new Blob([data.summary], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${data.title}_summary.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 space-y-6">
      {data.summaryDetailed || data.summaryShort ? (
        <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">AI Summary</h2>
                <p className="text-xs text-slate-500">Summary</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleCopySummary} className="gap-1">
                <Copy className="h-4 w-4" />
                Copy Summary
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleDownloadSummary} className="gap-1">
                <Download className="h-4 w-4" />
                Download Summary
              </Button>
            </div>
          </div>
          <div className="px-6 py-4 space-y-4">
            {data.summaryShort && (
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1.5">Overview</p>
                <p className="text-sm text-slate-800 leading-relaxed">{data.summaryShort}</p>
              </div>
            )}
            {data.summaryDetailed && (
              <div>
                {data.summaryShort && (
                  <p className="text-xs font-medium text-slate-500 mb-1.5">Detailed Summary</p>
                )}
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {data.summaryDetailed}
                </p>
              </div>
            )}
            {eventTypes.length > 0 && (
              <div className="pt-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500 mb-2">Event Type from files</p>
                <div className="flex flex-wrap gap-2">
                  {eventTypes.map((type) => (
                    <span
                      key={type}
                      className="inline-flex px-2 py-1 rounded-lg bg-sky-200 text-sm text-slate-900"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Timelines</h2>
              <p className="text-xs text-slate-500">{data.totalEvents} events extracted</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search events, dates…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-[180px] bg-slate-100 border-0 h-9 text-sm"
              />
            </div>
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-[180px] h-9 bg-slate-100 border-0 text-sm">
                <Filter className="h-3.5 w-3.5 mr-1 shrink-0" />
                <SelectValue placeholder="All Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Type</SelectItem>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" variant="outline" size="sm" onClick={onExportCSV} className="gap-1 h-9">
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 hover:bg-slate-50">
                <TableHead className="font-semibold">Dates</TableHead>
                <TableHead className="font-semibold">Event Title</TableHead>
                <TableHead className="font-semibold">Event Type</TableHead>
                <TableHead className="font-semibold">Document Source</TableHead>
                <TableHead className="font-semibold w-12">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.map((event, index) => (
                <React.Fragment key={`${event.date}-${index}`}>
                  <TableRow>
                    <TableCell className="font-medium whitespace-nowrap">{event.date}</TableCell>
                    <TableCell className="max-w-[220px]">
                      <span className="line-clamp-2" title={event.event_title}>
                        {event.event_title}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-xs text-slate-700">
                        {event.event_type || "—"}
                      </span>
                    </TableCell>
                    <TableCell className="max-w-[160px]">
                      <span className="flex items-center gap-1 text-sm truncate" title={event.document_source}>
                        <FileText className="h-3.5 w-3.5 shrink-0 text-fuchsia-700" />
                        {event.document_source.split("/").pop() || event.document_source}
                      </span>
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="p-1 text-slate-500 hover:text-slate-800"
                        aria-label="Expand event details"
                      >
                        <Plus className={`h-4 w-4 transition-transform ${expandedIndex === index ? "rotate-45" : ""}`} />
                      </button>
                    </TableCell>
                  </TableRow>
                  {expandedIndex === index && (
                    <TableRow className="bg-slate-50">
                      <TableCell colSpan={5} className="py-4">
                        <div className="space-y-2 text-sm text-slate-600">
                          <p>{event.event_description}</p>
                          {event.paragraph_reference && (
                            <p className="text-xs text-slate-500">
                              Reference: {event.paragraph_reference}
                            </p>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredEvents.length === 0 && (
          <div className="py-12 text-center text-sm text-slate-500">
            No events match your search or filter.
          </div>
        )}
      </div>
    </div>
  );
}
