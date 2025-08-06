import { API_BASE_URL } from "../app/constants";

export interface LegalResearchRequest {
  query: string;
  top_k: number;
  search_type: "general" | "specific";
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

export interface LegalResearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  search_time_ms: number;
  index_stats: IndexStats;
}

// New interfaces for AI Summary feature
export interface AISummaryRequest {
  user_query: string;
  search_results: SearchResult[];
  summary_type: "comprehensive" | "brief" | "detailed";
  include_legal_insights: boolean;
  include_precedents: boolean;
  max_length: number;
  focus_areas?: string[];
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

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export const searchLegalResearch = async (
  request: LegalResearchRequest,
  authToken: string
): Promise<LegalResearchResponse> => {
  const response = await fetch(`${API_BASE_URL}/legal-research/search`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

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

// New function for AI Summary generation
export const generateAISummary = async (
  request: AISummaryRequest,
  authToken: string
): Promise<AISummaryResponse> => {
  const response = await fetch(`${API_BASE_URL}/legal-research/ai-summary`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

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

export const getLegalDocument = async (
  documentId: string,
  authToken: string
): Promise<DocumentResponse> => {
  const response = await fetch(`${API_BASE_URL}/legal-research/document`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ document_id: documentId }),
  });

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