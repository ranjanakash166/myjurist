import { API_BASE_URL } from "../app/constants";
import { throwPublicHttpError } from "./apiClientErrors";

export interface CategoryAssignment {
  category: string;
  confidence: number;
  reasoning: string;
}

export interface CategorizationResult {
  filename: string;
  assigned_categories: CategoryAssignment[];
  processing_status: string;
  error_message: string | null;
}

export interface CategorizationSummary {
  [category: string]: number;
}

export interface DocumentCategorizationResponse {
  request_id: string;
  total_documents: number;
  generated_categories: string[] | null;
  categorization_results: CategorizationResult[];
  summary: CategorizationSummary;
}

export interface CategorizationRequest {
  files: File[];
  categories?: string[];
  multi_label?: boolean;
  confidence_threshold?: number;
}

export class DocumentCategorizationApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/document-categorization`;
  }

  async categorizeDocuments(
    request: CategorizationRequest,
    authToken: string
  ): Promise<DocumentCategorizationResponse> {
    const formData = new FormData();
    
    // Add files
    request.files.forEach((file) => {
      formData.append('files', file);
    });

    // Add optional parameters
    if (request.categories && request.categories.length > 0) {
      formData.append('categories', request.categories.join(','));
    }
    
    if (request.multi_label !== undefined) {
      formData.append('multi_label', request.multi_label.toString());
    }
    
    if (request.confidence_threshold !== undefined) {
      formData.append('confidence_threshold', request.confidence_threshold.toString());
    }

    const response = await fetch(`${this.baseUrl}/categorize`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError('POST /document-categorization/categorize', response.status, errorText, {
        default: 'Could not categorize your documents. Please try again.',
      });
    }

    return response.json();
  }

  async getCategorizationHistory(
    authToken: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    categorizations: Array<{
      request_id: string;
      total_documents: number;
      created_at: string;
      status: string;
    }>;
    total: number;
    page: number;
    limit: number;
  }> {
    const response = await fetch(
      `${this.baseUrl}/history?page=${page}&limit=${limit}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError('GET /document-categorization/history', response.status, errorText, {
        default: 'Could not load categorization history. Please try again.',
      });
    }

    return response.json();
  }

  async getCategorizationResult(
    requestId: string,
    authToken: string
  ): Promise<DocumentCategorizationResponse> {
    const response = await fetch(`${this.baseUrl}/result/${requestId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throwPublicHttpError(
        `GET /document-categorization/result/${requestId}`,
        response.status,
        errorText,
        { default: 'Could not load this categorization result. Please try again.' }
      );
    }

    return response.json();
  }
}

export default new DocumentCategorizationApi();
