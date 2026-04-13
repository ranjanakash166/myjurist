import { API_BASE_URL } from "../app/constants";
import { apiCallWithRefresh } from "./utils";

/** Fields shared by enhanced-search and enhanced-keyword-search request bodies */
export type LegalResearchSearchBase = {
  query: string;
  top_k: number;
  search_type: "general" | "supreme_court" | "high_court";
  summary_type?: "comprehensive" | "brief" | "detailed";
  max_summary_length?: number;
};

export interface LegalResearchRequest extends LegalResearchSearchBase {
  include_ai_summary?: boolean;
}

export interface SearchResult {
  content: string;
  source_file: string;
  title?: string;
  section_header?: string;
  similarity_score?: number;
  chunk_index?: number;
  // Legacy/document API identifier (may be absent with new enhanced-search)
  document_id?: string;
  // New fields from enhanced-search response for direct PDF access
  pdf_filename?: string;
  pdf_download_url?: string; // e.g. "high-court/2023/XYZ.pdf"
  year?: number;
  court_type?: string;
  /** Keyword / enhanced-keyword-search */
  rank?: number;
  chunk_id?: number;
  score?: number;
  content_preview?: string;
  index_name?: string;
}

/**
 * Resolves the value for POST /legal-research/document/pdf `document_id`.
 * Keyword search hits often omit a UUID; the PDF API expects a storage path like
 * `supreme-court/2014/2014_10_1_354_EN.pdf` (see downloadOriginalLegalDocumentPDF), not chunk_id.
 */
export function resolveLegalResearchPdfDocumentId(result: SearchResult): string {
  const doc = result.document_id?.trim();
  if (doc) return doc;
  const url = result.pdf_download_url?.trim();
  if (url) return url;
  const court = result.court_type?.trim();
  const year = result.year;
  const pdf = result.pdf_filename?.trim();
  if (court && year != null && pdf) {
    return `${court}/${year}/${pdf}`;
  }
  return "";
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
  summary_id?: string;
  user_query?: string;
  ai_summary: string;
  key_legal_insights?: string[];
  relevant_precedents?: string[];
  statutory_provisions?: string[];
  procedural_developments?: string[];
  practical_implications?: string[];
  legal_areas_covered?: string[];
  confidence_score?: number;
  sources_analyzed?: string[];
  processing_time_ms?: number | null;
  summary_type?: string;
  provider?: string;
  model?: string;
}

export interface LegalResearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  search_time_ms: number;
  index_stats?: IndexStats;
  ai_summary?: AISummaryResponse;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

function normalizeSearchResult(item: Record<string, unknown>): SearchResult {
  const preview = typeof item.content_preview === 'string' ? item.content_preview : undefined;
  const titleRaw = item.title;
  const titleFromPreview =
    preview
      ?.split('\n')
      .map((s) => s.trim())
      .find(Boolean)
      ?.slice(0, 120) ?? '';
  const title =
    typeof titleRaw === 'string' && titleRaw.trim()
      ? titleRaw
      : titleFromPreview || undefined;

  const apiDocumentId =
    typeof item.document_id === 'string' && item.document_id.trim() ? item.document_id.trim() : undefined;
  const pdf_download_url =
    typeof item.pdf_download_url === 'string' && item.pdf_download_url.trim()
      ? item.pdf_download_url.trim()
      : undefined;
  const pdf_filename =
    typeof item.pdf_filename === 'string' && item.pdf_filename.trim() ? item.pdf_filename.trim() : undefined;
  const court_type = typeof item.court_type === 'string' ? item.court_type : undefined;
  const year = typeof item.year === 'number' ? item.year : undefined;
  const pathFromMetadata =
    court_type && year != null && pdf_filename ? `${court_type}/${year}/${pdf_filename}` : undefined;
  const document_id = apiDocumentId ?? pdf_download_url ?? pathFromMetadata ?? undefined;

  return {
    content: String(item.content ?? ''),
    source_file: String(item.source_file ?? ''),
    title,
    section_header: typeof item.section_header === 'string' ? item.section_header : undefined,
    similarity_score: typeof item.similarity_score === 'number' ? item.similarity_score : undefined,
    chunk_index: typeof item.chunk_index === 'number' ? item.chunk_index : undefined,
    document_id,
    pdf_filename,
    pdf_download_url,
    year,
    court_type,
    rank: typeof item.rank === 'number' ? item.rank : undefined,
    chunk_id: typeof item.chunk_id === 'number' ? item.chunk_id : undefined,
    score: typeof item.score === 'number' ? item.score : undefined,
    content_preview: preview,
    index_name: typeof item.index_name === 'string' ? item.index_name : undefined,
  };
}

function normalizeLegalResearchResponse(data: unknown): LegalResearchResponse {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid search response');
  }
  const r = data as Record<string, unknown>;
  const rawResults = Array.isArray(r.results) ? r.results : [];
  return {
    query: String(r.query ?? ''),
    results: rawResults.map((row) => normalizeSearchResult(row as Record<string, unknown>)),
    total_results: Number(r.total_results ?? 0),
    search_time_ms: Number(r.search_time_ms ?? 0),
    ...(r.index_stats && typeof r.index_stats === 'object'
      ? { index_stats: r.index_stats as IndexStats }
      : {}),
    ...(r.ai_summary && typeof r.ai_summary === 'object'
      ? { ai_summary: r.ai_summary as AISummaryResponse }
      : {}),
  };
}

async function postLegalResearchSearch(
  pathSuffix: string,
  body: unknown,
  getAuthHeaders: () => Record<string, string>
): Promise<LegalResearchResponse> {
  const authHeaders = getAuthHeaders();

  const response = await fetch(`${API_BASE_URL}/${pathSuffix}`, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'Content-Type': 'application/json',
      ...authHeaders,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map((err) => err.msg).join(', ')}`);
      } catch {
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  try {
    const json: unknown = await response.json();
    return normalizeLegalResearchResponse(json);
  } catch (e) {
    if (e instanceof Error && e.message === 'Invalid search response') {
      throw e;
    }
    throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
  }
}

export const searchLegalResearch = async (
  request: LegalResearchRequest,
  _authToken: string,
  getAuthHeaders: () => Record<string, string>,
  _refreshToken: () => Promise<boolean>
): Promise<LegalResearchResponse> => {
  return postLegalResearchSearch('legal-research/enhanced-search', request, getAuthHeaders);
};

export const searchLegalResearchKeywordSearch = async (
  request: LegalResearchSearchBase,
  _authToken: string,
  getAuthHeaders: () => Record<string, string>,
  _refreshToken: () => Promise<boolean>
): Promise<LegalResearchResponse> => {
  const body = {
    query: request.query,
    top_k: request.top_k,
    search_type: request.search_type,
    summary_type: request.summary_type,
    max_summary_length: request.max_summary_length,
  };
  return postLegalResearchSearch('legal-research/enhanced-keyword-search', body, getAuthHeaders);
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
  const canTryPathFallback = request.document_id.includes('/') || request.document_id.toLowerCase().endsWith('.pdf');

  const tryPathFallback = async () => {
    if (!canTryPathFallback) return null;
    try {
      return await downloadOriginalLegalDocumentPDF(
        request.document_id,
        authToken,
        getAuthHeaders,
        refreshToken
      );
    } catch (fallbackError) {
      return null;
    }
  };

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
    if (
      response.status === 500 ||
      response.status === 502 ||
      response.status === 404 ||
      response.status === 400
    ) {
      const fallbackBlob = await tryPathFallback();
      if (fallbackBlob) return fallbackBlob;
    }

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
          if (
            retryResponse.status === 500 ||
            retryResponse.status === 502 ||
            retryResponse.status === 404 ||
            retryResponse.status === 400
          ) {
            const fallbackBlob = await tryPathFallback();
            if (fallbackBlob) return fallbackBlob;
          }
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
  // Use the new GET /pdf/{path} endpoint
  // documentId format: {court_type}/{year}/{filename}
  // Example: "supreme-court/2018/2018_1_937_1006_EN.pdf"
  const authHeaders = getAuthHeaders();
  
  // Use the /pdf/{path} endpoint as documented
  // documentId format: {court_type}/{year}/{filename}
  // Encode each path segment to handle any special characters
  const pathSegments = documentId.split('/').map(segment => encodeURIComponent(segment));
  const encodedPath = pathSegments.join('/');
  
  // Try the direct /pdf endpoint first (as per API documentation)
  let response = await fetch(`${API_BASE_URL}/pdf/${encodedPath}`, {
    method: 'GET',
    headers: {
      'accept': 'application/pdf',
      ...authHeaders,
    },
  });
  
  // If 404, try the legal-research endpoint as fallback
  if (response.status === 404) {
    response = await fetch(`${API_BASE_URL}/legal-research/pdf/${encodedPath}`, {
      method: 'GET',
      headers: {
        'accept': 'application/pdf',
        ...authHeaders,
      },
    });
  }

  if (!response.ok) {
    if (response.status === 401) {
      // Try to refresh token and retry
      const refreshSuccess = await refreshToken();
      if (refreshSuccess) {
        const newAuthHeaders = getAuthHeaders();
        const retryPathSegments = documentId.split('/').map(segment => encodeURIComponent(segment));
        const retryEncodedPath = retryPathSegments.join('/');
        
        // Try direct /pdf endpoint first
        let retryResponse = await fetch(`${API_BASE_URL}/pdf/${retryEncodedPath}`, {
          method: 'GET',
          headers: {
            'accept': 'application/pdf',
            ...newAuthHeaders,
          },
        });
        
        // If 404, try legal-research endpoint as fallback
        if (retryResponse.status === 404) {
          retryResponse = await fetch(`${API_BASE_URL}/legal-research/pdf/${retryEncodedPath}`, {
            method: 'GET',
            headers: {
              'accept': 'application/pdf',
              ...newAuthHeaders,
            },
          });
        }
        
        if (!retryResponse.ok) {
          const errorText = await retryResponse.text().catch(() => '');
          throw new Error(`HTTP error! status: ${retryResponse.status}. URL: ${API_BASE_URL}/pdf/${retryEncodedPath}. Error: ${errorText}`);
        }
        
        return await retryResponse.blob();
      } else {
        throw new Error('Authentication failed. Please log in again.');
      }
    }
    if (response.status === 404) {
      const errorText = await response.text().catch(() => '');
      const attemptedUrl = response.url || `${API_BASE_URL}/pdf/${encodedPath}`;
      throw new Error(`PDF not found (404). Document ID: ${documentId}. Attempted URL: ${attemptedUrl}. Error: ${errorText}`);
    }
    if (response.status === 422) {
      try {
        const errorData: ValidationError = await response.json();
        throw new Error(`Validation error: ${errorData.detail.map(err => err.msg).join(', ')}`);
      } catch (jsonError) {
        throw new Error(`Validation error: ${response.status} ${response.statusText}`);
      }
    }
    const errorText = await response.text().catch(() => '');
    throw new Error(`HTTP error! status: ${response.status}. Error: ${errorText}`);
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
  search_type: "general" | "supreme_court" | "high_court";
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