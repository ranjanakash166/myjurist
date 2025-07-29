import { API_BASE_URL } from "../app/constants";

// Contract Template Interfaces
export interface ContractField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date';
  required: boolean;
  description: string;
  options?: string[] | null;
  placeholder?: string;
  validation?: any;
}

export interface ContractTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  required_fields: ContractField[];
  optional_fields: ContractField[];
  jurisdiction: string;
  governing_law: string;
  created_at: string;
}

export interface ContractTemplateListResponse {
  templates: ContractTemplate[];
}

// Contract Draft Interfaces
export interface ContractDraftRequest {
  template_type: string;
  title: string;
  description: string;
  input_data: Record<string, any>;
  jurisdiction: string;
  governing_law: string;
  enhance_with_ai: boolean;
}

export interface ContractDraftResponse {
  contract_id: string;
  template_type: string;
  title: string;
  description: string;
  input_data: Record<string, any>;
  generated_content: string;
  status: string;
  ai_provider_used: string;
  processing_time_ms: number;
  created_at: string;
  updated_at: string;
}

export class ContractApi {
  private baseUrl: string;
  private getAuthHeaders: () => Record<string, string>;

  constructor(baseUrl: string, getAuthHeaders: () => Record<string, string>) {
    this.baseUrl = baseUrl;
    this.getAuthHeaders = getAuthHeaders;
  }

  // Get all available contract templates
  async getTemplates(): Promise<ContractTemplate[]> {
    try {
      const response = await fetch(`${this.baseUrl}/contracts/templates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch templates: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contract templates:', error);
      throw error;
    }
  }

  // Get specific contract template by type
  async getTemplateByType(templateType: string): Promise<ContractTemplate> {
    try {
      const response = await fetch(`${this.baseUrl}/contracts/templates/${templateType}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch template ${templateType}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching contract template ${templateType}:`, error);
      throw error;
    }
  }

  // Generate a new contract draft
  async generateContractDraft(request: ContractDraftRequest): Promise<ContractDraftResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/contracts/draft`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate contract draft: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating contract draft:', error);
      throw error;
    }
  }

  // Get contract draft by ID (for future use)
  async getContractDraft(contractId: string): Promise<ContractDraftResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/contracts/draft/${contractId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contract draft: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contract draft:', error);
      throw error;
    }
  }

  // List contract drafts (for future use)
  async listContractDrafts(page: number = 1, pageSize: number = 10): Promise<{
    contracts: ContractDraftResponse[];
    total_count: number;
    page: number;
    page_size: number;
  }> {
    try {
      const response = await fetch(`${this.baseUrl}/contracts/draft?page=${page}&page_size=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch contract drafts: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching contract drafts:', error);
      throw error;
    }
  }
}

// Factory function to create ContractApi instance
export const createContractApi = (getAuthHeaders: () => Record<string, string>) => {
  return new ContractApi(API_BASE_URL, getAuthHeaders);
}; 