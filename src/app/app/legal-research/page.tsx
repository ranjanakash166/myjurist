"use client";
import React, { useState } from "react";
import { Search, FileText, Clock, TrendingUp, BookOpen, Filter, Download, Copy, ExternalLink, AlertCircle, CheckCircle, Loader2, X, FileText as FileTextIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "../../../components/AuthProvider";
import { searchLegalResearch, getLegalDocument, LegalResearchRequest, LegalResearchResponse, SearchResult, DocumentResponse } from "@/lib/legalResearchApi";
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import { toast } from '@/hooks/use-toast';

export default function LegalResearchPage() {
  const { getAuthHeaders } = useAuth();
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<"general" | "specific">("general");
  const [topK, setTopK] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [loadingViewSource, setLoadingViewSource] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const request: LegalResearchRequest = {
        query: query.trim(),
        top_k: topK,
        search_type: searchType,
      };

      const response = await searchLegalResearch(request, authToken);
      setSearchResults(response);
      
      // Add to search history
      if (!searchHistory.includes(query.trim())) {
        setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
      }
      
      toast({
        title: "Search completed",
        description: `Found ${response.total_results} results in ${response.search_time_ms}ms`,
      });
    } catch (err: any) {
      setError(err.message || "An error occurred during search");
      toast({
        title: "Search failed",
        description: err.message || "An error occurred during search",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
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

  const handleViewSource = async (documentId: string) => {
    setLoadingViewSource(documentId);
    
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
    } finally {
      setLoadingViewSource(null);
    }
  };

  const handleViewFullDocument = async (documentId: string) => {
    setIsLoadingDocument(true);
    setError(null);
    
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const document = await getLegalDocument(documentId, authToken);
      setSelectedDocument(document);
      
      toast({
        title: "Document loaded",
        description: `Retrieved ${document.title}`,
      });
    } catch (err: any) {
      setError(err.message || "Failed to load document");
      toast({
        title: "Failed to load document",
        description: err.message || "Failed to load document",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDocument(false);
    }
  };

  const handleDownloadPDF = async (documentData: DocumentResponse) => {
    setIsGeneratingPDF(true);
    
    try {
      // Dynamically import the PDF libraries
      const jsPDF = (await import('jspdf')).default;
      const html2canvas = (await import('html2canvas')).default;
      
      // Create a temporary div to render the markdown content
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '800px';
      tempDiv.style.padding = '40px';
      tempDiv.style.fontFamily = 'Arial, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.6';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.color = 'black';
      
      // Convert markdown to HTML (simple conversion for basic elements)
      const htmlContent = convertMarkdownToHTML(documentData.full_content);
      tempDiv.innerHTML = htmlContent;
      
      document.body.appendChild(tempDiv);
      
      // Convert to canvas
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      // Remove temporary div
      document.body.removeChild(tempDiv);
      
      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Download PDF
      const filename = `${documentData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      pdf.save(filename);
      
      toast({
        title: "PDF downloaded",
        description: "Document has been downloaded as PDF",
      });
    } catch (err) {
      console.error('PDF generation error:', err);
      toast({
        title: "PDF generation failed",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const convertMarkdownToHTML = (markdown: string): string => {
    // Simple markdown to HTML conversion for basic elements
    let html = markdown
      // Headers
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Lists
      .replace(/^\* (.*$)/gim, '<li>$1</li>')
      .replace(/^\- (.*$)/gim, '<li>$1</li>')
      // Paragraphs
      .replace(/\n\n/g, '</p><p>')
      .replace(/^(.+)$/gm, '<p>$1</p>');
    
    // Wrap lists
    html = html.replace(/<li>.*<\/li>/g, (match) => `<ul>${match}</ul>`);
    
    return html;
  };

  const handleQuickSearch = (quickQuery: string) => {
    setQuery(quickQuery);
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

  const quickSearchQueries = [
    "financial irregularities",
    "fraudulent trading",
    "insolvency proceedings",
    "corporate governance",
    "contract disputes",
    "intellectual property",
    "regulatory compliance",
    "employment law",
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Legal Research</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search through our comprehensive legal database to find relevant case law, regulations, and legal precedents
        </p>
      </div>

      {/* Search Form */}
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Search Legal Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Enter your legal research query..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-12 text-base"
                  disabled={isSearching}
                />
              </div>
              <Button 
                type="submit" 
                className="h-12 px-8"
                disabled={isSearching || !query.trim()}
              >
                {isSearching ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    Search
                  </div>
                )}
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Search Type</label>
                <Select value={searchType} onValueChange={(value: "general" | "specific") => setSearchType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Search</SelectItem>
                    <SelectItem value="specific">Specific Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-2">Number of Results</label>
                <Select value={topK.toString()} onValueChange={(value) => setTopK(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 results</SelectItem>
                    <SelectItem value="5">5 results</SelectItem>
                    <SelectItem value="10">10 results</SelectItem>
                    <SelectItem value="15">15 results</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>

          {/* Quick Search Suggestions */}
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {quickSearchQueries.map((quickQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickSearch(quickQuery)}
                  className="text-xs"
                >
                  {quickQuery}
                </Button>
              ))}
            </div>
          </div>

          {/* Search History */}
          {searchHistory.length > 0 && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm font-medium mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((historyQuery, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleQuickSearch(historyQuery)}
                    className="text-xs"
                  >
                    {historyQuery}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="max-w-4xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Search Results */}
      {searchResults && (
        <div className="space-y-6">
          {/* Results List */}
          <div className="space-y-4 max-w-4xl mx-auto">
            {searchResults.results.map((result, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-primary" />
                        <h3 className="font-semibold text-foreground truncate" title={result.title}>
                          {result.title}
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Filter className="w-3 h-3" />
                          {formatFileName(result.source_file)}
                        </span>
                        {result.section_header && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {result.section_header}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Chunk {result.chunk_index}
                        </span>
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
                        className="h-8 w-8 p-0"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="bg-muted/50 rounded-lg p-4 border">
                    <SimpleMarkdownRenderer 
                      content={result.content} 
                      className="text-sm leading-relaxed"
                    />
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Document ID: {result.document_id.slice(0, 8)}...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyContent(result.content)}
                        className="h-8 text-xs"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleViewSource(result.document_id)}
                        disabled={loadingViewSource === result.document_id}
                      >
                        {loadingViewSource === result.document_id ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <ExternalLink className="w-3 h-3 mr-1" />
                        )}
                        View Source
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleViewFullDocument(result.document_id)}
                        disabled={isLoadingDocument}
                      >
                        {isLoadingDocument ? (
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <FileTextIcon className="w-3 h-3 mr-1" />
                        )}
                        Full Document
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* No Results */}
          {searchResults.results.length === 0 && (
            <Card className="max-w-4xl mx-auto">
              <CardContent className="pt-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or using different keywords
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Empty State */}
      {!searchResults && !isSearching && (
        <Card className="max-w-4xl mx-auto">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Your Legal Research</h3>
            <p className="text-muted-foreground mb-4">
              Enter a query above to search through our comprehensive legal database
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {quickSearchQueries.slice(0, 4).map((quickQuery, index) => (
                <Button
                  key={index}
                  variant="outline"
                  onClick={() => handleQuickSearch(quickQuery)}
                  className="text-sm"
                >
                  {quickQuery}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-semibold text-foreground truncate">
                  {selectedDocument.title}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedDocument.source_file} • {selectedDocument.content_length} characters
                </p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadPDF(selectedDocument)}
                  disabled={isGeneratingPDF}
                >
                  {isGeneratingPDF ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4 mr-2" />
                  )}
                  {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDocument(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            {/* Modal Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-muted/50 rounded-lg p-6 border">
                <SimpleMarkdownRenderer 
                  content={selectedDocument.full_content} 
                  className="text-sm leading-relaxed max-w-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 