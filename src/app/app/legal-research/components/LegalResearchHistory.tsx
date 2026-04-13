"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
 Loader2,
 AlertCircle,
 CheckCircle,
 X,
 RefreshCw,
 BookOpen,
 Target,
 Award,
 Lightbulb,
 Sparkles,
 Zap,
 Users,
 FileText as FileTextIcon
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
 resolveLegalResearchPdfDocumentId,
 AISummaryResponse,
 DocumentResponse,
 SearchResult,
} from "@/lib/legalResearchApi";
import SimpleMarkdownRenderer from "../../../../components/SimpleMarkdownRenderer";
import { toast } from '@/hooks/use-toast';
import { normalizeContentLineBreaks, parseBoldText, cn } from "@/lib/utils";

interface LegalResearchHistoryProps {
 // No props needed since we removed the "Use This" functionality
}

export default function LegalResearchHistory({}: LegalResearchHistoryProps) {
 const { getAuthHeaders, refreshToken } = useAuth();
 const [history, setHistory] = useState<LegalResearchHistoryItem[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [searchQuery, setSearchQuery] = useState("");
 const [filterType, setFilterType] = useState<"all" | "general" | "specific">("all");
 const [selectedResearch, setSelectedResearch] = useState<LegalResearchHistoryItem | null>(null);
 const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
 const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
 const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
 const [isLoadingDocument, setIsLoadingDocument] = useState(false);
 const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
 const [selectedHistoryCase, setSelectedHistoryCase] = useState<SearchResult | null>(null);
 const [selectedHistoryCasePdfUrl, setSelectedHistoryCasePdfUrl] = useState<string | null>(null);
 const [isLoadingHistoryCasePdf, setIsLoadingHistoryCasePdf] = useState(false);
 const [historyCasePdfError, setHistoryCasePdfError] = useState<string | null>(null);
 
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

 const response = await getLegalResearchHistory(params, authToken, getAuthHeaders, refreshToken);
 
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

 useEffect(() => {
 return () => {
 if (selectedHistoryCasePdfUrl) {
 window.URL.revokeObjectURL(selectedHistoryCasePdfUrl);
 }
 };
 }, [selectedHistoryCasePdfUrl]);

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
 summaryText += `Date: ${formatDate(research.created_at)}\n\n`;
 
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
 
 if (parsedData.statutory_provisions && parsedData.statutory_provisions.length > 0) {
 summaryText += `Statutory Provisions:\n`;
 parsedData.statutory_provisions.forEach((provision: string, index: number) => {
 summaryText += `${index + 1}. ${provision}\n`;
 });
 summaryText += `\n`;
 }
 
 if (parsedData.procedural_developments && parsedData.procedural_developments.length > 0) {
 summaryText += `Procedural Developments:\n`;
 parsedData.procedural_developments.forEach((development: string, index: number) => {
 summaryText += `${index + 1}. ${development}\n`;
 });
 summaryText += `\n`;
 }
 
 if (parsedData.practical_implications && parsedData.practical_implications.length > 0) {
 summaryText += `Practical Implications:\n`;
 parsedData.practical_implications.forEach((implication: string, index: number) => {
 summaryText += `${index + 1}. ${implication}\n`;
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

const handleDownloadPDF = async (documentTitle: string, result: SearchResult) => {
 const documentId = resolveLegalResearchPdfDocumentId(result);

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
 
 const blob = await downloadLegalDocumentPDF({ document_id: documentId }, authToken, getAuthHeaders, refreshToken);
 
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

const buildCaseCopyText = (result: SearchResult) => {
 const lines = [
 `Title: ${result.title || "N/A"}`,
 `Source: ${formatFileName(result.source_file)}`,
 ];
 if (result.section_header) lines.push(`Section: ${result.section_header}`);
 if (result.court_type) lines.push(`Court: ${result.court_type}`);
 if (result.year) lines.push(`Year: ${result.year}`);
 if (typeof result.similarity_score === "number") {
 lines.push(`Match: ${(result.similarity_score * 100).toFixed(1)}%`);
 }
 lines.push("", "Content:", result.content || "");
 return lines.join("\n");
};

/** History/API may omit title; avoid .replace on undefined when naming the download file */
const safePdfDownloadBasename = (documentData: DocumentResponse): string => {
 const raw = documentData.title ?? documentData.source_file ?? "document";
 const base = String(raw).replace(/[^a-z0-9]/gi, "_").toLowerCase();
 return base || "document";
};

function getAppModalPortalContainer(): HTMLElement {
 return document.getElementById("app-modal-root") ?? document.body;
}

const handleViewFullDocument = (result: SearchResult) => {
 const resolvedId = resolveLegalResearchPdfDocumentId(result);
 if (!resolvedId) {
 toast({
 title: "No document reference",
 description: "This result does not include a document id or PDF path.",
 variant: "destructive",
 });
 return;
 }

 setIsLoadingDocument(true);
 setError(null);

 const doc: DocumentResponse = {
 source_file: result.source_file,
 title: result.title,
 full_content: result.content,
 content_length: result.content.length,
 retrieval_time_ms: 0,
 };

 // Close the research Dialog first so Radix focus trap / pointer blocking does not cover the viewer.
 setIsDetailModalOpen(false);
 setCurrentDocumentId(resolvedId);

 window.setTimeout(() => {
 setSelectedDocument(doc);
 setIsLoadingDocument(false);
 toast({
 title: "Document loaded",
 description: `Retrieved ${doc.title}`,
 });
 }, 0);
};

const handleDownloadPDFFromModal = async (documentData: DocumentResponse) => {
 const resolvedDocumentId = currentDocumentId;

 if (!resolvedDocumentId) {
 toast({
 title: "Error",
 description: "Document information not found. Please try viewing the document again.",
 variant: "destructive",
 });
 return;
 }

 setIsGeneratingPDF(true);
 
 try {
 const authHeaders = getAuthHeaders();
 const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';
 
 const blob = await downloadLegalDocumentPDF({ document_id: resolvedDocumentId }, authToken, getAuthHeaders, refreshToken);
 
 const url = window.URL.createObjectURL(blob);
 const link = document.createElement('a');
 link.href = url;
 link.download = `${safePdfDownloadBasename(documentData)}.pdf`;
 document.body.appendChild(link);
 link.click();
 window.URL.revokeObjectURL(url);
 document.body.removeChild(link);

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

 const handleSelectHistoryCase = async (result: SearchResult) => {
 setSelectedHistoryCase(result);
 setHistoryCasePdfError(null);
 setIsLoadingHistoryCasePdf(true);

 try {
 const documentId = resolveLegalResearchPdfDocumentId(result);
 if (!documentId) {
 throw new Error("Document ID is missing for this result. PDF cannot be generated.");
 }

 const authHeaders = getAuthHeaders();
 const authToken = authHeaders.Authorization?.replace('Bearer ', '') || '';

 const blob = await downloadLegalDocumentPDF(
 { document_id: documentId },
 authToken,
 getAuthHeaders,
 refreshToken
 );

 const objectUrl = window.URL.createObjectURL(blob);
 setSelectedHistoryCasePdfUrl((previousUrl) => {
 if (previousUrl) {
 window.URL.revokeObjectURL(previousUrl);
 }
 return objectUrl;
 });
 } catch (err: any) {
 console.error('History case PDF preview error:', err);
 setHistoryCasePdfError(err.message || "Failed to load PDF preview.");
 toast({
 title: "Failed to load PDF",
 description: err.message || "Failed to load PDF preview.",
 variant: "destructive",
 });
 } finally {
 setIsLoadingHistoryCasePdf(false);
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
 if (score >= 0.8) return "text-primary bg-primary/10 dark:text-primary dark:bg-primary/20";
 if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
 return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
 };

 const getConfidenceColor = (score: number) => {
 if (score >= 0.8) return "text-primary bg-primary/10 dark:text-primary dark:bg-primary/20";
 if (score >= 0.6) return "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20";
 return "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20";
 };

 // Helper function to get parsed AI summary data (same as in main search page)
 const getParsedAISummaryData = (aiSummary: AISummaryResponse) => {
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

 // Filter and search history
 const filteredHistory = history.filter(item => {
 const matchesSearch = item.query.toLowerCase().includes(searchQuery.toLowerCase());
 const matchesFilter = filterType === "all" || item.search_type === filterType;
 return matchesSearch && matchesFilter;
 });

 useEffect(() => {
 if (!isDetailModalOpen || !selectedResearch) return;

 setSelectedHistoryCase(null);
 setHistoryCasePdfError(null);
 setSelectedHistoryCasePdfUrl((previousUrl) => {
 if (previousUrl) {
 window.URL.revokeObjectURL(previousUrl);
 }
 return null;
 });

 const firstResult = selectedResearch.search_results[0];
 if (firstResult) {
 handleSelectHistoryCase(firstResult);
 }
 }, [isDetailModalOpen, selectedResearch]);

 return (
   <div className="w-full space-y-6">

 {/* Search and Filter Controls */}
 <Card className="w-full">
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
 <Alert variant="destructive">
 <AlertCircle className="h-4 w-4" />
 <AlertDescription>{error}</AlertDescription>
 </Alert>
 )}

 {/* History List */}
 <div className="space-y-4">
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
 <DialogContent className="app-shell max-w-7xl h-[90vh] flex flex-col p-0 bg-background text-foreground border-border">
 <DialogHeader className="flex-shrink-0 p-6 pb-4 border-b border-border">
 <DialogTitle className="flex items-center gap-2 text-foreground">
 <BookOpen className="w-5 h-5 text-primary" />
 Legal Research Analysis
 </DialogTitle>
 </DialogHeader>
 
 {selectedResearch && (
 <div className="flex flex-col flex-1 overflow-hidden">
 <div className="flex-1 overflow-y-auto px-6 pb-6">
 <div className="space-y-6">
 {/* Search Query Header */}
 <Card className="bg-card border-border">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-foreground">
 <Search className="w-5 h-5 text-primary" />
 Search Query
 </CardTitle>
 </CardHeader>
 <CardContent>
 <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-card dark:to-primary/10 rounded-lg p-4 border border-border">
 <div className="flex items-center justify-between mb-3">
 <h3 className="text-lg font-semibold text-foreground">{selectedResearch.query}</h3>
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
 </div>
 </div>
 </CardContent>
 </Card>

 {/* AI Summary */}
 {selectedResearch.ai_summary && (
<Card className="border border-border shadow-lg bg-card">
<CardHeader className="bg-primary/5 dark:bg-primary/10 rounded-t-lg border-b border-border">
<div className="flex items-center justify-between">
<CardTitle className="flex items-center gap-3 text-xl text-foreground">
<div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
<Brain className="w-5 h-5 text-primary-foreground" />
</div>
<span>AI Summary</span>
</CardTitle>
</div>
</CardHeader>
 <CardContent className="space-y-6">
 {(() => {
 const parsedData = getParsedAISummaryData(selectedResearch.ai_summary);
 return (
 <>
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 </div>
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleCopyContent(parsedData.ai_summary)}
className="mt-1"
 >
 <Copy className="w-4 h-4 mr-2" />
 Copy Summary
 </Button>
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleDownloadSummary(selectedResearch, parsedData)}
className="mt-1"
 >
 <Download className="w-4 h-4 mr-2" />
 Download Summary
 </Button>
 </div>
 </div>

<div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-border">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
<Sparkles className="w-4 h-4 text-primary-foreground" />
</div>
<h3 className="font-bold text-lg text-foreground">Summary</h3>
 </div>
 <div className="text-sm leading-relaxed text-foreground">
   {(() => {
     let textToShow = parsedData.ai_summary;
     if (parsedData.ai_summary === selectedResearch.ai_summary.ai_summary && selectedResearch.ai_summary.ai_summary.includes('"ai_summary"')) {
       try {
         const match = selectedResearch.ai_summary.ai_summary.match(/"ai_summary":\s*"([^"]+)"/);
         if (match) textToShow = match[1];
       } catch (e) {
         console.error('Failed to extract summary text:', e);
       }
     }
     const normalized = normalizeContentLineBreaks(textToShow);
     return (
       <SimpleMarkdownRenderer
         content={normalized}
         className="text-sm leading-relaxed max-w-none"
       />
     );
   })()}
 </div>
 </div>

{parsedData.key_legal_insights && parsedData.key_legal_insights.length > 0 && (
<div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-border">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
<Lightbulb className="w-4 h-4 text-primary-foreground" />
</div>
<h3 className="font-bold text-lg text-foreground">Key Legal Insights</h3>
 </div>
 <div className="space-y-3">
 {parsedData.key_legal_insights.map((insight, index) => (
<div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
<div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
<span className="text-sm leading-relaxed text-foreground flex-1">{parseBoldText(insight)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {parsedData.relevant_precedents && parsedData.relevant_precedents.length > 0 && (
<div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md">
<Award className="w-4 h-4 text-white" />
</div>
<h3 className="font-bold text-lg text-foreground">Relevant Precedents</h3>
 </div>
 <div className="space-y-3">
 {parsedData.relevant_precedents.map((precedent, index) => (
<div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-orange-100 dark:border-orange-900/50 hover:shadow-md transition-shadow">
<div className="w-2.5 h-2.5 bg-orange-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
<span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">{parseBoldText(precedent)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {parsedData.statutory_provisions && parsedData.statutory_provisions.length > 0 && (
<div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-xl p-6 border-2 border-indigo-200 dark:border-indigo-800">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
<BookOpen className="w-4 h-4 text-white" />
</div>
<h3 className="font-bold text-lg text-foreground">Statutory Provisions</h3>
 </div>
 <div className="space-y-3">
 {parsedData.statutory_provisions.map((provision, index) => (
<div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-indigo-100 dark:border-indigo-900/50 hover:shadow-md transition-shadow">
<div className="w-2.5 h-2.5 bg-indigo-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
<span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">{parseBoldText(provision)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {parsedData.procedural_developments && parsedData.procedural_developments.length > 0 && (
<div className="bg-muted/50 rounded-xl p-6 border border-border">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
<Zap className="w-4 h-4 text-primary-foreground" />
</div>
<h3 className="font-bold text-lg text-foreground">Procedural Developments</h3>
 </div>
 <div className="space-y-3">
 {parsedData.procedural_developments.map((development, index) => (
<div key={index} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border hover:shadow-md transition-shadow">
<div className="w-2.5 h-2.5 bg-primary rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
<span className="text-sm leading-relaxed text-foreground flex-1">{parseBoldText(development)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {parsedData.practical_implications && parsedData.practical_implications.length > 0 && (
<div className="bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20 rounded-xl p-6 border-2 border-rose-200 dark:border-rose-800">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-pink-600 rounded-lg flex items-center justify-center shadow-md">
<Users className="w-4 h-4 text-white" />
</div>
<h3 className="font-bold text-lg text-foreground">Practical Implications</h3>
 </div>
 <div className="space-y-3">
 {parsedData.practical_implications.map((implication, index) => (
<div key={index} className="flex items-start gap-4 p-4 bg-white/70 dark:bg-gray-800/70 rounded-lg border border-rose-100 dark:border-rose-900/50 hover:shadow-md transition-shadow">
<div className="w-2.5 h-2.5 bg-rose-500 rounded-full mt-2 flex-shrink-0 shadow-sm"></div>
<span className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 flex-1">{parseBoldText(implication)}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {parsedData.legal_areas_covered && parsedData.legal_areas_covered.length > 0 && (
<div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-6 border border-border">
<div className="flex items-center gap-2 mb-4">
 <Target className="w-5 h-5 text-primary" />
 <h3 className="font-semibold text-lg text-foreground">Legal Areas Covered</h3>
 </div>
 <div className="flex flex-wrap gap-2">
 {parsedData.legal_areas_covered.map((area, index) => (
<Badge key={index} variant="secondary" className="bg-primary/20 text-foreground px-3 py-1">
 {parseBoldText(area)}
 </Badge>
 ))}
 </div>
 </div>
 )}

 {/* Sources Analyzed */}
 {selectedResearch.ai_summary.sources_analyzed && selectedResearch.ai_summary.sources_analyzed.length > 0 && (
<div className="bg-muted/50 rounded-xl p-6 border border-border">
<div className="flex items-center gap-3 mb-5">
<div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center shadow-md border border-border">
<FileText className="w-4 h-4 text-muted-foreground" />
</div>
<h3 className="font-bold text-lg text-foreground">Sources Analyzed</h3>
<Badge variant="secondary" className="ml-auto">
{selectedResearch.ai_summary.sources_analyzed.length} {selectedResearch.ai_summary.sources_analyzed.length === 1 ? 'source' : 'sources'}
</Badge>
 </div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
 {selectedResearch.ai_summary.sources_analyzed.map((source, index) => (
<div key={index} className="flex items-center gap-2 text-sm text-foreground bg-white/70 dark:bg-gray-800/70 rounded-lg px-4 py-3 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
<FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
 {formatFileName(source)}
 </div>
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
 <Card className="bg-card border-border">
 <CardHeader>
 <CardTitle className="flex items-center gap-2 text-foreground">
 <FileText className="w-5 h-5 text-primary" />
 Search Results ({selectedResearch.search_results.length})
 </CardTitle>
 </CardHeader>
 <CardContent>
 {selectedResearch.search_results.length === 0 ? (
 <Card className="border border-border">
 <CardContent className="pt-10 pb-10 text-center">
 <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
 <Search className="w-8 h-8 text-muted-foreground" />
 </div>
 <h3 className="text-lg font-semibold mb-2 text-foreground">No results found</h3>
 <p className="text-muted-foreground">No case results are available in this history item.</p>
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
 {selectedResearch.search_results.map((result, index) => {
 const isSelected = selectedHistoryCase?.source_file === result.source_file;
 return (
 <button
 key={`${resolveLegalResearchPdfDocumentId(result) || result.source_file}-${index}`}
 type="button"
 onClick={() => handleSelectHistoryCase(result)}
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
                              <div className="mt-1 flex flex-wrap items-center gap-2">
                                {result.section_header && (
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {result.section_header}
                                  </p>
                                )}
                                {typeof result.similarity_score === "number" && (
                                  <Badge
                                    variant="secondary"
                                    className={`text-[10px] ${getSimilarityColor(result.similarity_score)}`}
                                  >
                                    {(result.similarity_score * 100).toFixed(1)}%
                                  </Badge>
                                )}
                                {result.court_type && (
                                  <Badge variant="outline" className="text-[10px]">
                                    {result.court_type}
                                  </Badge>
                                )}
                                {result.year && (
                                  <Badge variant="outline" className="text-[10px]">
                                    {result.year}
                                  </Badge>
                                )}
                              </div>
 </div>
 <Button
 variant="ghost"
 size="sm"
 onClick={(e) => {
 e.stopPropagation();
 handleCopyContent(buildCaseCopyText(result));
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
 {selectedHistoryCase ? selectedHistoryCase.title : "Select a case to preview PDF"}
 </CardTitle>
 {selectedHistoryCase && (
 <p className="text-xs text-muted-foreground mt-1 truncate">
 {formatFileName(selectedHistoryCase.source_file)}
 </p>
 )}
                      {selectedHistoryCase && (
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          {selectedHistoryCase.section_header && (
                            <Badge variant="outline" className="text-[10px]">
                              {selectedHistoryCase.section_header}
                            </Badge>
                          )}
                          {typeof selectedHistoryCase.similarity_score === "number" && (
                            <Badge
                              variant="secondary"
                              className={`text-[10px] ${getSimilarityColor(selectedHistoryCase.similarity_score)}`}
                            >
                              Match {(selectedHistoryCase.similarity_score * 100).toFixed(1)}%
                            </Badge>
                          )}
                          {selectedHistoryCase.court_type && (
                            <Badge variant="outline" className="text-[10px]">
                              {selectedHistoryCase.court_type}
                            </Badge>
                          )}
                          {selectedHistoryCase.year && (
                            <Badge variant="outline" className="text-[10px]">
                              {selectedHistoryCase.year}
                            </Badge>
                          )}
                        </div>
                      )}
 </div>
 {selectedHistoryCase && (
 <div className="flex items-center gap-2">
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleDownloadPDF(selectedHistoryCase.title || "legal_research", selectedHistoryCase)}
 disabled={isGeneratingPDF}
 >
 {isGeneratingPDF ? (
 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
 ) : (
 <Download className="w-4 h-4 mr-2" />
 )}
 {isGeneratingPDF ? "Generating PDF..." : "Download"}
 </Button>
 </div>
 )}
 </div>
 </CardHeader>
 <CardContent className="p-0 h-[70vh] bg-muted/20">
 {!selectedHistoryCase ? (
 <div className="h-full flex items-center justify-center text-sm text-muted-foreground px-4 text-center">
 Click any case on the left to render its PDF here.
 </div>
 ) : isLoadingHistoryCasePdf ? (
 <div className="h-full flex items-center justify-center">
 <div className="flex items-center gap-2 text-sm text-muted-foreground">
 <Loader2 className="w-4 h-4 animate-spin" />
 Loading PDF preview...
 </div>
 </div>
 ) : historyCasePdfError ? (
 <div className="h-full flex items-center justify-center px-4">
 <Alert variant="destructive" className="max-w-md">
 <AlertCircle className="h-4 w-4" />
 <AlertDescription>{historyCasePdfError}</AlertDescription>
 </Alert>
 </div>
 ) : selectedHistoryCasePdfUrl ? (
 <iframe
 src={selectedHistoryCasePdfUrl}
 className="w-full h-full border-0"
 title={selectedHistoryCase.title || "Case PDF preview"}
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
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 )}
 </DialogContent>
 </Dialog>

 {/* Document viewer: portal to app-modal-root (same as Dialog) so theme tokens match app-shell */}
 {typeof document !== "undefined" &&
 selectedDocument &&
 createPortal(
 <div
 className={cn(
 "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4",
 "animate-in fade-in-0 duration-200"
 )}
 role="dialog"
 aria-modal="true"
 aria-labelledby="legal-research-doc-viewer-title"
 onClick={(e) => {
 if (e.target === e.currentTarget) {
 setSelectedDocument(null);
 setCurrentDocumentId(null);
 }
 }}
 >
 <div
 className={cn(
 "app-shell bg-background text-foreground flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden",
 "border border-border shadow-lg sm:rounded-lg",
 "animate-in fade-in-0 zoom-in-95 duration-200"
 )}
 onClick={(e) => e.stopPropagation()}
 >
 {/* Modal Header */}
 <div className="flex items-center justify-between border-b border-border p-6">
 <div className="min-w-0 flex-1">
 <h2
 id="legal-research-doc-viewer-title"
 className="truncate text-xl font-semibold leading-none tracking-tight text-foreground"
 >
 {selectedDocument.title ?? selectedDocument.source_file ?? "Document"}
 </h2>
 <p className="text-sm text-muted-foreground mt-1">
 {selectedDocument.source_file} • {selectedDocument.content_length} characters
 </p>
 </div>
 <div className="flex items-center gap-2 ml-4">
 <Button
 variant="outline"
 size="sm"
 onClick={() => handleDownloadPDFFromModal(selectedDocument)}
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
 <div className="bg-muted/50 rounded-lg p-6 border border-border">
 <SimpleMarkdownRenderer 
 content={normalizeContentLineBreaks(selectedDocument.full_content)} 
 className="text-sm leading-relaxed max-w-none"
 />
 </div>
 </div>
 </div>
 </div>,
 getAppModalPortalContainer()
 )}
 </div>
 );
}
