"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import {
  searchLegalResearch,
  downloadLegalDocumentPDF,
  resolveLegalResearchPdfDocumentId,
  getLegalResearchHistory,
  LegalResearchRequest,
  LegalResearchResponse,
  LegalResearchHistoryItem,
  SearchResult,
  AISummaryResponse,
} from "@/lib/legalResearchApi";
import { toast } from "@/hooks/use-toast";
import { getUserFacingError } from "@/lib/apiClientErrors";
import {
  buildCaseCopyText,
  buildSummaryDownloadText,
  downloadTextFile,
  formatCaseTitle,
  getParsedAISummaryData,
} from "../lib/legalResearchUtils";

export type SidebarTab = "search" | "history" | "saved";
export type SearchType = "general" | "supreme_court" | "high_court";

const MAX_QUERY_LENGTH = 1000;

export function useLegalResearchPageState() {
  const { getAuthHeaders, refreshToken } = useAuth();

  const [sidebarTab, setSidebarTab] = useState<SidebarTab>("search");
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("general");
  const [topK, setTopK] = useState(5);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LegalResearchResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<SearchResult | null>(null);
  const [selectedCasePdfUrl, setSelectedCasePdfUrl] = useState<string | null>(null);
  const [isLoadingCasePdf, setIsLoadingCasePdf] = useState(false);
  const [casePdfError, setCasePdfError] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [aiSummary, setAiSummary] = useState<AISummaryResponse | null>(null);
  const [recentHistory, setRecentHistory] = useState<LegalResearchHistoryItem[]>([]);
  const [isLoadingRecentHistory, setIsLoadingRecentHistory] = useState(false);

  const revokePdfUrl = useCallback((url: string | null) => {
    if (url) window.URL.revokeObjectURL(url);
  }, []);

  const clearCasePreview = useCallback(() => {
    setSelectedCase(null);
    setSelectedCasePdfUrl((prev) => {
      revokePdfUrl(prev);
      return null;
    });
    setCasePdfError(null);
  }, [revokePdfUrl]);

  const clearSearchResults = useCallback(() => {
    setSearchResults(null);
    setAiSummary(null);
    clearCasePreview();
    setError(null);
  }, [clearCasePreview]);

  const resetToNewSearch = useCallback(() => {
    setSidebarTab("search");
    setQuery("");
    clearSearchResults();
    setIsSearching(false);
  }, [clearSearchResults]);

  const loadRecentHistory = useCallback(async () => {
    setIsLoadingRecentHistory(true);
    try {
      const authHeaders = getAuthHeaders();
      const authToken = authHeaders.Authorization?.replace("Bearer ", "") || "";
      const items = await getLegalResearchHistory(
        { limit: 6 },
        authToken,
        getAuthHeaders,
        refreshToken
      );
      setRecentHistory(items);
    } catch (err) {
      console.error("Failed to fetch recent searches:", err);
    } finally {
      setIsLoadingRecentHistory(false);
    }
  }, [getAuthHeaders, refreshToken]);

  useEffect(() => {
    loadRecentHistory();
  }, [loadRecentHistory]);

  useEffect(() => {
    return () => {
      if (selectedCasePdfUrl) revokePdfUrl(selectedCasePdfUrl);
    };
  }, [selectedCasePdfUrl, revokePdfUrl]);

  const handleSearch = useCallback(
    async (e?: React.FormEvent, overrideQuery?: string) => {
      e?.preventDefault();
      const searchQuery = (overrideQuery ?? query).trim();
      if (!searchQuery) return;
      if (searchQuery.length > MAX_QUERY_LENGTH) {
        toast({
          title: "Query too long",
          description: `Please limit your search to ${MAX_QUERY_LENGTH} characters.`,
          variant: "destructive",
        });
        return;
      }

      setSidebarTab("search");
      if (overrideQuery) setQuery(overrideQuery);
      clearSearchResults();
      setIsSearching(true);

      try {
        const authHeaders = getAuthHeaders();
        const authToken = authHeaders.Authorization?.replace("Bearer ", "") || "";

        const searchRequest: LegalResearchRequest = {
          query: searchQuery,
          top_k: topK,
          search_type: searchType,
          summary_type: "comprehensive",
          max_summary_length: 1500,
          include_ai_summary: true,
        };

        const searchResponse = await searchLegalResearch(
          searchRequest,
          authToken,
          getAuthHeaders,
          refreshToken
        );
        setSearchResults(searchResponse);
        if (searchResponse.ai_summary) {
          setAiSummary(searchResponse.ai_summary);
        }
        void loadRecentHistory();
        toast({
          title: "Search completed",
          description: `Found ${searchResponse.total_results} results${
            searchResponse.ai_summary ? " and generated AI summary" : ""
          }`,
        });
      } catch (err: unknown) {
        const message = getUserFacingError(err, "Could not complete this search. Please try again.");
        setError(message);
        toast({ title: "Search failed", description: message, variant: "destructive" });
      } finally {
        setIsSearching(false);
      }
    },
    [query, topK, searchType, getAuthHeaders, refreshToken, clearSearchResults, loadRecentHistory]
  );

  const handleQuickSearch = useCallback(
    (quickQuery: string) => {
      void handleSearch(undefined, quickQuery);
    },
    [handleSearch]
  );

  const handleCopyContent = useCallback(async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast({ title: "Copied to clipboard", description: "Content has been copied to your clipboard" });
    } catch {
      toast({
        title: "Copy failed",
        description: "Failed to copy content to clipboard",
        variant: "destructive",
      });
    }
  }, []);

  const handleSelectCase = useCallback(
    async (result: SearchResult) => {
      setSelectedCase(result);
      setCasePdfError(null);
      setIsLoadingCasePdf(true);

      try {
        const documentId = resolveLegalResearchPdfDocumentId(result);
        if (!documentId) {
          throw new Error("Document ID is missing for this result. PDF cannot be generated.");
        }
        const authHeaders = getAuthHeaders();
        const authToken = authHeaders.Authorization?.replace("Bearer ", "") || "";
        const blob = await downloadLegalDocumentPDF(
          { document_id: documentId },
          authToken,
          getAuthHeaders,
          refreshToken
        );
        const objectUrl = window.URL.createObjectURL(blob);
        setSelectedCasePdfUrl((previousUrl) => {
          revokePdfUrl(previousUrl);
          return objectUrl;
        });
      } catch (err: unknown) {
        const message = getUserFacingError(err, "Could not load the PDF preview. Please try again.");
        setCasePdfError(message);
        toast({ title: "Failed to load PDF", description: message, variant: "destructive" });
      } finally {
        setIsLoadingCasePdf(false);
      }
    },
    [getAuthHeaders, refreshToken, revokePdfUrl]
  );

  const handleDownloadPDF = useCallback(
    async (documentTitle: string, result: SearchResult) => {
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
        const authToken = authHeaders.Authorization?.replace("Bearer ", "") || "";
        const blob = await downloadLegalDocumentPDF(
          { document_id: documentId },
          authToken,
          getAuthHeaders,
          refreshToken
        );
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${documentTitle.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        toast({ title: "PDF downloaded", description: "Original PDF document has been downloaded" });
      } catch (err: unknown) {
        toast({
          title: "PDF download failed",
          description: getUserFacingError(err, "Could not download the PDF. Please try again."),
          variant: "destructive",
        });
      } finally {
        setIsGeneratingPDF(false);
      }
    },
    [getAuthHeaders, refreshToken]
  );

  const handleDownloadSummary = useCallback(() => {
    if (!aiSummary || !searchResults) return;
    const parsedData = getParsedAISummaryData(aiSummary);
    const text = buildSummaryDownloadText(
      searchResults.query,
      searchType,
      searchResults.total_results,
      parsedData
    );
    const filename = `legal_research_summary_${searchResults.query.replace(/[^a-z0-9]/gi, "_").toLowerCase()}.txt`;
    downloadTextFile(text, filename);
    toast({ title: "Summary downloaded", description: "AI summary has been downloaded as text file" });
  }, [aiSummary, searchResults, searchType]);

  const clearFilters = useCallback(() => {
    setSearchType("general");
    setTopK(5);
  }, []);

  const quickSearchQueries = recentHistory
    .map((item) => item.query.trim())
    .filter(Boolean)
    .filter((q, i, arr) => arr.indexOf(q) === i)
    .slice(0, 4);

  return {
    sidebarTab,
    setSidebarTab,
    query,
    setQuery,
    searchType,
    setSearchType,
    topK,
    setTopK,
    isSearching,
    searchResults,
    error,
    selectedCase,
    selectedCasePdfUrl,
    isLoadingCasePdf,
    casePdfError,
    isGeneratingPDF,
    aiSummary,
    recentHistory,
    isLoadingRecentHistory,
    quickSearchQueries,
    maxQueryLength: MAX_QUERY_LENGTH,
    resetToNewSearch,
    handleSearch,
    handleQuickSearch,
    handleCopyContent,
    handleSelectCase,
    handleDownloadPDF,
    handleDownloadSummary,
    clearFilters,
    loadRecentHistory,
    formatCaseTitle,
    buildCaseCopyText,
    getParsedAISummaryData: () => (aiSummary ? getParsedAISummaryData(aiSummary) : null),
  };
}
