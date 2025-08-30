import { API_BASE_URL } from "../app/constants";
import { apiCallWithRefresh } from "./utils";

export interface LegalResearchRequest {
  query: string;
  top_k: number;
  search_type: "general" | "specific";
  include_ai_summary?: boolean;
  summary_type?: "comprehensive" | "brief" | "detailed";
  max_summary_length?: number;
}

export interface SearchResult {
  content: string;
  source_file: string;
  title: string;
  section_header: string;
  similarity_score: number;
  chunk_index: number;
  document_id: string;
}

export interface IndexStats {
  total_chunks: number;
  files_indexed: number;
  model_name: string;
  embedding_dimension: number;
  index_size: number;
  chunks_per_file: Record<string, number>;
}

export interface AISummaryResponse {
  summary_id: string;
  user_query: string;
  ai_summary: string;
  key_legal_insights: string[];
  relevant_precedents: string[];
  legal_areas_covered: string[];
  confidence_score: number;
  sources_analyzed: string[];
  processing_time_ms: number;
  summary_type: string;
}

export interface LegalResearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  search_time_ms: number;
  index_stats: IndexStats;
  ai_summary?: AISummaryResponse;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export const searchLegalResearch = async (
  request: LegalResearchRequest,
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<LegalResearchResponse> => {
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/legal-research/enhanced-search`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
    getAuthHeaders,
    refreshToken
  );

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: ValidationError = await response.json();
      throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export interface DocumentResponse {
  source_file: string;
  title: string;
  full_content: string;
  content_length: number;
  retrieval_time_ms: number;
}

export interface DownloadPDFRequest {
  document_id: string;
  include_header?: boolean;
  font_size?: number;
}

export const getLegalDocument = async (
  documentId: string,
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<DocumentResponse> => {
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/legal-research/document`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ document_id: documentId }),
    },
    getAuthHeaders,
    refreshToken
  );

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: ValidationError = await response.json();
      throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const downloadLegalDocumentPDF = async (
  request: DownloadPDFRequest,
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<Blob> => {
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/legal-research/document/pdf`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    },
    getAuthHeaders,
    refreshToken
  );

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: ValidationError = await response.json();
      throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.blob();
};

// Legal Research History interfaces
export interface LegalResearchHistoryItem {
  research_id: string;
  query: string;
  search_type: "general" | "specific";
  top_k: number;
  total_results: number;
  search_time_ms: number | null;
  ai_summary_id: string | null;
  summary_type: "comprehensive" | "brief" | "detailed" | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  search_results: SearchResult[];
  ai_summary?: AISummaryResponse;
}

export interface LegalResearchHistoryParams {
  limit?: number;
  offset?: number;
}

export const getLegalResearchHistory = async (
  params: LegalResearchHistoryParams = {},
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<LegalResearchHistoryItem[]> => {
  const searchParams = new URLSearchParams();
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());

  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/legal-research/history?${searchParams.toString()}`,
    {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      },
    },
    getAuthHeaders,
    refreshToken
  );

  if (!response.ok) {
    if (response.status === 422) {
      const errorData: ValidationError = await response.json();
      throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}; 