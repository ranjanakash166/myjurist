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
  input_data?: Record<string, any>;
  generated_content?: string;
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
      const response = await this.authenticatedFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch categories: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
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
      
      // Handle both array response and object response formats
      if (Array.isArray(data)) {
        return {
          drafts: data,
          total_count: data.length,
          page: page,
          page_size: pageSize
        };
      }
      
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

  async updateContract(
    contractId: string, 
    content?: string, 
    title?: string, 
    description?: string
  ): Promise<ContractDraftResponse> {
    try {
      const url = `${this.baseUrl}/enhanced-contracts/drafts/${contractId}`;
      
      // Build request body with only provided fields
      const requestBody: {
        generated_content?: string;
        title?: string;
        description?: string;
      } = {};
      
      if (content !== undefined) {
        requestBody.generated_content = content;
      }
      if (title !== undefined) {
        requestBody.title = title;
      }
      if (description !== undefined) {
        requestBody.description = description;
      }

      console.log('🔄 Updating contract:', {
        url,
        method: 'PUT',
        contractId,
        requestBody
      });

      const response = await this.authenticatedFetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Update response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Update failed:', errorText);
        throw new Error(`Failed to update contract: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Contract updated successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Update contract error:', error);
      throw error;
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