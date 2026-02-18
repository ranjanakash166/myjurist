"use client";
import React, { useState } from "react";
import { Search, FileText, Clock, BookOpen, Download, Copy, AlertCircle, Loader2, Brain, Sparkles, Target, Award, Lightbulb, Users, Zap, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "../../../components/AuthProvider";
import { searchLegalResearch, downloadLegalDocumentPDF, LegalResearchRequest, LegalResearchResponse, SearchResult, AISummaryResponse } from "@/lib/legalResearchApi";
import { toast } from '@/hooks/use-toast';
import { normalizeContentLineBreaks, parseBoldText, parseMarkdownText } from "@/lib/utils";
import LegalResearchHistory from "./components/LegalResearchHistory";
import LegalResearchSkeleton from "./components/LegalResearchSkeleton";

export default function LegalResearchPage() {
 const { getAuthHeaders, refreshToken } = useAuth();
 const [query, setQuery] = useState("");
 const [searchType, setSearchType] = useState<"general" | "supreme_court" | "high_court">("general");
 const [topK, setTopK] = useState(5);
 const [isSearching, setIsSearching] = useState(false);
 const [searchResults, setSearchResults] = useState<LegalResearchResponse | null>(null);
 const [error, setError] = useState<string | null>(null);
 const [searchHistory, setSearchHistory] = useState<string[]>([]);
 const [selectedCase, setSelectedCase] = useState<SearchResult | null>(null);
 const [selectedCasePdfUrl, setSelectedCasePdfUrl] = useState<string | null>(null);
 const [isLoadingCasePdf, setIsLoadingCasePdf] = useState(false);
 const [casePdfError, setCasePdfError] = useState<string | null>(null);
 const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
 
 // State variables for AI Summary
 const [aiSummary, setAiSummary] = useState<AISummaryResponse | null>(null);
 const [summaryType, setSummaryType] = useState<"comprehensive" | "brief" | "detailed">("comprehensive");
 const [maxLength, setMaxLength] = useState(1500);
 
 // State for tabs
 const [activeTab, setActiveTab] = useState("search");

 // State for recent searches
 const [recentSearches, setRecentSearches] = useState<string[]>([]);
 const [isLoadingRecentSearches, setIsLoadingRecentSearches] = useState(false);

  // Fetch recent searches on component mount
  React.useEffect(() => {
    const fetchRecentSearches = async () => {
      setIsLoadingRecentSearches(true);
      try {
        const authHeaders = getAuthHeaders();
        const response = await fetch('https://api.myjurist.io/api/v1/legal-research/history?limit=5', {
          method: 'GET',
          headers: authHeaders,
        });
        
        if (response.ok) {
          const data = await response.json();
          // Data is an array of LegalResearchHistoryItem[]
          const queries = data
            .map((item: any) => item.query)
            .filter((q: string) => q && q.trim());
          setRecentSearches(queries);
        }
      } catch (err) {
        console.error('Failed to fetch recent searches:', err);
      } finally {
        setIsLoadingRecentSearches(false);
      }
    };

    fetchRecentSearches();
  }, [getAuthHeaders]);

  // Reset search tab when switching from History to Search
  React.useEffect(() => {
    if (activeTab === "search") {
      // Clear all search-related state when switching to search tab
      setSearchResults(null);
      setAiSummary(null);
      setSelectedCase(null);
      setSelectedCasePdfUrl((previousUrl) => {
        if (previousUrl) {
          window.URL.revokeObjectURL(previousUrl);
        }
        return null;
      });
      setCasePdfError(null);
      setError(null);
      setQuery("");
      setIsSearching(false);
    }
  }, [activeTab]);

  React.useEffect(() => {
    return () => {
      if (selectedCasePdfUrl) {
        window.URL.revokeObjectURL(selectedCasePdfUrl);
      }
    };
  }, [selectedCasePdfUrl]);

 const handleSearch = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!query.trim()) return;

 // IMMEDIATELY clear all previous results before starting new search
 setSearchResults(null);
 setAiSummary(null);
 setSelectedCase(null);
 setSelectedCasePdfUrl((previousUrl) => {
 if (previousUrl) {
 window.URL.revokeObjectURL(previousUrl);
 }
 return null;
 });
 setCasePdfError(null);
 setError(null);
 setIsSearching(true);
 
 try {
 const authHeaders = getAuthHeaders();
 const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
 
 // Single API call: Enhanced search with AI summary
 const searchRequest: LegalResearchRequest = {
 query: query.trim(),
 top_k: topK,
 search_type: searchType,
 include_ai_summary: true,
 summary_type: summaryType,
 max_summary_length: maxLength,
 };

 const searchResponse = await searchLegalResearch(searchRequest, authToken, getAuthHeaders, refreshToken);
 setSearchResults(searchResponse);
 
 // Set AI summary from the response if available
 if (searchResponse.ai_summary) {
 setAiSummary(searchResponse.ai_summary);
 }
 
 // Add to search history
 if (!searchHistory.includes(query.trim())) {
 setSearchHistory(prev => [query.trim(), ...prev.slice(0, 9)]);
 }
 
 toast({
 title: "Search completed",
 description: `Found ${searchResponse.total_results} results${searchResponse.ai_summary ? ' and generated AI summary' : ''}`,
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

 const handleSelectCase = async (result: SearchResult) => {
 setSelectedCase(result);
 setCasePdfError(null);
 setIsLoadingCasePdf(true);

 try {
 const authHeaders = getAuthHeaders();
 const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';

 const blob = await downloadLegalDocumentPDF(
 { document_id: result.document_id },
 authToken,
 getAuthHeaders,
 refreshToken
 );

 const objectUrl = window.URL.createObjectURL(blob);
 setSelectedCasePdfUrl((previousUrl) => {
 if (previousUrl) {
 window.URL.revokeObjectURL(previousUrl);
 }
 return objectUrl;
 });
 } catch (err: any) {
 console.error('Case PDF preview error:', err);
 setCasePdfError(err.message || "Failed to load PDF preview.");
 toast({
 title: "Failed to load PDF",
 description: err.message || "Failed to load PDF preview.",
 variant: "destructive",
 });
 } finally {
 setIsLoadingCasePdf(false);
 }
 };

 const handleDownloadPDF = async (documentTitle: string, documentId: string) => {
 if (!documentId) {
 toast({
 title: "Error",
 description: "Document ID not found. Please try viewing the document again.",
 variant: "destructive",
 });
 return;
 }

 setIsGeneratingPDF(true);
 
 try {
 const authHeaders = getAuthHeaders();
 const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
 
 // Download PDF using the older endpoint
 const blob = await downloadLegalDocumentPDF({ document_id: documentId }, authToken, getAuthHeaders, refreshToken);
 
 // Create download link
 const url = window.URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `${documentTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 window.URL.revokeObjectURL(url);

 toast({
 title: "PDF downloaded",
 description: "Original PDF document has been downloaded",
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

 const handleQuickSearch = (quickQuery: string) => {
 setQuery(quickQuery);
 };

 const formatFileName = (filePath: string) => {
 const parts = filePath.split('/');
 return parts[parts.length - 1]?.replace('.md', '') || filePath;
 };

 const getSimilarityColor = (score: number) => {
 if (score >= 0.8) return "text-primary bg-primary/10 dark:text-primary dark:bg-primary/20";
 if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
 return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
 };

 const getConfidenceColor = (score: number) => {
 if (score >= 0.8) return "text-primary bg-primary/10 dark:text-primary dark:bg-primary/20";
 if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
 return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
 };

 // Helper function to get parsed AI summary data
 const getParsedAISummaryData = () => {
 try {
 
 // Check if the content starts with ```json and ends with ```
 let jsonContent = aiSummary.ai_summary;
 if (jsonContent.includes('```json')) {
 jsonContent = jsonContent.replace(/```json\s*/, '').replace(/\s*```$/, '');
 }
 
 // Clean the JSON string by removing extra spaces and newlines
 const cleanJson = jsonContent.replace(/\s+/g, ' ').trim();
 
 const parsedSummary = JSON.parse(cleanJson);
 
 return {
 ai_summary: parsedSummary.ai_summary || aiSummary.ai_summary,
 key_legal_insights: parsedSummary.key_legal_insights || aiSummary.key_legal_insights,
 relevant_precedents: parsedSummary.relevant_precedents || aiSummary.relevant_precedents,
 statutory_provisions: parsedSummary.statutory_provisions || aiSummary.statutory_provisions,
 procedural_developments: parsedSummary.procedural_developments || aiSummary.procedural_developments,
 practical_implications: parsedSummary.practical_implications || aiSummary.practical_implications,
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
 statutory_provisions: aiSummary.statutory_provisions,
 procedural_developments: aiSummary.procedural_developments,
 practical_implications: aiSummary.practical_implications,
 legal_areas_covered: aiSummary.legal_areas_covered,
 confidence_score: aiSummary.confidence_score,
 };
 }
 };

 return (
 <div className="w-full px-6 md:px-8 lg:px-12 py-6 space-y-6">
 {/* Header */}
 <div className="space-y-2">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg">
 <BookOpen className="w-5 h-5 text-primary-foreground" />
 </div>
 <h1 className="text-2xl font-bold text-foreground">Legal Research</h1>
 </div>
 <p className="text-sm text-muted-foreground">
 Search through case law, regulations, and legal precedents
 </p>
 </div>

 {/* Tabs */}
 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
 <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted rounded-lg border border-border">
 <TabsTrigger value="search" className="flex items-center gap-2 text-sm py-2 px-2 sm:px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground">
 <Search className="w-4 h-4" />
 Search
 </TabsTrigger>
 <TabsTrigger value="history" className="flex items-center gap-2 text-sm py-2 px-2 sm:px-4 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=inactive]:text-muted-foreground">
 <History className="w-4 h-4" />
 History
 </TabsTrigger>
 </TabsList>

 <TabsContent value="search" className="space-y-6 mt-6">

        {/* Search Form */}
        <Card className="w-full border border-border shadow-lg bg-card">
          <CardContent className="pt-6">
 <form onSubmit={handleSearch} className="space-y-5">
 {/* Search Input */}
 <div className="relative">
 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
 <Search className="w-5 h-5" />
 </div>
 <Input
 type="text"
 placeholder="What legal information are you looking for?"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 className="h-14 text-base pl-12 pr-32 rounded-xl border-border focus:ring-2 focus:ring-primary/20 focus:border-primary"
 disabled={isSearching}
 />
 <Button 
 type="submit" 
 className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
 disabled={isSearching || !query.trim()}
 >
 {isSearching ? (
 <div className="flex items-center gap-2">
 <Loader2 className="w-4 h-4 animate-spin" />
 <span className="hidden sm:inline">Searching...</span>
 </div>
 ) : (
 <span>Search</span>
 )}
 </Button>
 </div>

 {/* Filters Row */}
 <div className="flex flex-col sm:flex-row gap-4">
 <div className="flex-1">
 <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Court Type</label>
 <Select value={searchType} onValueChange={(value: "general" | "supreme_court" | "high_court") => setSearchType(value)}>
 <SelectTrigger className="h-11 rounded-lg">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="general">All Courts</SelectItem>
 <SelectItem value="supreme_court">Supreme Court</SelectItem>
 <SelectItem value="high_court">High Court</SelectItem>
 </SelectContent>
 </Select>
 </div>
 <div className="flex-1">
 <label className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Results</label>
 <Select value={topK.toString()} onValueChange={(value) => setTopK(parseInt(value))}>
 <SelectTrigger className="h-11 rounded-lg">
 <SelectValue />
 </SelectTrigger>
 <SelectContent>
 <SelectItem value="3">3 results</SelectItem>
 <SelectItem value="5">5 results</SelectItem>
 <SelectItem value="10">10 results</SelectItem>
 </SelectContent>
 </Select>
 </div>
 </div>
 </form>

 {/* Recent Searches from API */}
 <div className="mt-6 pt-5 border-t border-border">
 <h3 className="text-xs font-medium text-muted-foreground mb-3 flex items-center gap-2 uppercase tracking-wide">
 <Clock className="w-3.5 h-3.5" />
 Recent Searches
 </h3>
 {isLoadingRecentSearches ? (
 <div className="flex gap-2">
 {[1, 2, 3].map((i) => (
 <div key={i} className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
 ))}
 </div>
 ) : recentSearches.length > 0 ? (
 <div className="flex flex-wrap gap-2">
 {recentSearches.map((recentQuery, index) => (
 <button
 key={index}
 onClick={() => handleQuickSearch(recentQuery)}
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/40"
 >
 <Search className="w-3 h-3" />
 {recentQuery}
 </button>
 ))}
 </div>
 ) : (
 <p className="text-sm text-muted-foreground">No recent searches yet. Start searching to build your history.</p>
 )}
 </div>

 </CardContent>
 </Card>

 {/* Error Display */}
 {error && (
 <Alert variant="destructive">
 <AlertCircle className="h-4 w-4" />
 <AlertDescription>{error}</AlertDescription>
 </Alert>
 )}

 {/* Loading Skeleton */}
 {isSearching && !searchResults && (
 <LegalResearchSkeleton />
 )}

 {/* Search Results and AI Summary */}
 {searchResults && (
 <div className="space-y-6">
        {/* AI Summary Section */}
        <Card className="border border-border shadow-lg bg-card">
          <CardHeader className="bg-primary/5 dark:bg-primary/10 rounded-t-lg border-b border-border">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-xl text-foreground">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span>AI Summary</span>
              </CardTitle>
              {aiSummary && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyContent(getParsedAISummaryData().ai_summary)}
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copy Summary
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {isSearching ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">Generating AI Summary...</h3>
                <p className="text-muted-foreground">
                  Analyzing search results and creating intelligent summary
                </p>
              </div>
            ) : aiSummary ? (
              <div className="space-y-6">
                {/* AI Summary Content */}
                <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-border">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                      <Sparkles className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <h3 className="font-bold text-lg text-foreground">Summary</h3>
                  </div>
                  <div className="text-base leading-relaxed text-foreground max-w-none w-full">
                    {(() => {
                      const parsedData = getParsedAISummaryData();
                      let textToShow = parsedData.ai_summary;
                      if (parsedData.ai_summary === aiSummary.ai_summary && aiSummary.ai_summary.includes('"ai_summary"')) {
                        try {
                          const match = aiSummary.ai_summary.match(/"ai_summary":\s*"([^"]+)"/);
                          if (match) textToShow = match[1];
                        } catch (e) {
                          console.error('Failed to extract summary text:', e);
                        }
                      }
                      const normalized = normalizeContentLineBreaks(textToShow);
                      return parseMarkdownText(normalized);
                    })()}
                  </div>
 </div>

                {/* Key Legal Insights */}
                {getParsedAISummaryData().key_legal_insights && getParsedAISummaryData().key_legal_insights.length > 0 && (
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                        <Lightbulb className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Key Legal Insights</h3>
                    </div>
                    <div className="space-y-3">
                      {getParsedAISummaryData().key_legal_insights.map((insight: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-sm leading-relaxed text-foreground flex-1">{parseBoldText(insight)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Relevant Precedents */}
                {getParsedAISummaryData().relevant_precedents && getParsedAISummaryData().relevant_precedents.length > 0 && (
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Relevant Precedents</h3>
                    </div>
                    <div className="space-y-3">
                      {getParsedAISummaryData().relevant_precedents.map((precedent: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-orange-100 dark:border-orange-900/50 hover:shadow-md transition-shadow">
                          <div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">{parseBoldText(precedent)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statutory Provisions */}
                {getParsedAISummaryData().statutory_provisions && getParsedAISummaryData().statutory_provisions.length > 0 && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Statutory Provisions</h3>
                    </div>
                    <div className="space-y-3">
                      {getParsedAISummaryData().statutory_provisions.map((provision: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-indigo-100 dark:border-indigo-900/50 hover:shadow-md transition-shadow">
                          <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">{parseBoldText(provision)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Procedural Developments */}
                {getParsedAISummaryData().procedural_developments && getParsedAISummaryData().procedural_developments.length > 0 && (
                  <div className="bg-muted/50 rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
                        <Zap className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Procedural Developments</h3>
                    </div>
                    <div className="space-y-3">
                      {getParsedAISummaryData().procedural_developments.map((development: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
                          <div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-sm leading-relaxed text-foreground flex-1">{parseBoldText(development)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Practical Implications */}
                {getParsedAISummaryData().practical_implications && getParsedAISummaryData().practical_implications.length > 0 && (
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl p-6 border-2 border-rose-200 dark:border-rose-800">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Practical Implications</h3>
                    </div>
                    <div className="space-y-3">
                      {getParsedAISummaryData().practical_implications.map((implication: string, index: number) => (
                        <div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-rose-100 dark:border-rose-900/50 hover:shadow-md transition-shadow">
                          <div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
                          <span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">{parseBoldText(implication)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Legal Areas Covered */}
                {getParsedAISummaryData().legal_areas_covered && getParsedAISummaryData().legal_areas_covered.length > 0 && (
                  <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-border">
                    <div className="flex items-center gap-2 mb-4">
                      <Target className="w-5 h-5 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">Legal Areas Covered</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {getParsedAISummaryData().legal_areas_covered.map((area: string, index: number) => (
                        <Badge key={index} variant="secondary" className="bg-primary/20 text-foreground px-3 py-1">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sources Analyzed */}
                {aiSummary.sources_analyzed && aiSummary.sources_analyzed.length > 0 && (
                  <div className="bg-muted/50 rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shadow-md border border-border">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <h3 className="font-bold text-lg text-foreground">Sources Analyzed</h3>
                      <Badge variant="secondary" className="ml-auto">
                        {aiSummary.sources_analyzed.length} {aiSummary.sources_analyzed.length === 1 ? 'source' : 'sources'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiSummary.sources_analyzed.map((source, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-foreground bg-white/70 dark:bg-gray-800/70 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
                          <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                          <span className="truncate">{formatFileName(source)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}


 </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
                    <Brain className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-foreground">No AI Summary Available</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    AI summary will be generated automatically when search results are found
                  </p>
                </div>
              )}
 </CardContent>
 </Card>

        {/* Search Results */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <FileText className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Relevant cases</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Found {searchResults.total_results} {searchResults.total_results === 1 ? 'result' : 'results'}
                </p>
              </div>
            </div>
          </div>
          {searchResults.results.length === 0 ? (
            <Card className="border-2">
              <CardContent className="pt-12 pb-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-800 dark:to-gray-800 rounded-full flex items-center justify-center shadow-lg">
                  <Search className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">No results found</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search terms or using different keywords to find relevant legal information
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
              <Card className="xl:col-span-4 border border-border overflow-hidden">
                <CardHeader className="pb-3 border-b border-border">
                  <CardTitle className="text-base">Cases</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[70vh] overflow-y-auto">
                    {searchResults.results.map((result, index) => {
                      const isSelected = selectedCase?.document_id === result.document_id;
                      return (
                        <button
                          key={result.document_id}
                          type="button"
                          onClick={() => handleSelectCase(result)}
                          className={`w-full text-left p-4 border-b border-border transition-colors ${
                            isSelected ? "bg-primary/10" : "hover:bg-muted/60"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline" className="text-xs">
                                  Case {index + 1}
                                </Badge>
                                <span className="text-xs text-muted-foreground truncate">
                                  {formatFileName(result.source_file)}
                                </span>
                              </div>
                              <p className="text-sm font-medium text-foreground line-clamp-2">
                                {result.title}
                              </p>
                              {result.section_header && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                                  {result.section_header}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyContent(result.content);
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="xl:col-span-8 border border-border overflow-hidden">
                <CardHeader className="pb-3 border-b border-border">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle className="text-base truncate">
                        {selectedCase ? selectedCase.title : "Select a case to preview PDF"}
                      </CardTitle>
                      {selectedCase && (
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {formatFileName(selectedCase.source_file)}
                        </p>
                      )}
                    </div>
                    {selectedCase && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadPDF(selectedCase.title, selectedCase.document_id)}
                        disabled={isGeneratingPDF}
                      >
                        {isGeneratingPDF ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="w-4 h-4 mr-2" />
                        )}
                        {isGeneratingPDF ? "Generating PDF..." : "Download"}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0 h-[70vh] bg-muted/20">
                  {!selectedCase ? (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
                      Click any case on the left to render its PDF here.
                    </div>
                  ) : isLoadingCasePdf ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading PDF preview...
                      </div>
                    </div>
                  ) : casePdfError ? (
                    <div className="h-full flex items-center justify-center px-4">
                      <Alert variant="destructive" className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{casePdfError}</AlertDescription>
                      </Alert>
                    </div>
                  ) : selectedCasePdfUrl ? (
                    <iframe
                      src={selectedCasePdfUrl}
                      className="w-full h-full border-0"
                      title={selectedCase.title}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      PDF preview unavailable.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
 </div>
 </div>
)}
 </TabsContent>

 <TabsContent value="history" className="space-y-6 mt-6">
 <LegalResearchHistory />
 </TabsContent>
 </Tabs>
 </div>
 );
} 
