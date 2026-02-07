import React, { useState } from "react";
import { Calendar, FileText, Clock, Download, Trash2, Eye, ExternalLink, FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TimelineListItem, TimelineDocument, TimelineDocumentsResponse, createTimelineApi } from "../../../lib/timelineApi";
import { formatDateSafely, getNormalizedDate } from "../../../lib/utils";
import DocumentList from "../../../components/DocumentList";
import DocumentViewerModal from "../../../components/DocumentViewerModal";
import { useAuth } from "../../../components/AuthProvider";
import { toast } from '@/hooks/use-toast';

interface TimelineHistoryListProps {
  timelines: TimelineListItem[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onSelectTimeline: (timeline: TimelineListItem) => void;
  onDeleteTimeline: (timelineId: string) => void;
  loading: boolean;
}

export default function TimelineHistoryList({
  timelines,
  totalCount,
  page,
  pageSize,
  onPageChange,
  onSelectTimeline,
  onDeleteTimeline,
  loading
}: TimelineHistoryListProps) {
  const { getAuthHeaders } = useAuth();
  const timelineApi = createTimelineApi(getAuthHeaders);
  
  const [expandedTimelines, setExpandedTimelines] = useState<Set<string>>(new Set());
  const [timelineDocumentsMap, setTimelineDocumentsMap] = useState<Map<string, TimelineDocument[]>>(new Map());
  const [documentsLoadingMap, setDocumentsLoadingMap] = useState<Map<string, boolean>>(new Map());
  const [documentsErrorMap, setDocumentsErrorMap] = useState<Map<string, string | null>>(new Map());
  
  // Modal state
  const [selectedDocument, setSelectedDocument] = useState<TimelineDocument | null>(null);
  const [documentUrl, setDocumentUrl] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  const formatDate = (dateString: string) => {
    return formatDateSafely(dateString, 'Invalid date');
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const normalizedStart = getNormalizedDate(startDate);
    const normalizedEnd = getNormalizedDate(endDate);
    
    if (!normalizedStart || !normalizedEnd) {
      return 'Invalid date range';
    }
    
    try {
      const start = new Date(normalizedStart);
      const end = new Date(normalizedEnd);
      
      return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
    } catch {
      return 'Invalid date range';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-primary/20 text-primary dark:bg-primary/30 dark:text-primary-foreground';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const handleViewDocuments = async (timeline: TimelineListItem) => {
    const timelineId = timeline.timeline_id;
    
    // Toggle expansion
    const newExpanded = new Set(expandedTimelines);
    if (newExpanded.has(timelineId)) {
      newExpanded.delete(timelineId);
      setExpandedTimelines(newExpanded);
      return;
    }
    
    // Expand and fetch documents if not already loaded
    newExpanded.add(timelineId);
    setExpandedTimelines(newExpanded);
    
    if (!timelineDocumentsMap.has(timelineId)) {
      setDocumentsLoadingMap(prev => new Map(prev).set(timelineId, true));
      setDocumentsErrorMap(prev => new Map(prev).set(timelineId, null));
      
      try {
        const documentsResponse = await timelineApi.getTimelineDocuments(timelineId);
        setTimelineDocumentsMap(prev => new Map(prev).set(timelineId, documentsResponse.documents));
      } catch (err: any) {
        console.warn('Failed to fetch documents:', err);
        setDocumentsErrorMap(prev => new Map(prev).set(timelineId, err.message || 'Failed to fetch documents'));
        setTimelineDocumentsMap(prev => new Map(prev).set(timelineId, []));
      } finally {
        setDocumentsLoadingMap(prev => new Map(prev).set(timelineId, false));
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-8 bg-muted rounded w-20"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (timelines.length === 0) {
    return (
      <Card className="flex items-center justify-center py-12">
        <CardContent className="text-center">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">No Timelines Found</h3>
          <p className="text-sm text-muted-foreground">
            You haven't generated any timelines yet. Start by creating a new timeline.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {startItem}-{endItem} of {totalCount} timelines
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {timelines.map((timeline) => (
          <Card key={timeline.timeline_id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-foreground truncate" title={timeline.title}>
                        {timeline.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          <span>{timeline.total_events} events</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(timeline.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ExternalLink className="w-4 h-4" />
                          <span>{formatDateRange(timeline.start_date, timeline.end_date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FolderOpen className="w-4 h-4" />
                          <span>{timeline.document_count} documents</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Badge className={getStatusColor(timeline.status)}>
                    {timeline.status}
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onSelectTimeline(timeline)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDocuments(timeline)}
                      className="flex items-center gap-2"
                    >
                      <FolderOpen className="w-4 h-4" />
                      {expandedTimelines.has(timeline.timeline_id) ? 'Hide' : 'Show'} Documents
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteTimeline(timeline.timeline_id)}
                      className="flex items-center gap-2 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            
            {/* Inline Documents Section */}
            {expandedTimelines.has(timeline.timeline_id) && (
              <div className="border-t border-border bg-muted/20">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      Source Documents
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDocuments(timeline)}
                      className="h-6 px-2 text-xs"
                    >
                      Hide Documents
                    </Button>
                  </div>
                  
                  {documentsLoadingMap.get(timeline.timeline_id) ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm text-muted-foreground">Loading documents...</span>
                      </div>
                    </div>
                  ) : documentsErrorMap.get(timeline.timeline_id) ? (
                    <div className="text-center py-4">
                      <p className="text-red-500 text-sm mb-2">{documentsErrorMap.get(timeline.timeline_id)}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDocuments(timeline)}
                        className="h-6 px-2 text-xs"
                      >
                        Try Again
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Array.isArray(timelineDocumentsMap.get(timeline.timeline_id)) && 
                       timelineDocumentsMap.get(timeline.timeline_id)?.map((doc, index) => {
                         return (
                        <div
                          key={doc.document_id || `doc-${index}`}
                          className="flex items-center justify-between p-3 bg-background rounded-lg border border-border hover:bg-muted/30 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="text-blue-500 flex-shrink-0">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate" title={doc.filename}>
                                {doc.filename}
                              </p>
                              <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                <Badge variant="secondary" className="text-xs">
                                  {doc.content_type || 'Unknown type'}
                                </Badge>
                                <span>{doc.file_size ? `${(doc.file_size / 1024 / 1024).toFixed(1)} MB` : 'Unknown size'}</span>
                                <span>{doc.added_at ? new Date(doc.added_at).toLocaleDateString() : 'Unknown date'}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                try {
                                  // Download using the new timeline-specific endpoint
                                  const blob = await timelineApi.downloadTimelineDocument(timeline.timeline_id, doc.document_id);
                                  const url = window.URL.createObjectURL(blob);
                                  
                                  // Set modal state
                                  setSelectedDocument(doc);
                                  setDocumentUrl(url);
                                  setIsModalOpen(true);
                                  
                                  toast({
                                    title: 'Document Loaded',
                                    description: `${doc.filename} is ready for viewing.`,
                                  });
                                } catch (err: any) {
                                  toast({
                                    title: 'View Failed',
                                    description: 'Failed to load document. Please try again.',
                                    variant: 'destructive',
                                  });
                                }
                              }}
                              className="h-6 w-6 p-0"
                              title="View Document"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={async () => {
                                try {
                                  // Download using the new timeline-specific endpoint
                                  const blob = await timelineApi.downloadTimelineDocument(timeline.timeline_id, doc.document_id);
                                  const url = window.URL.createObjectURL(blob);
                                  const link = document.createElement('a');
                                  link.href = url;
                                  link.download = doc.filename;
                                  document.body.appendChild(link);
                                  link.click();
                                  document.body.removeChild(link);
                                  window.URL.revokeObjectURL(url);
                                  toast({
                                    title: 'Download Started',
                                    description: `${doc.filename} is being downloaded.`,
                                  });
                                } catch (err: any) {
                                  toast({
                                    title: 'Download Failed',
                                    description: 'Failed to download document. Please try again.',
                                    variant: 'destructive',
                                  });
                                }
                              }}
                              className="h-6 w-6 p-0"
                              title="Download Document"
                            >
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                       );
                       })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={page === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDocument(null);
            // Clean up the blob URL when closing
            if (documentUrl) {
              window.URL.revokeObjectURL(documentUrl);
              setDocumentUrl('');
            }
          }}
          documentUrl={documentUrl}
          filename={selectedDocument.filename}
          fileType={selectedDocument.content_type}
          fileSize={selectedDocument.file_size}
        />
      )}
    </div>
  );
} 