"use client";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";
import { createTimelineApi, TimelineListItem, EnhancedTimelineResponse, TimelineDocument, TimelineResponse } from "../../../lib/timelineApi";
import { validateAndLogDate } from "../../../lib/utils";
import TimelineUploader from "./TimelineUploader";
import TimelineResults from "./TimelineResults";
import EnhancedTimelineResults from "./EnhancedTimelineResults";
import TimelineHistoryList from "./TimelineHistoryList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, FileText, Check, Plus, Upload, Clock, CheckCircle, AlertTriangle, Calendar, List, Trash2, X, History } from "lucide-react";
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



export default function TimelineExtractorPage() {
  const { getAuthHeaders } = useAuth();
  const timelineApi = createTimelineApi(getAuthHeaders);
  
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [processing, setProcessing] = useState(false);
  const [timelineResult, setTimelineResult] = useState<TimelineResponse | null>(null);
  const [enhancedTimelineResult, setEnhancedTimelineResult] = useState<EnhancedTimelineResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [timelineTitle, setTimelineTitle] = useState("");
  const [includeSummary, setIncludeSummary] = useState(true);
  const [eventTypesFilter, setEventTypesFilter] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("");

  // History state
  const [timelines, setTimelines] = useState<TimelineListItem[]>([]);
  const [timelinesLoading, setTimelinesLoading] = useState(false);
  const [timelinesError, setTimelinesError] = useState<string | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<TimelineListItem | null>(null);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPageSize] = useState(10);
  const [historyTotalCount, setHistoryTotalCount] = useState(0);

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
      const data = await timelineApi.generateTimeline({
        files: uploadFiles,
        timeline_title: timelineTitle,
        include_summary: includeSummary,
        event_types_filter: eventTypesFilter || undefined,
        date_range_filter: dateRangeFilter || undefined,
      });
      
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



  const handleExportCSV = async () => {
    const timelineData = enhancedTimelineResult || timelineResult;
    if (!timelineData) return;
    
    try {
      let csvContent: string;
      if (enhancedTimelineResult) {
        // Enhanced timeline CSV export
        const csvHeaders = [
          'Date',
          'Formatted Date',
          'Event Title',
          'Event Description',
          'Event Type',
          'Event Type Label',
          'Confidence Score',
          'Confidence Label',
          'Document Source',
          'Paragraph Reference',
          'Raw Text'
        ];
        
        const csvRows = enhancedTimelineResult.events.map(event => [
          event.date,
          `"${event.formatted_date}"`,
          `"${event.event_title.replace(/"/g, '""')}"`,
          `"${event.event_description.replace(/"/g, '""')}"`,
          `"${event.event_type.replace(/"/g, '""')}"`,
          `"${event.event_type_label.replace(/"/g, '""')}"`,
          event.confidence_score,
          `"${event.confidence_label.replace(/"/g, '""')}"`,
          `"${event.document_source.replace(/"/g, '""')}"`,
          `"${event.paragraph_reference.replace(/"/g, '""')}"`,
          `"${event.raw_text.replace(/"/g, '""')}"`
        ]);
        
        csvContent = [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
             } else if (timelineResult) {
         // Regular timeline CSV export
         csvContent = await timelineApi.exportTimelineAsCSV(timelineResult);
       } else {
         throw new Error('No timeline data available for export');
       }
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${timelineData.timeline_title}_timeline.csv`;
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

  // History functionality
  const fetchTimelines = async () => {
    try {
      setTimelinesLoading(true);
      setTimelinesError(null);
      
      const data = await timelineApi.listTimelines(historyPage, historyPageSize);
      setTimelines(data.timelines);
      setHistoryTotalCount(data.total_count);
    } catch (err: any) {
      setTimelinesError(err.message || 'Failed to fetch timelines');
      setTimelines([]);
      setHistoryTotalCount(0);
    } finally {
      setTimelinesLoading(false);
    }
  };

  const handleSelectTimeline = async (timeline: TimelineListItem) => {
    setSelectedTimeline(timeline);
    setTimelinesLoading(true);
    setTimelinesError(null);
    
    try {
      const data = await timelineApi.getTimeline(timeline.timeline_id);
      
      // Validate data structure
      if (!data.events || !Array.isArray(data.events)) {
        console.error('Invalid events data:', data.events);
        throw new Error('Invalid timeline data structure');
      }
      
      // Validate and log any invalid dates in the events
      data.events.forEach((event, index) => {
        if (event.date) {
          validateAndLogDate(event.date, `event ${index}`);
        }
      });
      
      // Fetch documents for this timeline
      try {
        const documentsResponse = await timelineApi.getTimelineDocuments(timeline.timeline_id);
        // Add documents to the timeline data
        data.documents = documentsResponse.documents;
      } catch (docErr: any) {
        console.warn('Failed to fetch documents:', docErr);
        // Don't fail the entire operation if documents can't be fetched
        data.documents = [];
      }
      
      setTimelineResult(data);
      setEnhancedTimelineResult(null); // Clear enhanced timeline result
      setTab('new'); // Switch to new tab to show the timeline
      
      // Update URL to include timeline ID for persistence
      const url = new URL(window.location.href);
      url.searchParams.set('timeline', timeline.timeline_id);
      window.history.replaceState({}, '', url.toString());
    } catch (err: any) {
      console.error('Error fetching timeline:', err);
      setTimelinesError(err.message || 'Failed to load timeline');
      toast({ 
        title: 'Load Failed', 
        description: err.message || 'Failed to load timeline', 
        variant: 'destructive' 
      });
    } finally {
      setTimelinesLoading(false);
    }
  };

  const clearTimelineResult = () => {
    setSelectedTimeline(null);
    setTimelineResult(null);
    setEnhancedTimelineResult(null);
    // Clear timeline from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('timeline');
    window.history.replaceState({}, '', url.toString());
  };

  const handleDeleteTimeline = async (timelineId: string) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this timeline? This action cannot be undone.');
    if (!confirmDelete) return;

    try {
      await timelineApi.deleteTimeline(timelineId);
      toast({ title: 'Timeline Deleted', description: 'Timeline has been successfully deleted.' });
      
      // Refresh the timeline list
      await fetchTimelines();
      
      // If the deleted timeline was selected, clear the selection
      if (selectedTimeline?.timeline_id === timelineId) {
        clearTimelineResult();
      }
    } catch (err: any) {
      toast({ 
        title: 'Delete Failed', 
        description: err.message || 'Failed to delete timeline', 
        variant: 'destructive' 
      });
    }
  };

  // Fetch timelines when history tab is opened
  useEffect(() => {
    if (tab === 'history') {
      fetchTimelines();
    }
  }, [tab, historyPage, historyPageSize]);

  // Restore timeline result after page refresh if there's a selected timeline
  useEffect(() => {
    const restoreTimelineFromHistory = async () => {
      // Check if we have a timeline ID in localStorage or URL params
      const urlParams = new URLSearchParams(window.location.search);
      const timelineId = urlParams.get('timeline');
      
      if (timelineId && !timelineResult) {
        try {
          // Find the timeline in our list
          const timeline = timelines.find(t => t.timeline_id === timelineId);
          if (timeline) {
            setSelectedTimeline(timeline);
            await handleSelectTimeline(timeline);
          }
        } catch (err) {
          console.warn('Failed to restore timeline from URL:', err);
        }
      }
    };

    // Only run this effect after timelines have been fetched
    if (timelines.length > 0) {
      restoreTimelineFromHistory();
    }
  }, [timelines, timelineResult]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 sm:gap-6 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Timeline Extractor</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Generate legal timelines from documents using AI-powered analysis
        </p>
      </div>

      <Tabs value={tab} onValueChange={(value) => {
        const newTab = value as 'new' | 'history';
        setTab(newTab);
        if (newTab === 'new') {
          setProcessing(false);
          setApiError(null);
          setUploadFiles([]);
          setTimelineTitle("");
        } else if (newTab === 'history') {
          setTimelinesError(null);
          clearTimelineResult();
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50">
          <TabsTrigger value="new" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Upload className="w-4 h-4" />
            New Timeline
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 flex-1 mt-6">
          {/* Create New Button when results exist */}
          {(timelineResult || enhancedTimelineResult) && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTimelineResult(null);
                  setEnhancedTimelineResult(null);
                  setUploadFiles([]);
                  setTimelineTitle("");
                  setApiError(null);
                }}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Timeline
              </Button>
            </div>
          )}

          {/* Upload Section */}
          <Card className="w-full border-0 shadow-sm bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Upload className="w-4 h-4 text-white" />
                </div>
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
            <Card className="w-full border shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-t-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className="text-lg break-words truncate">
                        {timelineResult.timeline_title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-10">
                      {timelineResult.total_events} events extracted • {timelineResult.document_sources.length} documents
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {selectedTimeline ? 'From History' : 'Generated'}
                    </Badge>
                    {selectedTimeline && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearTimelineResult}
                        className="h-8 px-3 text-xs"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <TimelineResults 
                  timeline={timelineResult}
                  onExportCSV={handleExportCSV}
                />
              </CardContent>
            </Card>
          )}

          {/* Enhanced Results Section */}
          {enhancedTimelineResult && (
            <Card className="w-full border shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-t-lg">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Calendar className="w-4 h-4 text-white" />
                      </div>
                      <CardTitle className="text-lg break-words truncate">
                        {enhancedTimelineResult.timeline_title}
                      </CardTitle>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 ml-10">
                      {enhancedTimelineResult.metadata.total_events} events • {enhancedTimelineResult.metadata.document_sources.length} documents • 
                      Status: {enhancedTimelineResult.metadata.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Enhanced
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearTimelineResult}
                      className="h-8 px-3 text-xs"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <EnhancedTimelineResults 
                  timeline={enhancedTimelineResult}
                  onExportCSV={handleExportCSV}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex flex-col gap-6 flex-1 mt-6">
          {/* Error Alert */}
          {timelinesError && (
            <Alert variant="destructive">
              <AlertDescription>{timelinesError}</AlertDescription>
            </Alert>
          )}

          {/* Timeline History List */}
          <TimelineHistoryList
            timelines={timelines}
            totalCount={historyTotalCount}
            page={historyPage}
            pageSize={historyPageSize}
            onPageChange={setHistoryPage}
            onSelectTimeline={handleSelectTimeline}
            onDeleteTimeline={handleDeleteTimeline}
            loading={timelinesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 