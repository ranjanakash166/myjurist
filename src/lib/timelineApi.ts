import { API_BASE_URL } from "../app/constants";

export interface TimelineEvent {
  date: string;
  event_title: string;
  event_description: string;
  document_source: string;
  paragraph_reference: string;
  event_type: string;
  confidence_score: number;
  raw_text: string;
}

export interface TimelineResponse {
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
  documents?: TimelineDocument[];
}

export interface TimelineDocument {
  id: string | null;
  filename: string;
  file_size: number | null;
  content_type: string | null;
  upload_timestamp: string | null;
  total_chunks: number | null;
  total_tokens: number | null;
  processing_status: string;
  source_type: string;
}

// Enhanced Timeline Interfaces
export interface EnhancedTimelineEvent {
  id: string;
  date: string;
  formatted_date: string;
  event_title: string;
  event_description: string;
  event_type: string;
  event_type_label: string;
  confidence_score: number;
  confidence_label: string;
  document_source: string;
  paragraph_reference: string;
  raw_text: string;
  ui_metadata: {
    [key: string]: any;
  };
}

export interface TimelineMetadata {
  total_events: number;
  date_range: {
    [key: string]: string;
  };
  document_sources: string[];
  processing_time_ms: number;
  created_at: string;
  status: string;
}

export interface TimelineSummary {
  short: string;
  detailed: string;
  key_insights: string[];
  legal_matter: string;
}

export interface TimelineStatistics {
  event_type_distribution: {
    [key: string]: number;
  };
  document_distribution: {
    [key: string]: number;
  };
  average_confidence: number;
  timeline_duration_days: number;
}

export interface EnhancedTimelineResponse {
  timeline_id: string;
  timeline_title: string;
  metadata: TimelineMetadata;
  events: EnhancedTimelineEvent[];
  summary: TimelineSummary;
  statistics: TimelineStatistics;
  documents?: TimelineDocument[];
}

export interface TimelineListItem {
  timeline_id: string;
  title: string;
  total_events: number;
  created_at: string;
  updated_at: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface TimelineListResponse {
  timelines: TimelineListItem[];
  total_count: number;
  page: number;
  page_size: number;
}

export interface TimelineUploadRequest {
  files: File[];
  timeline_title: string;
  include_summary: boolean;
  event_types_filter?: string;
  date_range_filter?: string;
}

export class TimelineApi {
  private baseUrl: string;
  private getAuthHeaders: () => Record<string, string>;

  constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
    this.baseUrl = baseUrl;
    this.getAuthHeaders = getAuthHeaders;
  }

  async generateTimeline(request: TimelineUploadRequest): Promise<TimelineResponse> {
    const formData = new FormData();
    
    // Add files
    request.files.forEach(file => formData.append('files', file));
    
    // Add other parameters
    formData.append('timeline_title', request.timeline_title);
    formData.append('include_summary', request.include_summary.toString());
    
    if (request.event_types_filter) {
      formData.append('event_types_filter', request.event_types_filter);
    }
    
    if (request.date_range_filter) {
      formData.append('date_range_filter', request.date_range_filter);
    }

    // Get headers without Content-Type (let browser set it for FormData)
    const headers = { ...this.getAuthHeaders() };
    if ('Content-Type' in headers) delete headers['Content-Type'];

    const response = await fetch(`${this.baseUrl}/timeline/generate/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to generate timeline');
    }

    return response.json();
  }

  async getTimeline(timelineId: string): Promise<TimelineResponse> {
    const response = await fetch(`${this.baseUrl}/timeline/${timelineId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to fetch timeline');
    }

    return response.json();
  }

  async getEnhancedTimeline(timelineId: string): Promise<EnhancedTimelineResponse> {
    const response = await fetch(`${this.baseUrl}/timeline/enhanced/${timelineId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to fetch enhanced timeline');
    }

    return response.json();
  }

  async listTimelines(page: number = 1, pageSize: number = 10): Promise<TimelineListResponse> {
    const response = await fetch(
      `${this.baseUrl}/timeline/list?page=${page}&page_size=${pageSize}`,
      {
        headers: this.getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to fetch timelines');
    }

    return response.json();
  }

  async deleteTimeline(timelineId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/timeline/${timelineId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to delete timeline');
    }
  }

  async exportTimelineAsCSV(timeline: TimelineResponse): Promise<string> {
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
    
    const csvRows = timeline.events.map(event => [
      event.date,
      `"${event.event_title.replace(/"/g, '""')}"`,
      `"${event.event_description.replace(/"/g, '""')}"`,
      `"${event.document_source.replace(/"/g, '""')}"`,
      `"${event.paragraph_reference.replace(/"/g, '""')}"`,
      `"${event.event_type.replace(/"/g, '""')}"`,
      event.confidence_score,
      `"${event.raw_text.replace(/"/g, '""')}"`
    ]);
    
    return [csvHeaders.join(','), ...csvRows.map(row => row.join(','))].join('\n');
  }

  async exportTimelineAsJSON(timeline: TimelineResponse): Promise<string> {
    const exportData = {
      ...timeline,
      export_date: new Date().toISOString(),
      export_format: 'json'
    };
    
    return JSON.stringify(exportData, null, 2);
  }

  async getTimelineDocuments(timelineId: string): Promise<TimelineDocument[]> {
    const response = await fetch(`${this.baseUrl}/timeline/${timelineId}/documents`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to fetch timeline documents');
    }

    const data = await response.json();
    
    // Handle the new response structure where documents are nested
    if (data.documents && Array.isArray(data.documents)) {
      return data.documents;
    }
    
    // Fallback: if the response is directly an array of documents
    if (Array.isArray(data)) {
      return data;
    }
    
    // If no documents found, return empty array
    return [];
  }

  async downloadDocument(documentId: string): Promise<Blob> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}/download`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to download document');
    }

    return response.blob();
  }

  async getDocumentUrl(documentId: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}/url`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to get document URL');
    }

    const data = await response.json();
    return data.url;
  }

  async deleteDocument(documentId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/documents/${documentId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.detail?.[0]?.msg || 'Failed to delete document');
    }
  }
}

// Export a default instance that can be used with the current auth context
export const createTimelineApi = (getAuthHeaders: () => Record<string, string>) => {
  return new TimelineApi(API_BASE_URL, getAuthHeaders);
}; 