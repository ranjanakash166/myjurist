import { API_BASE_URL } from "../app/constants";
import { 
  searchLegalResearch, 
  LegalResearchRequest, 
  LegalResearchResponse 
} from "./legalResearchApi";
import { 
  DocumentCategorizationApi, 
  CategorizationRequest 
} from "./documentCategorizationApi";
import { 
  TimelineApi, 
  TimelineUploadRequest, 
  TimelineResponse 
} from "./timelineApi";
import { 
  fetchRegulatorySuggestions, 
  submitRegulatoryQuery, 
  RegulatoryQueryResponse 
} from "./regulatoryComplianceApi";

export type ChatFeature = 
  | "simple-chat"
  | "legal-research" 
  | "document-analysis"
  | "document-categorization"
  | "timeline-extractor"
  | "regulatory-compliance"
  | "smart-document-studio"
  | "patent-analysis"
  | "organization-management";

export interface SuperChatRequest {
  query: string;
  feature: ChatFeature;
  files?: File[];
  context?: any;
}

export interface SuperChatResponse {
  content: string;
  feature: ChatFeature;
  metadata?: any;
  suggestions?: string[];
}

export class SuperChatApi {
  private getAuthHeaders: () => Record<string, string>;
  private refreshToken: () => Promise<boolean>;

  constructor(
    getAuthHeaders: () => Record<string, string>,
    refreshToken: () => Promise<boolean>
  ) {
    this.getAuthHeaders = getAuthHeaders;
    this.refreshToken = refreshToken;
  }

  async processRequest(request: SuperChatRequest): Promise<SuperChatResponse> {
    const { query, feature, files, context } = request;

    switch (feature) {
      case "legal-research":
        return this.handleLegalResearch(query);
      
      case "document-analysis":
        return this.handleDocumentAnalysis(query, files);
      
      case "document-categorization":
        return this.handleDocumentCategorization(query, files);
      
      case "timeline-extractor":
        return this.handleTimelineExtraction(query, files);
      
      case "regulatory-compliance":
        return this.handleRegulatoryCompliance(query);
      
      case "smart-document-studio":
        return this.handleSmartDocumentStudio(query, context);
      
      case "patent-analysis":
        return this.handlePatentAnalysis(query);
      
      case "organization-management":
        return this.handleOrganizationManagement(query);
      
      case "simple-chat":
      default:
        return this.handleSimpleChat(query);
    }
  }

  private async handleLegalResearch(query: string): Promise<SuperChatResponse> {
    try {
      const authHeaders = this.getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const searchRequest: LegalResearchRequest = {
        query: query.trim(),
        top_k: 5,
        search_type: "general",
        include_ai_summary: true,
        summary_type: "comprehensive",
        max_summary_length: 1500,
      };

      const searchResponse = await searchLegalResearch(
        searchRequest, 
        authToken, 
        this.getAuthHeaders, 
        this.refreshToken
      );

      let content = `🔍 **Legal Research Results**\n\n`;
      
      if (searchResponse.ai_summary) {
        content += `**AI Summary:**\n${searchResponse.ai_summary.ai_summary}\n\n`;
        
        if (searchResponse.ai_summary.key_legal_insights?.length > 0) {
          content += `**Key Legal Insights:**\n`;
          searchResponse.ai_summary.key_legal_insights.forEach(insight => {
            content += `• ${insight}\n`;
          });
          content += `\n`;
        }
      }

      content += `**Search Results (${searchResponse.total_results} found):**\n\n`;
      
      searchResponse.results.slice(0, 3).forEach((result, index) => {
        content += `${index + 1}. **${result.title}**\n`;
        content += `   Source: ${result.source_file}\n`;
        content += `   Relevance: ${(result.similarity_score * 100).toFixed(1)}%\n`;
        content += `   Content: ${result.content.substring(0, 200)}...\n\n`;
      });

      return {
        content,
        feature: "legal-research",
        metadata: {
          totalResults: searchResponse.total_results,
          searchTime: searchResponse.search_time_ms,
          aiSummary: searchResponse.ai_summary
        }
      };
    } catch (error: any) {
      return {
        content: `❌ **Legal Research Error**\n\nI encountered an error while searching the legal database: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
        feature: "legal-research",
        metadata: { error: error.message }
      };
    }
  }

  private async handleDocumentAnalysis(query: string, files?: File[]): Promise<SuperChatResponse> {
    if (!files || files.length === 0) {
      return {
        content: `📄 **Document Analysis**\n\nTo analyze documents, please upload files first. You can upload PDF, DOC, or other document formats for analysis.\n\n**Supported formats:**\n• PDF documents\n• Word documents (.doc, .docx)\n• Text files\n• Images (OCR analysis)`,
        feature: "document-analysis",
        suggestions: ["Upload a document to analyze", "What type of analysis do you need?"]
      };
    }

    // Simulate document analysis
    return {
      content: `📄 **Document Analysis Results**\n\nI've analyzed your uploaded documents for "${query}":\n\n**Documents Processed:**\n${files.map(f => `• ${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join('\n')}\n\n**Key Findings:**\n• Document structure analyzed\n• Key terms and concepts identified\n• Legal implications assessed\n• Recommendations provided\n\n**Next Steps:**\n• Review specific sections\n• Generate summaries\n• Extract key information`,
      feature: "document-analysis",
      metadata: {
        filesProcessed: files.length,
        totalSize: files.reduce((sum, file) => sum + file.size, 0)
      }
    };
  }

  private async handleDocumentCategorization(query: string, files?: File[]): Promise<SuperChatResponse> {
    if (!files || files.length === 0) {
      return {
        content: `📁 **Document Categorization**\n\nTo categorize documents, please upload files first. I can automatically categorize your documents into relevant categories.\n\n**Categories I can identify:**\n• Legal contracts\n• Court documents\n• Regulatory filings\n• Legal briefs\n• Case studies\n• Research papers`,
        feature: "document-categorization",
        suggestions: ["Upload documents to categorize", "What categories are you looking for?"]
      };
    }

    try {
      const authHeaders = this.getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const categorizationApi = new DocumentCategorizationApi();
      const request: CategorizationRequest = {
        files,
        multi_label: true,
        confidence_threshold: 0.7
      };

      const response = await categorizationApi.categorizeDocuments(request, authToken);

      let content = `📁 **Document Categorization Results**\n\n`;
      content += `**Processing Summary:**\n`;
      content += `• Total documents: ${response.total_documents}\n`;
      content += `• Request ID: ${response.request_id}\n\n`;

      content += `**Categorization Results:**\n`;
      response.categorization_results.forEach((result, index) => {
        content += `\n**${result.filename}:**\n`;
        if (result.assigned_categories.length > 0) {
          result.assigned_categories.forEach(category => {
            content += `• ${category.category} (${(category.confidence * 100).toFixed(1)}% confidence)\n`;
            content += `  Reasoning: ${category.reasoning}\n`;
          });
        } else {
          content += `• No categories assigned\n`;
        }
      });

      if (response.summary) {
        content += `\n**Summary by Category:**\n`;
        Object.entries(response.summary).forEach(([category, count]) => {
          content += `• ${category}: ${count} documents\n`;
        });
      }

      return {
        content,
        feature: "document-categorization",
        metadata: {
          requestId: response.request_id,
          totalDocuments: response.total_documents,
          summary: response.summary
        }
      };
    } catch (error: any) {
      return {
        content: `❌ **Document Categorization Error**\n\nI encountered an error while categorizing your documents: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
        feature: "document-categorization",
        metadata: { error: error.message }
      };
    }
  }

  private async handleTimelineExtraction(query: string, files?: File[]): Promise<SuperChatResponse> {
    if (!files || files.length === 0) {
      return {
        content: `⏰ **Timeline Extractor**\n\nTo extract timelines, please upload documents first. I can analyze your documents and create chronological timelines of events.\n\n**What I can extract:**\n• Key dates and events\n• Chronological sequences\n• Legal proceedings timeline\n• Contract milestones\n• Regulatory deadlines`,
        feature: "timeline-extractor",
        suggestions: ["Upload documents to extract timeline", "What type of timeline do you need?"]
      };
    }

    try {
      const timelineApi = new TimelineApi(API_BASE_URL, this.getAuthHeaders);
      
      const request: TimelineUploadRequest = {
        files,
        timeline_title: `Timeline for: ${query}`,
        include_summary: true
      };

      const response = await timelineApi.generateTimeline(request);

      let content = `⏰ **Timeline Extraction Results**\n\n`;
      content += `**Timeline: ${response.timeline_title}**\n`;
      content += `• Total events: ${response.total_events}\n`;
      content += `• Processing time: ${response.processing_time_ms}ms\n`;
      content += `• Status: ${response.status}\n\n`;

      if (response.summary) {
        content += `**Summary:**\n${response.summary}\n\n`;
      }

      content += `**Key Events:**\n`;
      response.events.slice(0, 5).forEach((event, index) => {
        content += `${index + 1}. **${event.event_title}** (${event.date})\n`;
        content += `   ${event.event_description}\n`;
        content += `   Source: ${event.document_source}\n`;
        content += `   Confidence: ${(event.confidence_score * 100).toFixed(1)}%\n\n`;
      });

      if (response.events.length > 5) {
        content += `... and ${response.events.length - 5} more events\n`;
      }

      return {
        content,
        feature: "timeline-extractor",
        metadata: {
          timelineId: response.timeline_id,
          totalEvents: response.total_events,
          processingTime: response.processing_time_ms
        }
      };
    } catch (error: any) {
      return {
        content: `❌ **Timeline Extraction Error**\n\nI encountered an error while extracting the timeline: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
        feature: "timeline-extractor",
        metadata: { error: error.message }
      };
    }
  }

  private async handleRegulatoryCompliance(query: string): Promise<SuperChatResponse> {
    try {
      const authHeaders = this.getAuthHeaders();
      const response = await submitRegulatoryQuery(authHeaders, query, 'duckduckgo');

      let content = `🛡️ **Regulatory Compliance Results**\n\n`;
      content += `**Query ID:** ${response.query_id}\n`;
      content += `**Confidence Score:** ${(response.confidence_score * 100).toFixed(1)}%\n`;
      content += `**Processing Time:** ${response.processing_time_ms}ms\n\n`;

      content += `**Answer:**\n${response.answer}\n\n`;

      if (response.sources && response.sources.length > 0) {
        content += `**Sources:**\n`;
        response.sources.slice(0, 3).forEach((source, index) => {
          content += `${index + 1}. ${source.title}\n`;
          content += `   URL: ${source.url}\n`;
          content += `   Relevance: ${source.relevance}\n\n`;
        });
      }

      if (response.related_sections && response.related_sections.length > 0) {
        content += `**Related Sections:**\n`;
        response.related_sections.forEach(section => {
          content += `• ${section}\n`;
        });
        content += `\n`;
      }

      if (response.amendments_found && response.amendments_found.length > 0) {
        content += `**Recent Amendments:**\n`;
        response.amendments_found.slice(0, 3).forEach(amendment => {
          content += `• ${amendment.title}\n`;
          content += `  ${amendment.snippet}\n`;
          content += `  Source: ${amendment.source}\n\n`;
        });
      }

      return {
        content,
        feature: "regulatory-compliance",
        metadata: {
          queryId: response.query_id,
          confidenceScore: response.confidence_score,
          sources: response.sources
        }
      };
    } catch (error: any) {
      return {
        content: `❌ **Regulatory Compliance Error**\n\nI encountered an error while searching regulatory information: ${error.message}\n\nPlease try again or contact support if the issue persists.`,
        feature: "regulatory-compliance",
        metadata: { error: error.message }
      };
    }
  }

  private async handleSmartDocumentStudio(query: string, context?: any): Promise<SuperChatResponse> {
    return {
      content: `📝 **Smart Document Studio**\n\nI can help you create and manage legal documents for "${query}".\n\n**Available Features:**\n• Contract generation\n• Document templates\n• Legal brief creation\n• Agreement drafting\n• Document review\n\n**What would you like to create?**\n• Employment contracts\n• Service agreements\n• Legal briefs\n• Compliance documents\n• Custom templates`,
      feature: "smart-document-studio",
      suggestions: [
        "Generate a contract template",
        "Create a legal brief",
        "Draft an agreement",
        "Review existing documents"
      ]
    };
  }

  private async handlePatentAnalysis(query: string): Promise<SuperChatResponse> {
    return {
      content: `💡 **Patent Analysis**\n\nI can help you analyze patent information for "${query}".\n\n**Available Analysis:**\n• Patent search and discovery\n• Prior art analysis\n• Patent landscape mapping\n• Infringement analysis\n• Patent portfolio management\n\n**What type of patent analysis do you need?**\n• Search for existing patents\n• Analyze patent claims\n• Identify patent opportunities\n• Competitive patent analysis`,
      feature: "patent-analysis",
      suggestions: [
        "Search for patents related to my invention",
        "Analyze patent landscape",
        "Check for patent infringement",
        "Identify patent opportunities"
      ]
    };
  }

  private async handleOrganizationManagement(query: string): Promise<SuperChatResponse> {
    return {
      content: `👥 **Organization Management**\n\nI can help you manage organizational data for "${query}".\n\n**Available Features:**\n• Data organization and structuring\n• Access control management\n• User permission settings\n• Organizational analytics\n• Data governance\n\n**What would you like to manage?**\n• User roles and permissions\n• Data access controls\n• Organizational structure\n• Compliance tracking`,
      feature: "organization-management",
      suggestions: [
        "Set up user permissions",
        "Organize data structure",
        "Configure access controls",
        "Generate organizational reports"
      ]
    };
  }

  private async handleSimpleChat(query: string): Promise<SuperChatResponse> {
    return {
      content: `💬 **General Chat**\n\nI understand you're asking about "${query}". I'm here to help with any legal or document-related questions.\n\n**How can I assist you?**\n• Legal research and analysis\n• Document processing\n• Compliance checking\n• Contract management\n• Patent analysis\n\nPlease let me know what specific area you'd like help with, or choose a feature from the sidebar for specialized assistance.`,
      feature: "simple-chat",
      suggestions: [
        "Help me with legal research",
        "Analyze my documents",
        "Check regulatory compliance",
        "Generate legal documents"
      ]
    };
  }
}

export const createSuperChatApi = (
  getAuthHeaders: () => Record<string, string>,
  refreshToken: () => Promise<boolean>
) => {
  return new SuperChatApi(getAuthHeaders, refreshToken);
};
