"use client";
import React, { useState } from "react";
import { Search, FileText, Clock, BookOpen, Filter, Download, Copy, AlertCircle, CheckCircle, Loader2, X, FileText as FileTextIcon, Brain, Sparkles, Target, Award, Lightbulb, Users, Zap, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useAuth } from "../../../components/AuthProvider";
import { searchLegalResearch, downloadLegalDocumentPDF, LegalResearchRequest, LegalResearchResponse, SearchResult, DocumentResponse, AISummaryResponse } from "@/lib/legalResearchApi";
import SimpleMarkdownRenderer from "../../../components/SimpleMarkdownRenderer";
import { toast } from '@/hooks/use-toast';
import { normalizeContentLineBreaks, parseBoldText } from "@/lib/utils";
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
 const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
 const [isLoadingDocument, setIsLoadingDocument] = useState(false);
 const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
 const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
 
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

 const handleSearch = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!query.trim()) return;

 // IMMEDIATELY clear all previous results before starting new search
 setSearchResults(null);
 setAiSummary(null);
 setSelectedDocument(null);
 setCurrentDocumentId(null);
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

 const handleViewFullDocument = async (documentId: string) => {
 setIsLoadingDocument(true);
 setError(null);
 
 try {
 // Try to find the document in search results
 const searchResult = searchResults?.results.find(result => result.document_id === documentId);
 
 if (searchResult) {
 // Create a DocumentResponse from the search result
 const document: DocumentResponse = {
 source_file: searchResult.source_file,
 title: searchResult.title,
 full_content: searchResult.content, // Use the content from search results
 content_length: searchResult.content.length,
 retrieval_time_ms: 0 // Not available from search results
 };
 
 setSelectedDocument(document);
 setCurrentDocumentId(documentId); // Store the document ID
 
 toast({
 title: "Document loaded",
 description: `Retrieved ${document.title}`,
 });
 } else {
 throw new Error("Document not found in search results");
 }
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
 if (!currentDocumentId) {
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
 const blob = await downloadLegalDocumentPDF({ document_id: currentDocumentId }, authToken, getAuthHeaders, refreshToken);
 
 // Create download link
 const url = window.URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `${documentData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
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

 const getConfidenceColor = (score: number) => {
 if (score >= 0.8) return "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20";
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
 <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
 <BookOpen className="w-5 h-5 text-white" />
 </div>
 <h1 className="text-2xl font-bold text-foreground">Legal Research</h1>
 </div>
 <p className="text-sm text-muted-foreground">
 Search through case law, regulations, and legal precedents
 </p>
 </div>

 {/* Tabs */}
 <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
 <TabsList className="grid w-full grid-cols-2 h-11 p-1 bg-muted/50">
 <TabsTrigger value="search" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
 <Search className="w-4 h-4" />
 Search
 </TabsTrigger>
 <TabsTrigger value="history" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
 <History className="w-4 h-4" />
 History
 </TabsTrigger>
 </TabsList>

 <TabsContent value="search" className="space-y-6 mt-6">

 {/* Search Form */}
 <Card className="w-full border-0 shadow-sm bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-900/50 dark:to-gray-900/50">
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
 className="h-14 text-base pl-12 pr-32 rounded-xl border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
 disabled={isSearching}
 />
 <Button 
 type="submit" 
 className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md"
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
 <div className="mt-6 pt-5 border-t border-slate-200 dark:border-slate-800">
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
 className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
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
 <Card>
 <CardHeader>
 <CardTitle className="flex items-center gap-2">
 <Brain className="w-5 h-5 text-purple-500" />
 AI Summary
 </CardTitle>
 </CardHeader>
 <CardContent>
 {isSearching ? (
 <div className="text-center py-8">
 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
 <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
 </div>
 <h3 className="text-lg font-semibold mb-2">Generating AI Summary...</h3>
 <p className="text-muted-foreground">
 Analyzing search results and creating intelligent summary
 </p>
 </div>
 ) : aiSummary ? (
 <div className="space-y-6">
 {/* Summary Header */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 </div>
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleCopyContent(getParsedAISummaryData().ai_summary)}
 >
 <Copy className="w-4 h-4 mr-2" />
 Copy Summary
 </Button>
 </div>

 {/* AI Summary Content */}
 <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <Sparkles className="w-5 h-5 text-purple-500" />
 <h3 className="font-semibold text-lg">AI Summary</h3>
 </div>
 <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
 {(() => {
 const parsedData = getParsedAISummaryData();
 // Check if we got the raw JSON back (parsing failed)
 if (parsedData.ai_summary === aiSummary.ai_summary && aiSummary.ai_summary.includes('"ai_summary"')) {
 // Try to extract just the summary text from the JSON string
 try {
 const match = aiSummary.ai_summary.match(/"ai_summary":\s*"([^"]+)"/);
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

 {/* Key Legal Insights */}
 {getParsedAISummaryData().key_legal_insights && getParsedAISummaryData().key_legal_insights.length > 0 && (
 <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <Lightbulb className="w-5 h-5 text-green-500" />
 <h3 className="font-semibold text-lg">Key Legal Insights</h3>
 </div>
 <div className="space-y-3">
 {getParsedAISummaryData().key_legal_insights.map((insight: string, index: number) => (
 <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
 <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
 <span className="text-sm text-gray-700 dark:text-gray-300">{parseBoldText(insight)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Relevant Precedents */}
 {getParsedAISummaryData().relevant_precedents && getParsedAISummaryData().relevant_precedents.length > 0 && (
 <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <Award className="w-5 h-5 text-orange-500" />
 <h3 className="font-semibold text-lg">Relevant Precedents</h3>
 </div>
 <div className="space-y-3">
 {getParsedAISummaryData().relevant_precedents.map((precedent: string, index: number) => (
 <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
 <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
 <span className="text-sm text-gray-700 dark:text-gray-300">{parseBoldText(precedent)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Statutory Provisions */}
 {getParsedAISummaryData().statutory_provisions && getParsedAISummaryData().statutory_provisions.length > 0 && (
 <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <BookOpen className="w-5 h-5 text-indigo-500" />
 <h3 className="font-semibold text-lg">Statutory Provisions</h3>
 </div>
 <div className="space-y-3">
 {getParsedAISummaryData().statutory_provisions.map((provision: string, index: number) => (
 <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
 <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
 <span className="text-sm text-gray-700 dark:text-gray-300">{parseBoldText(provision)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Procedural Developments */}
 {getParsedAISummaryData().procedural_developments && getParsedAISummaryData().procedural_developments.length > 0 && (
 <div className="bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-950/20 dark:to-cyan-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <Zap className="w-5 h-5 text-teal-500" />
 <h3 className="font-semibold text-lg">Procedural Developments</h3>
 </div>
 <div className="space-y-3">
 {getParsedAISummaryData().procedural_developments.map((development: string, index: number) => (
 <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
 <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
 <span className="text-sm text-gray-700 dark:text-gray-300">{parseBoldText(development)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Practical Implications */}
 {getParsedAISummaryData().practical_implications && getParsedAISummaryData().practical_implications.length > 0 && (
 <div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <Users className="w-5 h-5 text-rose-500" />
 <h3 className="font-semibold text-lg">Practical Implications</h3>
 </div>
 <div className="space-y-3">
 {getParsedAISummaryData().practical_implications.map((implication: string, index: number) => (
 <div key={index} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg border">
 <div className="w-2 h-2 bg-rose-500 rounded-full mt-2 flex-shrink-0"></div>
 <span className="text-sm text-gray-700 dark:text-gray-300">{parseBoldText(implication)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Legal Areas Covered */}
 {getParsedAISummaryData().legal_areas_covered && getParsedAISummaryData().legal_areas_covered.length > 0 && (
 <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <Target className="w-5 h-5 text-blue-500" />
 <h3 className="font-semibold text-lg">Legal Areas Covered</h3>
 </div>
 <div className="flex flex-wrap gap-2">
 {getParsedAISummaryData().legal_areas_covered.map((area: string, index: number) => (
 <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 px-3 py-1">
 {area}
 </Badge>
 ))}
 </div>
 </div>
 )}

 {/* Sources Analyzed */}
 {aiSummary.sources_analyzed && aiSummary.sources_analyzed.length > 0 && (
 <div className="bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 rounded-lg p-6 border">
 <div className="flex items-center gap-2 mb-4">
 <FileText className="w-5 h-5 text-gray-500" />
 <h3 className="font-semibold text-lg">Sources Analyzed</h3>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
 {aiSummary.sources_analyzed.map((source, index) => (
 <div key={index} className="text-sm text-muted-foreground bg-white dark:bg-gray-800 rounded px-3 py-2 border">
 {formatFileName(source)}
 </div>
 ))}
 </div>
 </div>
 )}


 </div>
 ) : (
 <div className="text-center py-8">
 <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
 <Brain className="w-8 h-8 text-purple-500" />
 </div>
 <h3 className="text-lg font-semibold mb-2">No AI Summary Available</h3>
 <p className="text-muted-foreground">
 AI summary will be generated automatically when search results are found
 </p>
 </div>
 )}
 </CardContent>
 </Card>

 {/* Search Results */}
 <div className="space-y-4">
 <div className="flex items-center gap-2 mb-4">
 <FileText className="w-5 h-5 text-primary" />
 <h2 className="text-xl font-semibold">Search Results ({searchResults.total_results})</h2>
 </div>
 
 {/* Results List */}
 {searchResults.results.map((result, index) => (
 <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
 <CardHeader className="pb-3">
 <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
 <div className="flex-1 min-w-0">
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
 </div>
 </div>
 <div className="flex items-center gap-2 flex-shrink-0">
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
 content={normalizeContentLineBreaks(result.content)} 
 className="text-sm leading-relaxed"
 />
 </div>
 <div className="flex items-center justify-between mt-3 pt-3 border-t">
 <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

 {/* No Results */}
 {searchResults.results.length === 0 && (
 <Card>
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
 </div>
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
 onClick={() => {
 setSelectedDocument(null);
 setCurrentDocumentId(null);
 }}
 >
 <X className="w-4 h-4" />
 </Button>
 </div>
 </div>
 
 {/* Modal Content */}
 <div className="flex-1 overflow-auto p-6">
 <div className="bg-muted/50 rounded-lg p-6 border">
 <SimpleMarkdownRenderer 
 content={normalizeContentLineBreaks(selectedDocument.full_content)} 
 className="text-sm leading-relaxed max-w-none"
 />
 </div>
 </div>
 </div>
 </div>
 )}
 </TabsContent>

 <TabsContent value="history" className="space-y-6">
 <LegalResearchHistory />
 </TabsContent>
 </Tabs>
 </div>
 );
} 