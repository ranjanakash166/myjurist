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
  // Use direct fetch to avoid apiCallWithRefresh issues
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/legal-research/enhanced-search`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
      } catch (jsonError) {
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
  }
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

export interface DownloadDOCRequest {
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
  // Use direct fetch to avoid apiCallWithRefresh issues
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/legal-research/document`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({ document_id: documentId }),
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
      } catch (jsonError) {
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
  }
};

export const downloadLegalDocumentPDF = async (
  request: DownloadPDFRequest,
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<Blob> => {
  // Use direct fetch for binary PDF downloads to avoid JSON parsing issues
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/legal-research/document/pdf`, {
    method: 'POST',
    headers: {
      'accept': 'application/pdf',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
      } catch (jsonError) {
        // If JSON parsing fails, it might be a PDF response with wrong content type
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    if (response.status === 401) {
      // Try to refresh token and retry
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        const newAuthHeaders = getAuthHeaders();
        const retryResponse = await fetch(`${API_BASE_URL}/legal-research/document/pdf`, {
          method: 'POST',
          headers: {
            'accept': 'application/pdf',
            'Content-Type': 'application/json',
            ...newAuthHeaders,
          },
          body: JSON.stringify(request),
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return await retryResponse.blob();
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // The backend returns binary PDF data directly
  return await response.blob();
};

export const downloadOriginalLegalDocumentPDF = async (
  documentId: string,
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<Blob> => {
  // Try different endpoint patterns for downloading original PDF
  const authHeaders = getAuthHeaders();
  
  // Try the document endpoint with PDF accept header first
  const response = await fetch(`${API_BASE_URL}/legal-research/document`, {
    method: 'POST',
    headers: {
      'accept': 'application/pdf',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify({ document_id: documentId }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Try to refresh token and retry
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        const newAuthHeaders = getAuthHeaders();
        const retryResponse = await fetch(`${API_BASE_URL}/legal-research/document`, {
          method: 'POST',
          headers: {
            'accept': 'application/pdf',
            'Content-Type': 'application/json',
            ...newAuthHeaders,
          },
          body: JSON.stringify({ document_id: documentId }),
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return await retryResponse.blob();
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // Return the original PDF file
  return await response.blob();
};

export const downloadLegalDocumentDOC = async (
  request: DownloadDOCRequest,
  authToken: string,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<Blob> => {
  // Use direct fetch for binary DOC downloads to avoid JSON parsing issues
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/legal-research/document`, {
    method: 'POST',
    headers: {
      'accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
      } catch (jsonError) {
        // If JSON parsing fails, it might be a DOC response with wrong content type
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    if (response.status === 401) {
      // Try to refresh token and retry
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        const newAuthHeaders = getAuthHeaders();
        const retryResponse = await fetch(`${API_BASE_URL}/legal-research/document`, {
          method: 'POST',
          headers: {
            'accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Type': 'application/json',
            ...newAuthHeaders,
          },
          body: JSON.stringify(request),
        });
        
        if (!retryResponse.ok) {
          throw new Error(`HTTP error! status: ${retryResponse.status}`);
        }
        
        return await retryResponse.blob();
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  // The backend returns binary DOC data directly
  return await response.blob();
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

  // Use direct fetch to avoid apiCallWithRefresh issues
  const authHeaders = getAuthHeaders();
  
  const response = await fetch(`${API_BASE_URL}/legal-research/history?${searchParams.toString()}`, {
    method: 'GET',
    headers: {
      'accept': 'application/json',
      ...authHeaders,
    },
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
      } catch (jsonError) {
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
  }
}; 