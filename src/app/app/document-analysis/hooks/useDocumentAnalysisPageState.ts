"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { toast } from "@/hooks/use-toast";
import { getUserFacingError } from "@/lib/apiClientErrors";
import {
  type ChatMessage,
  type DAChat,
  type DADocument,
  type DASession,
  type SessionListItem,
  addDocumentToSession,
  createChat,
  createSession,
  deleteSessionDocument,
  downloadChatDocument,
  fetchChatDocuments,
  fetchRecentSessions,
  fetchSessionDocuments,
  fetchSessionMessages,
  messagesToChatHistory,
  sendSessionMessage,
  uploadChatDocuments,
} from "@/lib/documentAnalysisApi";
import {
  MAX_QUERY_LENGTH,
  generateChatName,
  generateSessionName,
  getProcessingLabel,
  groupSessionsByDate,
} from "../lib/documentAnalysisUtils";

export type ViewMode = "upload" | "file-selection" | "chat";

export function useDocumentAnalysisPageState() {
  const { getAuthHeaders, user } = useAuth();
  const userInitial = user?.full_name?.trim().charAt(0).toUpperCase() || "U";

  const [recentSessions, setRecentSessions] = useState<SessionListItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);

  const [activeChat, setActiveChat] = useState<DAChat | null>(null);
  const [activeSession, setActiveSession] = useState<DASession | null>(null);

  const [localFiles, setLocalFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [messagesLoading, setMessagesLoading] = useState(false);

  const [chatDocuments, setChatDocuments] = useState<DADocument[]>([]);
  const [sessionDocuments, setSessionDocuments] = useState<DADocument[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [uploadingNewDocuments, setUploadingNewDocuments] = useState(false);

  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFilename, setPdfFilename] = useState("");

  const activeChatId = activeChat?.id ?? activeSession?.chat_id ?? null;
  const activeSessionId = activeSession?.id ?? null;

  const viewMode: ViewMode = useMemo(() => {
    if (activeSession) return "chat";
    if (localFiles.length > 0) return "file-selection";
    return "upload";
  }, [activeSession, localFiles.length]);

  const groupedSessions = useMemo(
    () => groupSessionsByDate(recentSessions),
    [recentSessions]
  );

  const loadRecentSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const items = await fetchRecentSessions(getAuthHeaders);
      setRecentSessions(items);
    } catch (err) {
      console.error("Failed to load recent sessions:", err);
    } finally {
      setSessionsLoading(false);
    }
  }, [getAuthHeaders]);

  useEffect(() => {
    void loadRecentSessions();
  }, [loadRecentSessions]);

  const refreshDocuments = useCallback(
    async (chatId: string, sessionId: string) => {
      setDocumentsLoading(true);
      try {
        const chatDocs = await fetchChatDocuments(getAuthHeaders, chatId);
        setChatDocuments(chatDocs);
        const sessionDocs = await fetchSessionDocuments(
          getAuthHeaders,
          chatId,
          sessionId,
          chatDocs
        );
        setSessionDocuments(sessionDocs);
      } catch (err) {
        console.error("Failed to refresh documents:", err);
      } finally {
        setDocumentsLoading(false);
      }
    },
    [getAuthHeaders]
  );

  useEffect(() => {
    if (!activeChatId || !activeSessionId) return;
    const hasProcessing = [...chatDocuments, ...sessionDocuments].some((d) =>
      getProcessingLabel(d.processing_status)
    );
    if (!hasProcessing && !uploadingNewDocuments) return;

    const interval = setInterval(() => {
      void refreshDocuments(activeChatId, activeSessionId);
    }, 3000);
    return () => clearInterval(interval);
  }, [
    activeChatId,
    activeSessionId,
    chatDocuments,
    sessionDocuments,
    uploadingNewDocuments,
    refreshDocuments,
  ]);

  const resetToNewSession = useCallback(() => {
    setActiveChat(null);
    setActiveSession(null);
    setLocalFiles([]);
    setUploadError(null);
    setChatMessages([]);
    setChatInput("");
    setChatError(null);
    setChatDocuments([]);
    setSessionDocuments([]);
  }, []);

  const handleSelectFiles = useCallback((files: FileList | File[]) => {
    const arr = Array.from(files);
    if (arr.length === 0) return;
    setUploadError(null);
    setLocalFiles((prev) => {
      const names = new Set(prev.map((f) => f.name + f.size));
      const merged = [...prev];
      for (const f of arr) {
        if (!names.has(f.name + f.size)) merged.push(f);
      }
      return merged;
    });
  }, []);

  const handleRemoveLocalFile = useCallback((index: number) => {
    setLocalFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleProceedAndUpload = useCallback(async () => {
    if (localFiles.length === 0) return;
    setUploading(true);
    setUploadError(null);
    try {
      const chat = await createChat(getAuthHeaders, generateChatName());
      const uploadResult = await uploadChatDocuments(getAuthHeaders, chat.id, localFiles);
      if (!uploadResult.total_uploaded || uploadResult.total_uploaded === 0) {
        throw new Error("Some documents could not be uploaded. Please try again with supported files.");
      }
      const uploaded = uploadResult.uploaded_documents || [];
      const session = await createSession(
        getAuthHeaders,
        chat.id,
        generateSessionName(),
        uploaded.map((d) => d.id)
      );
      setActiveChat(chat);
      setActiveSession(session);
      setLocalFiles([]);
      setChatMessages([]);
      setChatInput("");
      await refreshDocuments(chat.id, session.id);
      void loadRecentSessions();
      toast({ title: "Documents uploaded", description: "Your session is ready. Ask a question to get started." });
    } catch (err) {
      const msg = getUserFacingError(err, "Could not upload your documents. Please try again.");
      setUploadError(msg);
      toast({ title: "Upload failed", description: msg, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [getAuthHeaders, localFiles, loadRecentSessions, refreshDocuments]);

  const handleSelectSession = useCallback(
    async (item: SessionListItem) => {
      setActiveSession(item.session);
      setActiveChat({ id: item.chatId, name: item.chatName } as DAChat);
      setLocalFiles([]);
      setUploadError(null);
      setChatError(null);
      setMessagesLoading(true);
      try {
        const messages = await fetchSessionMessages(
          getAuthHeaders,
          item.chatId,
          item.session.id
        );
        setChatMessages(messagesToChatHistory(messages));
        await refreshDocuments(item.chatId, item.session.id);
      } catch (err) {
        const msg = getUserFacingError(err, "Could not load this session. Please try again.");
        setChatError(msg);
        toast({ title: "Could not load session", description: msg, variant: "destructive" });
      } finally {
        setMessagesLoading(false);
      }
    },
    [getAuthHeaders, refreshDocuments]
  );

  const handleSendMessage = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      if (!activeChatId || !activeSessionId || !chatInput.trim()) return;
      if (chatInput.length > MAX_QUERY_LENGTH) {
        toast({
          title: "Message too long",
          description: `Please limit your message to ${MAX_QUERY_LENGTH} characters.`,
          variant: "destructive",
        });
        return;
      }
      setChatError(null);
      setChatLoading(true);
      const userMsg = chatInput.trim();
      setChatInput("");
      setChatMessages((prev) => [...prev, { sender: "user", text: userMsg, time: new Date() }]);
      try {
        const data = await sendSessionMessage(
          getAuthHeaders,
          activeChatId,
          activeSessionId,
          userMsg
        );
        setChatMessages((prev) => [
          ...prev,
          {
            sender: "system",
            text: data.assistant_response,
            time: new Date(data.timestamp || Date.now()),
          },
        ]);
        setActiveSession((prev) =>
          prev
            ? {
                ...prev,
                message_count: prev.message_count + 1,
                last_activity: new Date().toISOString(),
              }
            : null
        );
        void loadRecentSessions();
      } catch (err) {
        const msg = getUserFacingError(err, "Could not send your message. Please try again.");
        setChatError(msg);
        setChatMessages((prev) => [
          ...prev,
          { sender: "system", text: `(Error) ${msg}`, time: new Date() },
        ]);
      } finally {
        setChatLoading(false);
      }
    },
    [activeChatId, activeSessionId, chatInput, getAuthHeaders, loadRecentSessions]
  );

  const handleViewDocument = useCallback(
    async (documentId: string, filename: string) => {
      if (!activeChatId) {
        toast({ title: "Cannot open document", description: "No active chat found.", variant: "destructive" });
        return;
      }
      try {
        const blob = await downloadChatDocument(getAuthHeaders, activeChatId, documentId);
        const url = window.URL.createObjectURL(blob);
        setPdfUrl(url);
        setPdfFilename(filename);
        setPdfModalOpen(true);
      } catch (err) {
        toast({
          title: "Could not open document",
          description: getUserFacingError(err, "Could not open this document. Please try again."),
          variant: "destructive",
        });
      }
    },
    [activeChatId, getAuthHeaders]
  );

  const handleDownloadDocument = useCallback(
    async (documentId: string, filename: string) => {
      if (!activeChatId) return;
      try {
        const blob = await downloadChatDocument(getAuthHeaders, activeChatId, documentId);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (err) {
        toast({
          title: "Download failed",
          description: getUserFacingError(err, "Could not download this document. Please try again."),
          variant: "destructive",
        });
      }
    },
    [activeChatId, getAuthHeaders]
  );

  const handleRemoveFromSession = useCallback(
    async (documentId: string) => {
      if (!activeChatId || !activeSessionId) return;
      if (sessionDocuments.length <= 1) {
        toast({
          title: "Cannot remove document",
          description: "At least one document must remain in session context.",
          variant: "destructive",
        });
        return;
      }
      try {
        await deleteSessionDocument(getAuthHeaders, activeChatId, activeSessionId, documentId);
        await refreshDocuments(activeChatId, activeSessionId);
        void loadRecentSessions();
        toast({ title: "Document removed", description: "Document removed from session context." });
      } catch (err) {
        toast({
          title: "Remove failed",
          description: getUserFacingError(err, "Could not remove this document. Please try again."),
          variant: "destructive",
        });
      }
    },
    [activeChatId, activeSessionId, getAuthHeaders, loadRecentSessions, refreshDocuments, sessionDocuments.length]
  );

  const handleUploadNewDocuments = useCallback(
    async (files: FileList) => {
      if (!activeChatId || !activeSessionId) return;
      setUploadingNewDocuments(true);
      try {
        const uploadResult = await uploadChatDocuments(
          getAuthHeaders,
          activeChatId,
          Array.from(files)
        );
        const uploaded = uploadResult.uploaded_documents || [];
        for (const doc of uploaded) {
          await addDocumentToSession(getAuthHeaders, activeChatId, activeSessionId, doc.id);
        }
        await refreshDocuments(activeChatId, activeSessionId);
        void loadRecentSessions();
        toast({
          title: "Documents uploaded",
          description: "New documents added to session context.",
        });
      } catch (err) {
        toast({
          title: "Upload failed",
          description: getUserFacingError(err, "Could not upload documents. Please try again."),
          variant: "destructive",
        });
      } finally {
        setUploadingNewDocuments(false);
      }
    },
    [activeChatId, activeSessionId, getAuthHeaders, loadRecentSessions, refreshDocuments]
  );

  const handleClosePdfModal = useCallback(() => {
    setPdfModalOpen(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
    setPdfFilename("");
  }, [pdfUrl]);

  return {
    userInitial,
    maxQueryLength: MAX_QUERY_LENGTH,
    viewMode,
    groupedSessions,
    sessionsLoading,
    activeSession,
    activeChatId,
    activeSessionId,
    localFiles,
    uploading,
    uploadError,
    chatMessages,
    chatInput,
    setChatInput,
    chatLoading,
    chatError,
    messagesLoading,
    chatDocuments,
    sessionDocuments,
    documentsLoading,
    uploadingNewDocuments,
    pdfModalOpen,
    pdfUrl,
    pdfFilename,
    resetToNewSession,
    handleSelectFiles,
    handleRemoveLocalFile,
    handleProceedAndUpload,
    handleSelectSession,
    handleSendMessage,
    handleViewDocument,
    handleDownloadDocument,
    handleRemoveFromSession,
    handleUploadNewDocuments,
    handleClosePdfModal,
    loadRecentSessions,
  };
}
