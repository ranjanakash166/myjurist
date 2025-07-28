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

  async listTimelines(skip: number = 0, limit: number = 10): Promise<{
    timelines: TimelineResponse[];
    total: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/timeline?skip=${skip}&limit=${limit}`,
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
}

// Export a default instance that can be used with the current auth context
export const createTimelineApi = (getAuthHeaders: () => Record<string, string>) => {
  return new TimelineApi(API_BASE_URL, getAuthHeaders);
}; 