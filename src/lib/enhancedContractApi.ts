import { API_BASE_URL } from "../app/constants";

// Enhanced Contract Interfaces
export interface ContractCategory {
  id: string;
  name: string;
  description: string;
  template_count: number;
  templates: ContractTemplate[];
}

export interface ContractTemplate {
  id: string;
  name: string;
  filename: string;
  description: string;
  template_file: string;
  type?: string;
  required_fields?: ContractField[];
  optional_fields?: ContractField[];
  jurisdiction?: string;
  governing_law?: string;
  created_at?: string;
}

export interface ContractField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'number';
  required: boolean;
  description: string;
  placeholder?: string;
  options?: string[];
}

export interface ContractValidationRequest {
  template_id: string;
  input_data: Record<string, any>;
}

export interface ContractValidationResponse {
  is_valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ContractDraftRequest {
  template_id: string;
  title: string;
  description: string;
  input_data: Record<string, any>;
  enhance_with_ai?: boolean;
}

export interface ContractDraftResponse {
  contract_id: string;
  template_type: string;
  title: string;
  description: string;
  input_data: Record<string, any>;
  generated_content: string;
  status: string;
  ai_provider_used?: string;
  processing_time_ms?: number;
  created_at: string;
  updated_at: string;
}

export class EnhancedContractApi {
  private baseUrl: string;
  private getAuthHeaders: () => Record<string, string>;
  private authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>;

  constructor(
    baseUrl: string, 
    getAuthHeaders: () => Record<string, string>,
    authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>
  ) {
    this.baseUrl = baseUrl;
    this.getAuthHeaders = getAuthHeaders;
    this.authenticatedFetch = authenticatedFetch;
  }

  // Template Management Endpoints

  // Get all contract categories
  async getCategories(): Promise<ContractCategory[]> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/categories`;
      console.log('Fetching categories from:', url);
      
      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Categories data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching contract categories:', error);
      throw error;
    }
  }

  // Get templates for a specific category
  async getTemplatesByCategory(category: string): Promise<ContractTemplate[]> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/templates?category=${category}`;
      console.log('Fetching templates for category:', category, 'from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch templates for category ${category}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Templates data received:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching templates for category ${category}:`, error);
      throw error;
    }
  }

  // Get all templates
  async getAllTemplates(): Promise<ContractTemplate[]> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/templates/all`;
      console.log('Fetching all templates from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch all templates: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('All templates data received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching all templates:', error);
      throw error;
    }
  }

  // Get specific template details
  async getTemplateDetails(templateId: string): Promise<ContractTemplate> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/templates/${templateId}`;
      console.log('Fetching template details for:', templateId, 'from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch template details for ${templateId}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Template details received:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching template details for ${templateId}:`, error);
      throw error;
    }
  }

  // Search templates
  async searchTemplates(query: string): Promise<ContractTemplate[]> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/search?query=${encodeURIComponent(query)}`;
      console.log('Searching templates with query:', query, 'from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to search templates: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Search results received:', data);
      return data;
    } catch (error) {
      console.error('Error searching templates:', error);
      throw error;
    }
  }

  // Contract Generation Endpoints

  // Validate contract inputs
  async validateContractInputs(request: ContractValidationRequest): Promise<ContractValidationResponse> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/validate`;
      console.log('Validating contract inputs:', request, 'at:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to validate contract inputs: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Validation response received:', data);
      return data;
    } catch (error) {
      console.error('Error validating contract inputs:', error);
      throw error;
    }
  }

  // Generate contract draft
  async generateContract(request: ContractDraftRequest): Promise<ContractDraftResponse> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/draft`;
      console.log('Generating contract draft:', request, 'at:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate contract: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Contract generated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  }

  // Contract Management Endpoints

  // Get all contract drafts
  async getContractDrafts(page: number = 1, pageSize: number = 10): Promise<{
    drafts: ContractDraftResponse[];
    total_count: number;
    page: number;
    page_size: number;
  }> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/drafts?page=${page}&page_size=${pageSize}`;
      console.log('Fetching contract drafts from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch contract drafts: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Contract drafts received:', data);
      return data;
    } catch (error) {
      console.error('Error fetching contract drafts:', error);
      throw error;
    }
  }

  // Get specific contract draft
  async getContractDraft(contractId: string): Promise<ContractDraftResponse> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/drafts/${contractId}`;
      console.log('Fetching contract draft:', contractId, 'from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch contract draft ${contractId}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Contract draft received:', data);
      return data;
    } catch (error) {
      console.error(`Error fetching contract draft ${contractId}:`, error);
      throw error;
    }
  }

  // Delete contract draft
  async deleteContractDraft(contractId: string): Promise<{ message: string }> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/drafts/${contractId}`;
      console.log('Deleting contract draft:', contractId, 'at:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to delete contract draft ${contractId}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Contract draft deleted successfully:', data);
      return data;
    } catch (error) {
      console.error(`Error deleting contract draft ${contractId}:`, error);
      throw error;
    }
  }

  // Download Endpoints

  // Download contract as PDF
  async downloadContractPDF(contractId: string): Promise<Blob> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/drafts/${contractId}/download/pdf`;
      console.log('Downloading contract as PDF:', contractId, 'from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to download contract PDF ${contractId}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('PDF downloaded successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error(`Error downloading contract PDF ${contractId}:`, error);
      throw error;
    }
  }

  // Download contract as Word document
  async downloadContractWord(contractId: string): Promise<Blob> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/drafts/${contractId}/download/word`;
      console.log('Downloading contract as Word:', contractId, 'from:', url);

      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to download contract Word ${contractId}: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      console.log('Word document downloaded successfully, size:', blob.size);
      return blob;
    } catch (error) {
      console.error(`Error downloading contract Word ${contractId}:`, error);
      throw error;
    }
  }

  // Legacy methods for backward compatibility
  async getContractHistory(page: number = 1, pageSize: number = 10) {
    return this.getContractDrafts(page, pageSize);
  }

  async getContract(contractId: string) {
    return this.getContractDraft(contractId);
  }

  async deleteContract(contractId: string) {
    return this.deleteContractDraft(contractId);
  }

  async downloadContract(contractId: string, format: 'pdf' | 'docx' = 'pdf') {
    if (format === 'pdf') {
      return this.downloadContractPDF(contractId);
    } else {
      return this.downloadContractWord(contractId);
    }
  }
}

// Factory function to create EnhancedContractApi instance
export const createEnhancedContractApi = (
  getAuthHeaders: () => Record<string, string>,
  authenticatedFetch: (url: string, options?: RequestInit) => Promise<Response>
) => {
  return new EnhancedContractApi(API_BASE_URL, getAuthHeaders, authenticatedFetch);
};