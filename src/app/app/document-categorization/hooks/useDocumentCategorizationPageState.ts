"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { getUserFacingError } from "@/lib/apiClientErrors";
import documentCategorizationApi, {
  type DocumentCategorizationResponse,
} from "@/lib/documentCategorizationApi";
import {
  type HistoryListItem,
  formatFileSize,
  groupHistoryByDate,
  isAcceptedFile,
  MAX_FILE_SIZE,
} from "../lib/documentCategorizationUtils";

export type ViewMode = "upload" | "file-selection" | "categorizing" | "results";

export function useDocumentCategorizationPageState() {
  const { getAuthHeaders } = useAuth();

  const [historyItems, setHistoryItems] = useState<HistoryListItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [multiLabel, setMultiLabel] = useState(true);
  const [confidenceThresholdPct, setConfidenceThresholdPct] = useState(80);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");

  const [processing, setProcessing] = useState(false);
  const [categorizeError, setCategorizeError] = useState<string | null>(null);

  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);
  const [categorizationResult, setCategorizationResult] =
    useState<DocumentCategorizationResponse | null>(null);
  const [resultsLoading, setResultsLoading] = useState(false);

  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");
  const [documentModalFilename, setDocumentModalFilename] = useState("");
  const [documentModalType, setDocumentModalType] = useState("");
  const [documentModalSize, setDocumentModalSize] = useState(0);

  const groupedHistory = useMemo(() => groupHistoryByDate(historyItems), [historyItems]);

  const viewMode: ViewMode = useMemo(() => {
    if (processing) return "categorizing";
    if (categorizationResult) return "results";
    if (localFiles.length > 0) return "file-selection";
    return "upload";
  }, [processing, categorizationResult, localFiles.length]);

  const categoryCount = categorizationResult
    ? Object.keys(categorizationResult.summary).length
    : 0;

  const sessionLabel = useMemo(() => {
    if (!activeRequestId) return "New Session";
    const item = historyItems.find((h) => h.request_id === activeRequestId);
    if (item) {
      return new Date(item.created_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return `Session ${activeRequestId.slice(0, 8)}`;
  }, [activeRequestId, historyItems]);

  const getAuthToken = useCallback(() => {
    const headers = getAuthHeaders();
    return headers.Authorization?.replace("Bearer ", "") || "";
  }, [getAuthHeaders]);

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const token = getAuthToken();
      const data = await documentCategorizationApi.getCategorizationHistory(token, 1, 50);
      setHistoryItems(data.categorizations);
    } catch (err) {
      console.error("Failed to load categorization history:", err);
    } finally {
      setHistoryLoading(false);
    }
  }, [getAuthToken]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const resetToNewSession = useCallback(() => {
    setLocalFiles([]);
    setCategorizeError(null);
    setCategorizationResult(null);
    setActiveRequestId(null);
    setProcessing(false);
    setCategoryInput("");
  }, []);

  const validateAndMergeFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    const keys = new Set(localFiles.map((f) => f.name + f.size));
    const merged = [...localFiles];
    for (const file of arr) {
      if (!isAcceptedFile(file)) {
        toast({
          title: "Unsupported file",
          description: `${file.name} is not supported. Use PDF, DOC, DOCX, TXT, or RTF.`,
          variant: "destructive",
        });
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: "File too large",
          description: `${file.name} exceeds the 50MB limit.`,
          variant: "destructive",
        });
        continue;
      }
      const key = file.name + file.size;
      if (!keys.has(key)) {
        keys.add(key);
        merged.push(file);
      }
    }
    setLocalFiles(merged);
    setCategorizeError(null);
  }, [localFiles]);

  const handleRemoveLocalFile = useCallback((index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleAddCategory = useCallback(
    (value: string) => {
      const trimmed = value.trim();
      if (!trimmed) return;
      if (customCategories.includes(trimmed)) return;
      setCustomCategories((prev) => [...prev, trimmed]);
      setCategoryInput("");
    },
    [customCategories]
  );

  const handleRemoveCategory = useCallback((category: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== category));
  }, []);

  const handleProceedAndCategorize = useCallback(async () => {
    if (localFiles.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one document to categorize.",
        variant: "destructive",
      });
      return;
    }

    setProcessing(true);
    setCategorizeError(null);
    setCategorizationResult(null);

    try {
      const token = getAuthToken();
      const result = await documentCategorizationApi.categorizeDocuments(
        {
          files: localFiles,
          multi_label: multiLabel,
          confidence_threshold: confidenceThresholdPct / 100,
          categories: customCategories.length > 0 ? customCategories : undefined,
        },
        token
      );

      setCategorizationResult(result);
      setActiveRequestId(result.request_id);
      void loadHistory();

      toast({
        title: "Categorization complete",
        description: `Successfully categorized ${result.total_documents} document(s).`,
      });
    } catch (err) {
      const msg = getUserFacingError(err, "Could not categorize your documents. Please try again.");
      setCategorizeError(msg);
      toast({ title: "Categorization failed", description: msg, variant: "destructive" });
    } finally {
      setProcessing(false);
    }
  }, [
    localFiles,
    multiLabel,
    confidenceThresholdPct,
    customCategories,
    getAuthToken,
    loadHistory,
  ]);

  const handleSelectHistoryItem = useCallback(
    async (item: HistoryListItem) => {
      setResultsLoading(true);
      setCategorizeError(null);
      setActiveRequestId(item.request_id);
      setLocalFiles([]);

      try {
        const token = getAuthToken();
        const result = await documentCategorizationApi.getCategorizationResult(
          item.request_id,
          token
        );
        setCategorizationResult(result);
        setHistoryItems((prev) =>
          prev.map((h) =>
            h.request_id === item.request_id
              ? { ...h, category_count: Object.keys(result.summary).length }
              : h
          )
        );
      } catch (err) {
        const msg = getUserFacingError(err, "Could not load this categorization. Please try again.");
        setCategorizeError(msg);
        toast({ title: "Load failed", description: msg, variant: "destructive" });
      } finally {
        setResultsLoading(false);
      }
    },
    [getAuthToken]
  );

  const handleViewLocalFile = useCallback((filename: string) => {
    const file = localFiles.find((f) => f.name === filename);
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDocumentUrl(url);
    setDocumentModalFilename(file.name);
    setDocumentModalType(file.type);
    setDocumentModalSize(file.size);
    setDocumentModalOpen(true);
  }, [localFiles]);

  const handleDownloadLocalFile = useCallback((filename: string) => {
    const file = localFiles.find((f) => f.name === filename);
    if (!file) return;
    const url = URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, [localFiles]);

  const handleCloseDocumentModal = useCallback(() => {
    setDocumentModalOpen(false);
    if (documentUrl) {
      window.URL.revokeObjectURL(documentUrl);
      setDocumentUrl("");
    }
  }, [documentUrl]);

  const resultFilenames = useMemo(
    () => categorizationResult?.categorization_results.map((r) => r.filename) ?? [],
    [categorizationResult]
  );

  const resultFileItems = useMemo(() => {
    return resultFilenames.map((name) => {
      const local = localFiles.find((f) => f.name === name);
      return {
        name,
        size: local ? formatFileSize(local.size) : undefined,
        hasLocalFile: !!local,
      };
    });
  }, [resultFilenames, localFiles]);

  return {
    groupedHistory,
    historyLoading,
    activeRequestId,
    localFiles,
    multiLabel,
    setMultiLabel,
    confidenceThresholdPct,
    setConfidenceThresholdPct,
    customCategories,
    categoryInput,
    setCategoryInput,
    handleAddCategory,
    handleRemoveCategory,
    processing,
    categorizeError,
    categorizationResult,
    resultsLoading,
    viewMode,
    categoryCount,
    sessionLabel,
    resultFileItems,
    documentModalOpen,
    documentUrl,
    documentModalFilename,
    documentModalType,
    documentModalSize,
    resetToNewSession,
    validateAndMergeFiles,
    handleRemoveLocalFile,
    handleProceedAndCategorize,
    handleSelectHistoryItem,
    handleViewLocalFile,
    handleDownloadLocalFile,
    handleCloseDocumentModal,
    loadHistory,
  };
}
