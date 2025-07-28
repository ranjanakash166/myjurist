"use client";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";
import TimelineUploader from "./TimelineUploader";
import TimelineResults from "./TimelineResults";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, Download, FileText, Check, Plus, Upload, Clock, CheckCircle, AlertTriangle, Calendar, List } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface TimelineEvent {
  date: string;
  event_title: string;
  event_description: string;
  document_source: string;
  paragraph_reference: string;
  event_type: string;
  confidence_score: number;
  raw_text: string;
}

interface TimelineResponse {
  timeline_id: string;
  timeline_title: string;
  events: TimelineEvent[];
  total_events: number;
  date_range: {
    [key: string]: string;
  };
  document_sources: string[];
  processing_time_ms: number;
  summary: string;
  created_at: string;
}

export default function TimelineExtractorPage() {
  const { getAuthHeaders } = useAuth();
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [processing, setProcessing] = useState(false);
  const [timelineResult, setTimelineResult] = useState<TimelineResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [timelineTitle, setTimelineTitle] = useState("");
  const [includeSummary, setIncludeSummary] = useState(true);
  const [eventTypesFilter, setEventTypesFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");

  // File upload logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
      setApiError(null);
    }
  };

  const handleGenerateTimeline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0 || !timelineTitle.trim()) return;
    
    setProcessing(true);
    setApiError(null);
    setTimelineResult(null);
    
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      formData.append('timeline_title', timelineTitle);
      formData.append('include_summary', includeSummary.toString());
      if (eventTypesFilter) formData.append('event_types_filter', eventTypesFilter);
      if (dateRangeFilter) formData.append('date_range_filter', dateRangeFilter);

      // Only include Authorization header, never Content-Type
      const headers = { ...getAuthHeaders() };
      if ('Content-Type' in headers) delete headers['Content-Type'];
      
      const res = await fetch(`${API_BASE_URL}/timeline/generate/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to generate timeline');
      }
      
      const data = await res.json();
      setTimelineResult(data);
      toast({ 
        title: 'Timeline Generated', 
        description: `Successfully extracted ${data.total_events} events from ${data.document_sources.length} documents.` 
      });
    } catch (err: any) {
      setApiError(err.message || 'An error occurred while generating timeline.');
      toast({ 
        title: 'Generation Failed', 
        description: err.message || 'Failed to generate timeline', 
        variant: 'destructive' 
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleDownloadTimeline = async () => {
    if (!timelineResult) return;
    
    try {
      const timelineData = {
        ...timelineResult,
        export_date: new Date().toISOString(),
        export_format: 'json'
      };
      
      const blob = new Blob([JSON.stringify(timelineData, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${timelineResult.timeline_title}_timeline.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: 'Timeline Downloaded', description: 'Timeline data saved as JSON file.' });
    } catch (err: any) {
      toast({ 
        title: 'Download Failed', 
        description: 'Failed to download timeline', 
        variant: 'destructive' 
      });
    }
  };

  const handleExportCSV = async () => {
    if (!timelineResult) return;
    
    try {
      const csvHeaders = [
        'Date',
        'Event Title',
        'Event Description',
        'Document Source',
        'Paragraph Reference',
        'Event Type',
        'Confidence Score',
        'Raw Text'
      ];
      
      const csvRows = timelineResult.events.map(event => [
        event.date,
        `"${event.event_title.replace(/"/g, '""')}"`,
        `"${event.event_description.replace(/"/g, '""')}"`,
        `"${event.document_source.replace(/"/g, '""')}"`,
        `"${event.paragraph_reference.replace(/"/g, '""')}"`,
        `"${event.event_type.replace(/"/g, '""')}"`,
        event.confidence_score,
        `"${event.raw_text.replace(/"/g, '""')}"`
      ]);
      
      const csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${timelineResult.timeline_title}_timeline.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({ title: 'Timeline Exported', description: 'Timeline data exported as CSV file.' });
    } catch (err: any) {
      toast({ 
        title: 'Export Failed', 
        description: 'Failed to export timeline as CSV', 
        variant: 'destructive' 
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-4 sm:gap-6 min-h-screen">
      <Tabs value={tab} onValueChange={(value) => {
        const newTab = value as 'new' | 'history';
        setTab(newTab);
        if (newTab === 'new') {
          setProcessing(false);
          setTimelineResult(null);
          setApiError(null);
          setUploadFiles([]);
          setTimelineTitle("");
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="new" className="text-sm py-2 px-2 sm:px-4">New Timeline</TabsTrigger>
          <TabsTrigger value="history" className="text-sm py-2 px-2 sm:px-4">History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 flex-1">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Timeline Extractor</h1>
            <p className="text-muted-foreground">
              Generate legal timelines from uploaded documents using AI-powered analysis
            </p>
          </div>

          {/* Upload Section */}
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upload Documents for Timeline Extraction
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TimelineUploader
                files={uploadFiles}
                onFileChange={handleFileChange}
                timelineTitle={timelineTitle}
                setTimelineTitle={setTimelineTitle}
                includeSummary={includeSummary}
                setIncludeSummary={setIncludeSummary}
                eventTypesFilter={eventTypesFilter}
                setEventTypesFilter={setEventTypesFilter}
                dateRangeFilter={dateRangeFilter}
                setDateRangeFilter={setDateRangeFilter}
                onGenerate={handleGenerateTimeline}
                processing={processing}
                error={apiError}
              />
            </CardContent>
          </Card>

          {/* Results Section */}
          {timelineResult && (
            <Card className="w-full">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words truncate">
                      {timelineResult.timeline_title}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {timelineResult.total_events} events extracted • {timelineResult.document_sources.length} documents • 
                      Processing time: {timelineResult.processing_time_ms}ms
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Timeline Generated
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TimelineResults 
                  timeline={timelineResult}
                  onDownload={handleDownloadTimeline}
                  onExportCSV={handleExportCSV}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex flex-col gap-6 flex-1">
          {/* History Section - Placeholder for future implementation */}
          <Card className="w-full flex items-center justify-center py-12">
            <CardContent className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Timeline History</h3>
              <p className="text-sm text-muted-foreground">View and manage your previously generated timelines</p>
              <p className="text-xs text-muted-foreground mt-2">Coming soon...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 