import { API_BASE_URL } from "../app/constants";
import { throwPublicHttpError } from "./apiClientErrors";

// Types for regulatory compliance
export interface RegulatorySuggestionRequest {
  partial_query: string;
}

export interface RegulatorySuggestionResponse {
  suggestions: string[];
}

export interface RegulatoryQueryRequest {
  query: string;
  search_provider: string;
}

export interface RegulatorySource {
  title: string;
  url: string;
  domain: string;
  relevance: string;
}

export interface RegulatoryAmendment {
  source: string;
  title: string;
  snippet: string;
}

export interface RegulatoryQueryResponse {
  query_id: string;
  answer: string;
  confidence_score: number;
  sources: RegulatorySource[];
  related_sections: string[];
  amendments_found: RegulatoryAmendment[];
  processing_time_ms: number;
  search_provider: string;
  }

// Fetch regulatory compliance suggestions
export async function fetchRegulatorySuggestions(
  authHeaders: Record<string, string>,
  partialQuery: string
): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/regulatory-compliance/suggestions`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({
        partial_query: partialQuery,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError('POST /regulatory-compliance/suggestions', response.status, errorText, {
        default: 'Could not load regulatory suggestions. Please try again.',
      });
    }

    const data = await response.json();
    return data; // API returns array of strings directly
  } catch (error) {
    console.error('Error fetching regulatory suggestions:', error);
    throw error;
  }
}

// Submit regulatory compliance query
export async function submitRegulatoryQuery(
  authHeaders: Record<string, string>,
  query: string,
  searchProvider: string = 'duckduckgo'
): Promise<RegulatoryQueryResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/regulatory-compliance/query`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({
        query: query,
        search_provider: searchProvider,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError('POST /regulatory-compliance/query', response.status, errorText, {
        default: 'Could not run this regulatory search. Please try again.',
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting regulatory query:', error);
    throw error;
  }
} 