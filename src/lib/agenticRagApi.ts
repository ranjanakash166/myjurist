import { API_BASE_URL } from "../app/constants";
import { apiCallWithRefresh } from "./utils";

export interface AgenticRAGSearchRequest {
  query: string;              // Required: 3-1000 characters
  top_k?: number;             // Optional: 1-50, default: 10
  include_metadata?: boolean; // Optional: default: true
}

export interface SearchResult {
  content: string;                  // Result content/text
  source_file: string;              // Source file/document name
  title: string;                    // Document title
  section_header: string;           // Section header (if applicable)
  similarity_score: number;        // Relevance score: 0.0 - 1.0
  chunk_index: number;              // Chunk index in document
  metadata?: {                      // Optional metadata
    url?: string;                   // URL (for regulatory results)
    domain?: string;                // Domain (for regulatory results)
    [key: string]: any;             // Additional metadata
  };
}

export interface RoutingMetadata {
  query_type: string;
  rag_variant: string;
  confidence: number;
  variant_description: string;
}

export interface AgenticRAGSearchResponse {
  query: string;                    // Original query
  query_type: string;               // Classification: "legal_case_search" | "patent_query" | "regulatory_query" | "financial_legal" | "general_legal"
  rag_variant: string;              // Selected variant: "legal_documents" | "patent_search" | "regulatory_compliance" | "financial_irregularities" | "general_legal"
  confidence: number;               // Confidence score: 0.0 - 1.0
  results: SearchResult[];          // Array of search results
  total_results: number;            // Total number of results
  processing_time_ms: number;       // Processing time in milliseconds
  routing_metadata?: RoutingMetadata; // Optional routing information
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

export interface AuthenticationError {
  detail: string;
  type: string;
  login_url?: string;
  register_url?: string;
}

export const searchAgenticRAG = async (
  request: AgenticRAGSearchRequest,
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
): Promise<AgenticRAGSearchResponse> => {
  // Use apiCallWithRefresh for automatic token refresh handling
  const response = await apiCallWithRefresh(
    `${API_BASE_URL}/agentic-rag/search`,
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
    // Try to parse error response
    let errorData: any;
    try {
      errorData = await response.json();
    } catch (jsonError) {
      // If JSON parsing fails, throw generic error
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403 || errorData?.type === 'AuthenticationError') {
      const authError = errorData as AuthenticationError;
      throw new Error(authError.detail || 'Authentication required. Please log in again.');
    }

    // Handle validation errors
    if (response.status === 422) {
      const validationError = errorData as ValidationError;
      if (Array.isArray(validationError.detail)) {
        throw new Error(`Validation error: ${validationError.detail.map(err => err.msg).join(', ')}`);
      }
      throw new Error(`Validation error: ${validationError.detail || response.statusText}`);
    }

    // Handle other errors
    throw new Error(errorData?.detail || `HTTP error! status: ${response.status}`);
  }

  try {
    return await response.json();
  } catch (jsonError) {
    throw new Error(`Failed to parse response as JSON: ${response.status} ${response.statusText}`);
  }
};

