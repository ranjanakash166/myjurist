"use client";
import React, { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Clock, 
  FileText, 
  Brain, 
  TrendingUp, 
  Calendar, 
  Filter, 
  ChevronRight, 
  ChevronLeft, 
  Eye, 
  Copy, 
  Download, 
  ExternalLink,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  RefreshCw,
  BookOpen,
  Target,
  Award,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

import { useAuth } from "../../../../components/AuthProvider";
import { 
  getLegalResearchHistory, 
  LegalResearchHistoryItem, 
  LegalResearchHistoryParams,
  downloadLegalDocumentPDF,
  DownloadPDFRequest,
  AISummaryResponse,
  getLegalDocument
} from "@/lib/legalResearchApi";
import SimpleMarkdownRenderer from "../../../../components/SimpleMarkdownRenderer";
import { toast } from '@/hooks/use-toast';

interface LegalResearchHistoryProps {
  // No props needed since we removed the "Use This" functionality
}

export default function LegalResearchHistory({}: LegalResearchHistoryProps) {
  const { getAuthHeaders } = useAuth();
  const [history, setHistory] = useState<LegalResearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "general" | "specific">("all");
  const [selectedResearch, setSelectedResearch] = useState<LegalResearchHistoryItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const itemsPerPage = 20;

  const loadHistory = async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const params: LegalResearchHistoryParams = {
        limit: itemsPerPage,
        offset: (page - 1) * itemsPerPage,
      };

      const response = await getLegalResearchHistory(params, authToken);
      
      if (append) {
        setHistory(prev => [...prev, ...response]);
      } else {
        setHistory(response);
      }
      
      setHasMore(response.length === itemsPerPage);
      setCurrentPage(page);
    } catch (err: any) {
      setError(err.message || "Failed to load research history");
      toast({
        title: "Failed to load history",
        description: err.message || "Failed to load research history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleRefresh = () => {
    loadHistory(1, false);
  };

  const handleLoadMore = () => {
    loadHistory(currentPage + 1, true);
  };

  const handleSearch = () => {
    loadHistory(1, false);
  };

  const handleCopyContent = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Content has been copied to your clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  };

  const handleDownloadSummary = async (research: LegalResearchHistoryItem, parsedData: any) => {
    try {
      // Create a comprehensive summary text
      let summaryText = `Legal Research Summary\n`;
      summaryText += `Query: ${research.query}\n`;
      summaryText += `Search Type: ${research.search_type}\n`;
      summaryText += `Date: ${formatDate(research.created_at)}\n`;
      summaryText += `Confidence Score: ${(parsedData.confidence_score * 100).toFixed(0)}%\n\n`;
      
      summaryText += `AI Summary:\n${parsedData.ai_summary}\n\n`;
      
      if (parsedData.key_legal_insights && parsedData.key_legal_insights.length > 0) {
        summaryText += `Key Legal Insights:\n`;
        parsedData.key_legal_insights.forEach((insight: string, index: number) => {
          summaryText += `${index + 1}. ${insight}\n`;
        });
        summaryText += `\n`;
      }
      
      if (parsedData.relevant_precedents && parsedData.relevant_precedents.length > 0) {
        summaryText += `Relevant Precedents:\n`;
        parsedData.relevant_precedents.forEach((precedent: string, index: number) => {
          summaryText += `${index + 1}. ${precedent}\n`;
        });
        summaryText += `\n`;
      }
      
      if (parsedData.legal_areas_covered && parsedData.legal_areas_covered.length > 0) {
        summaryText += `Legal Areas Covered:\n`;
        parsedData.legal_areas_covered.forEach((area: string) => {
          summaryText += `• ${area}\n`;
        });
        summaryText += `\n`;
      }
      
      summaryText += `Total Results: ${research.total_results}\n`;
      summaryText += `Research ID: ${research.research_id}\n`;
      
      // Create and download the text file
      const blob = new Blob([summaryText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `legal_research_summary_${research.research_id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Summary downloaded",
        description: "AI summary has been downloaded as text file",
      });
    } catch (err: any) {
      console.error('Summary download error:', err);
      toast({
        title: "Summary download failed",
        description: err.message || "Failed to download summary. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async (research: LegalResearchHistoryItem, documentId?: string) => {
    const targetDocumentId = documentId || (research.search_results.length > 0 ? research.search_results[0].document_id : null);
    
    if (!targetDocumentId) {
      toast({
        title: "No documents available",
        description: "No documents found in this research to download",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPDF(true);
    
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const downloadRequest: DownloadPDFRequest = {
        document_id: targetDocumentId,
        include_header: true,
        font_size: 12
      };

      const blob = await downloadLegalDocumentPDF(downloadRequest, authToken);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename based on document or research
      const filename = documentId 
        ? `judgment_${targetDocumentId.slice(0, 8)}.pdf`
        : `legal_research_${research.research_id}.pdf`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "PDF downloaded",
        description: documentId ? "Judgment has been downloaded as PDF" : "Research document has been downloaded as PDF",
      });
    } catch (err: any) {
      console.error('PDF download error:', err);
      toast({
        title: "PDF download failed",
        description: err.message || "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleViewSource = async (documentId: string) => {
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      // First fetch the full document to get the Indian Kanoon URL
      const document = await getLegalDocument(documentId, authToken);
      
      // Extract Indian Kanoon URL from the full content
      const indianKanoonMatch = document.full_content.match(/Indian Kanoon - (http:\/\/indiankanoon\.org\/doc\/\d+)/);
      
      if (indianKanoonMatch && indianKanoonMatch[1]) {
        const indianKanoonUrl = indianKanoonMatch[1];
        window.open(indianKanoonUrl, '_blank', 'noopener,noreferrer');
        
        toast({
          title: "Opening Indian Kanoon",
          description: "Redirecting to the original source",
        });
      } else {
        toast({
          title: "Source not found",
          description: "Indian Kanoon URL not available for this document",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Failed to open source",
        description: err.message || "Failed to retrieve document source",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileName = (filePath: string) => {
    const parts = filePath.split('/');
    return parts[parts.length - 1]?.replace('.md', '') || filePath;
  };

  const getSimilarityColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
    if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
    return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
  };

  // Helper function to get parsed AI summary data (same as in main search page)
  const getParsedAISummaryData = (aiSummary: AISummaryResponse) => {
    try {
      console.log('Raw AI summary:', aiSummary.ai_summary);
      
      // Check if the content starts with ```json and ends with ```
      let jsonContent = aiSummary.ai_summary;
      if (jsonContent.includes('```json')) {
        jsonContent = jsonContent.replace(/```json\s*/, '').replace(/\s*```$/, '');
      }
      
      // Clean the JSON string by removing extra spaces and newlines
      const cleanJson = jsonContent.replace(/\s+/g, ' ').trim();
      console.log('Cleaned JSON:', cleanJson);
      
      const parsedSummary = JSON.parse(cleanJson);
      console.log('Parsed summary:', parsedSummary);
      
      return {
        ai_summary: parsedSummary.ai_summary || aiSummary.ai_summary,
        key_legal_insights: parsedSummary.key_legal_insights || aiSummary.key_legal_insights,
        relevant_precedents: parsedSummary.relevant_precedents || aiSummary.relevant_precedents,
        legal_areas_covered: parsedSummary.legal_areas_covered || aiSummary.legal_areas_covered,
        confidence_score: parsedSummary.confidence_score || aiSummary.confidence_score,
      };
    } catch (error) {
      console.error('Failed to parse AI summary JSON:', error);
      console.error('Raw content:', aiSummary.ai_summary);
      // Return original data if parsing fails
      return {
        ai_summary: aiSummary.ai_summary,
        key_legal_insights: aiSummary.key_legal_insights,
        relevant_precedents: aiSummary.relevant_precedents,
        legal_areas_covered: aiSummary.legal_areas_covered,
        confidence_score: aiSummary.confidence_score,
      };
    }
  };

  // Filter and search history
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || item.search_type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">


      {/* Search and Filter Controls */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search by query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10"
              />
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterType} onValueChange={(value: "all" | "general" | "specific") => setFilterType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General Search</SelectItem>
                  <SelectItem value="specific">Specific Search</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={handleSearch} className="h-10 px-6">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
            <Button onClick={handleRefresh} variant="outline" className="h-10 px-6">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* History List */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {loading && history.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Loading History...</h3>
              <p className="text-muted-foreground">
                Fetching your legal research history
              </p>
            </CardContent>
          </Card>
        ) : filteredHistory.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Research History</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterType !== "all" 
                  ? "No research history matches your search criteria" 
                  : "Start your first legal research to see history here"
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
                         {/* History Items */}
             {filteredHistory.map((research, index) => (
               <Card key={research.research_id} className="hover:shadow-lg transition-shadow duration-200 group">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-foreground truncate" title={research.query}>
                          {research.query}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(research.created_at)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {research.search_type}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {research.total_results} results
                        </span>
                        {research.search_time_ms && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {research.search_time_ms}ms
                          </span>
                        )}
                        {research.ai_summary && (
                          <span className="flex items-center gap-1">
                            <Brain className="w-3 h-3" />
                            AI Summary
                          </span>
                        )}
                      </div>
                    </div>
                                         <div className="flex items-center gap-2 flex-shrink-0">
                       <Button
                         variant="outline"
                         size="sm"
                         onClick={() => {
                           setSelectedResearch(research);
                           setIsDetailModalOpen(true);
                         }}
                         className="h-8 text-xs group-hover:scale-105 transition-transform duration-200"
                       >
                         <Eye className="w-3 h-3 mr-1" />
                         View Details
                       </Button>
                     </div>
                  </div>
                </CardHeader>
              </Card>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center pt-4">
                <Button 
                  onClick={handleLoadMore} 
                  variant="outline"
                  disabled={loading}
                  className="px-8 hover:scale-105 transition-transform duration-200"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading...
                    </div>
                  ) : (
                                         <div className="flex items-center gap-2">
                       <ChevronRight className="w-4 h-4 rotate-90" />
                       Load More
                     </div>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="flex-shrink-0 p-6 pb-4">
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Legal Research Analysis
            </DialogTitle>
          </DialogHeader>
          
          {selectedResearch && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <div className="space-y-6">
                  {/* Search Query Header */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Query
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg p-4 border">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-semibold">{selectedResearch.query}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{selectedResearch.search_type}</Badge>
                            <Badge variant="outline">{selectedResearch.total_results} results</Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Created:</span>
                            <p>{formatDate(selectedResearch.created_at)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Top K:</span>
                            <p>{selectedResearch.top_k}</p>
                          </div>
                          {selectedResearch.search_time_ms && (
                            <div>
                              <span className="text-muted-foreground">Search Time:</span>
                              <p>{selectedResearch.search_time_ms}ms</p>
                            </div>
                          )}
                          <div>
                            <span className="text-muted-foreground">Research ID:</span>
                            <p className="font-mono text-xs">{selectedResearch.research_id}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* AI Summary */}
                  {selectedResearch.ai_summary && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="w-5 h-5 text-purple-500" />
                          AI Summary
                        </CardTitle>
                      </CardHeader>
                                             <CardContent className="space-y-4">
                         {(() => {
                           const parsedData = getParsedAISummaryData(selectedResearch.ai_summary);
                           return (
                             <>
                               <div className="flex items-center justify-between">
                                 <Badge className={`${getConfidenceColor(parsedData.confidence_score)}`}>
                                   {(parsedData.confidence_score * 100).toFixed(0)}% Confidence
                                 </Badge>
                                 <div className="flex items-center gap-2">
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleCopyContent(parsedData.ai_summary)}
                                   >
                                     <Copy className="w-4 h-4 mr-2" />
                                     Copy Summary
                                   </Button>
                                   <Button
                                     variant="outline"
                                     size="sm"
                                     onClick={() => handleDownloadSummary(selectedResearch, parsedData)}
                                   >
                                     <Download className="w-4 h-4 mr-2" />
                                     Download Summary
                                   </Button>
                                 </div>
                               </div>

                               <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-4 border">
                                 <div className="flex items-center gap-2 mb-3">
                                   <Sparkles className="w-5 h-5 text-purple-500" />
                                   <h4 className="font-semibold">Summary</h4>
                                 </div>
                                 <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                   {(() => {
                                     // Check if we got the raw JSON back (parsing failed)
                                     if (parsedData.ai_summary === selectedResearch.ai_summary.ai_summary && selectedResearch.ai_summary.ai_summary.includes('"ai_summary"')) {
                                       // Try to extract just the summary text from the JSON string
                                       try {
                                         const match = selectedResearch.ai_summary.ai_summary.match(/"ai_summary":\s*"([^"]+)"/);
                                         if (match) {
                                           return match[1];
                                         }
                                       } catch (e) {
                                         console.error('Failed to extract summary text:', e);
                                       }
                                     }
                                     return parsedData.ai_summary;
                                   })()}
                                 </div>
                               </div>

                               {parsedData.key_legal_insights && parsedData.key_legal_insights.length > 0 && (
                                 <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-4 border">
                                   <div className="flex items-center gap-2 mb-3">
                                     <Lightbulb className="w-5 h-5 text-green-500" />
                                     <h4 className="font-semibold">Key Legal Insights</h4>
                                   </div>
                                   <div className="space-y-2">
                                     {parsedData.key_legal_insights.map((insight, index) => (
                                       <div key={index} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded border">
                                         <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                         <span className="text-sm">{insight}</span>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )}

                               {parsedData.relevant_precedents && parsedData.relevant_precedents.length > 0 && (
                                 <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-4 border">
                                   <div className="flex items-center gap-2 mb-3">
                                     <Award className="w-5 h-5 text-orange-500" />
                                     <h4 className="font-semibold">Relevant Precedents</h4>
                                   </div>
                                   <div className="space-y-2">
                                     {parsedData.relevant_precedents.map((precedent, index) => (
                                       <div key={index} className="flex items-start gap-2 p-2 bg-white/50 dark:bg-gray-800/50 rounded border">
                                         <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                         <span className="text-sm">{precedent}</span>
                                       </div>
                                     ))}
                                   </div>
                                 </div>
                               )}

                               {parsedData.legal_areas_covered && parsedData.legal_areas_covered.length > 0 && (
                                 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 border">
                                   <div className="flex items-center gap-2 mb-3">
                                     <Target className="w-5 h-5 text-blue-500" />
                                     <h4 className="font-semibold">Legal Areas Covered</h4>
                                   </div>
                                   <div className="flex flex-wrap gap-2">
                                     {parsedData.legal_areas_covered.map((area, index) => (
                                       <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                         {area}
                                       </Badge>
                                     ))}
                                   </div>
                                 </div>
                               )}
                             </>
                           );
                         })()}
                      </CardContent>
                    </Card>
                  )}

                                     {/* Search Results */}
                   <Card>
                     <CardHeader>
                       <CardTitle className="flex items-center gap-2">
                         <FileText className="w-5 h-5 text-primary" />
                         Search Results ({selectedResearch.search_results.length})
                       </CardTitle>
                     </CardHeader>
                     <CardContent>
                       <div className="space-y-4">
                        {selectedResearch.search_results.map((result, index) => (
                          <div key={index} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-3 mb-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 truncate" title={result.title}>
                                  {result.title}
                                </h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span>{formatFileName(result.source_file)}</span>
                                  {result.section_header && (
                                    <>
                                      <span>•</span>
                                      <span>{result.section_header}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>Chunk {result.chunk_index}</span>
                                </div>
                              </div>
                                                             <div className="flex items-center gap-2 flex-shrink-0">
                                 <Badge className={`text-xs ${getSimilarityColor(result.similarity_score)}`}>
                                   {(result.similarity_score * 100).toFixed(1)}% match
                                 </Badge>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => handleCopyContent(result.content)}
                                   className="h-6 w-6 p-0"
                                 >
                                   <Copy className="w-3 h-3" />
                                 </Button>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => handleViewSource(result.document_id)}
                                   className="h-6 w-6 p-0"
                                 >
                                   <ExternalLink className="w-3 h-3" />
                                 </Button>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => handleDownloadPDF(selectedResearch, result.document_id)}
                                   disabled={isGeneratingPDF}
                                   className="h-6 w-6 p-0"
                                 >
                                   {isGeneratingPDF ? (
                                     <Loader2 className="w-3 h-3 animate-spin" />
                                   ) : (
                                     <Download className="w-3 h-3" />
                                   )}
                                 </Button>
                               </div>
                            </div>
                            <div className="bg-muted/50 rounded p-3 text-sm">
                              <SimpleMarkdownRenderer 
                                content={result.content} 
                                className="text-sm leading-relaxed"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
