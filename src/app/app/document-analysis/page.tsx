"use client";
import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";
import DocumentUploader from "./DocumentUploader";
import DocumentHistoryList from "./DocumentHistoryList";
import ChatInterface from "./ChatInterface";
import PdfViewerModal from "../../../components/PdfViewerModal";
import TimelineIndicator from "../../../components/TimelineIndicator";
import CollapsibleSection from "../../../components/CollapsibleSection";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Eye, Download, MessageCircle, FileText, Check } from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface ApiResponse {
  document_id: string;
  filename: string;
  is_chunked: boolean;
  total_chunks: number;
  total_tokens: number;
  structure_analysis: string;
  file_size: number;
}

interface DocumentHistoryItem {
  document_id: string;
  filename: string;
  upload_timestamp: string;
}

interface ChatSessionItem {
  session_id: string;
  document_id: string;
  chat_id?: string;
  created_at: string;
  last_activity: string;
  message_count: number;
}

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export default function DocumentAnalysisPage() {
  const { getAuthHeaders } = useAuth();
  const [tab, setTab] = useState<'new' | 'history'>('new');
  const [processing, setProcessing] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");

  // History state
  const [documents, setDocuments] = useState<DocumentHistoryItem[]>([]);
  const [documentsLoading, setDocumentsLoading] = useState(false);
  const [documentsError, setDocumentsError] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<DocumentHistoryItem | null>(null);
  const [sessions, setSessions] = useState<ChatSessionItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [sessionsError, setSessionsError] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<ChatSessionItem | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Add pagination state
  const [page, setPage] = useState(0);
  const pageSize = 10; // You can adjust this as needed
  const [totalCount, setTotalCount] = useState(0);
  const [allDocuments, setAllDocuments] = useState<DocumentHistoryItem[]>([]);

  // Add session pagination state
  const [sessionPage, setSessionPage] = useState(0);
  const sessionPageSize = 5; // Adjust as needed
  const [sessionTotalCount, setSessionTotalCount] = useState(0);
  const [allSessions, setAllSessions] = useState<ChatSessionItem[]>([]);

  // PDF viewer state
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pdfFilename, setPdfFilename] = useState("");

  // UI state for collapsible sections
  const [documentsCollapsed, setDocumentsCollapsed] = useState(false);
  const [sessionsCollapsed, setSessionsCollapsed] = useState(false);
  const [uploadCollapsed, setUploadCollapsed] = useState(false);

  // Add state for new analysis flow
  const [newChatName, setNewChatName] = useState("");
  const [newChatDescription, setNewChatDescription] = useState("");
  const [newChatLoading, setNewChatLoading] = useState(false);
  const [newChatError, setNewChatError] = useState<string | null>(null);
  const [newChatSuccess, setNewChatSuccess] = useState(false);
  const [createdChat, setCreatedChat] = useState<any>(null);
  const [newAnalysisStep, setNewAnalysisStep] = useState<'create' | 'upload'>('create');

  // Step 2 state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<any[]>([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Step 3 state
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([]);
  const [sessionName, setSessionName] = useState("");
  const [sessionLoading, setSessionLoading] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);
  const [sessionSuccess, setSessionSuccess] = useState(false);
  const [createdSession, setCreatedSession] = useState<any>(null);

  // Step 4 state
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  // Document lists state
  const [chatDocuments, setChatDocuments] = useState<any[]>([]);
  const [sessionDocuments, setSessionDocuments] = useState<any[]>([]);
  const [chatDocumentsLoading, setChatDocumentsLoading] = useState(false);
  const [sessionDocumentsLoading, setSessionDocumentsLoading] = useState(false);

  const [addToSessionSuccessTrigger, setAddToSessionSuccessTrigger] = useState(0);

  const handleToggleDoc = (docId: string) => {
    setSelectedDocIds(prev =>
      prev.includes(docId) ? prev.filter(id => id !== docId) : [...prev, docId]
    );
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setSessionError(null);
    setSessionSuccess(false);
    setSessionLoading(true);
    try {
      const res = await fetch(`https://api.myjurist.io/api/v1/chats/${createdChat.id}/sessions/`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: sessionName,
          document_ids: selectedDocIds,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to create session');
      }
      const data = await res.json();
      setCreatedSession(data);
      setSessionSuccess(true);
      setChatMessages([]); // Reset chat messages for new session
      setChatInput(""); // Reset chat input for new session
      
      // Fetch documents for the new session
      await fetchChatDocuments(createdChat.id);
      await fetchSessionDocuments(createdChat.id, data.id);
    } catch (err: any) {
      setSessionError(err.message || 'An error occurred while creating session.');
    } finally {
      setSessionLoading(false);
    }
  };

  // Fetch document list when history tab is opened
  useEffect(() => {
    if (tab === 'history') {
      setDocumentsLoading(true);
      setDocumentsError(null);
      setSelectedDocument(null);
      setSessions([]);
      setSelectedSession(null);
      setChatMessages([]); // Clear old chat history
      setChatInput(""); // Clear old input
      setChatLoading(false); // Clear old loading state
      setChatError(null); // Clear old error state
      setDocumentId(null); // Clear old document ID
      // Ensure documents section is expanded when history tab is opened
      setDocumentsCollapsed(false);
      setSessionsCollapsed(false);
      
      fetch(`${API_BASE_URL}/documents`, {
        headers: getAuthHeaders(),
      })
        .then(res => {
          console.log('Documents API response status:', res.status);
          return res.json();
        })
        .then(data => {
          console.log('Documents API response data:', data);
          const allDocs = data.documents || [];
          console.log('All documents:', allDocs);
          setAllDocuments(allDocs);
          setTotalCount(allDocs.length);
          // Calculate the current page's documents
          const startIndex = page * pageSize;
          const endIndex = startIndex + pageSize;
          const currentPageDocs = allDocs.slice(startIndex, endIndex);
          console.log('Current page documents:', currentPageDocs);
          setDocuments(currentPageDocs);
        })
        .catch((error) => {
          console.error('Documents fetch error:', error);
          setDocumentsError("Failed to load documents.");
        })
        .finally(() => setDocumentsLoading(false));
    }
  }, [tab]);

  // Update documents when page changes (frontend pagination)
  useEffect(() => {
    if (allDocuments.length > 0) {
      const startIndex = page * pageSize;
      const endIndex = startIndex + pageSize;
      setDocuments(allDocuments.slice(startIndex, endIndex));
    }
  }, [page, allDocuments]);

  // Update sessions when sessionPage changes (frontend pagination)
  useEffect(() => {
    if (allSessions.length > 0) {
      const startIndex = sessionPage * sessionPageSize;
      const endIndex = startIndex + sessionPageSize;
      setSessions(allSessions.slice(startIndex, endIndex));
    }
  }, [sessionPage, allSessions]);

  // File upload logic
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadFiles(Array.from(e.target.files));
      setUploadError(null);
    }
  };

  const handleUploadDocuments = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdChat?.id || uploadFiles.length === 0) return;
    setUploading(true);
    setUploadError(null);
    setUploadSuccess(false);
    try {
      const formData = new FormData();
      uploadFiles.forEach(file => formData.append('files', file));
      // Debug: log FormData keys and values
      Array.from(formData.entries()).forEach(pair => {
        console.log(pair[0], pair[1]);
      });
      // Only include Authorization header, never Content-Type
      const headers = { ...getAuthHeaders() };
      if ('Content-Type' in headers) delete headers['Content-Type'];
      const res = await fetch(`https://api.myjurist.io/api/v1/chats/${createdChat.id}/documents`, {
        method: 'POST',
        headers,
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to upload documents');
      }
      const data = await res.json();
      setUploadedDocs(data.uploaded_documents || []);
      setUploadSuccess(true);
      setUploadFiles([]);
    } catch (err: any) {
      setUploadError(err.message || 'An error occurred while uploading documents.');
    } finally {
      setUploading(false);
    }
  };

  // Simulated streaming for chat
  const simulateStreaming = async (fullText: string) => {
    setStreaming(true);
    setStreamedText("");
    for (let i = 1; i <= fullText.length; i++) {
      setStreamedText(fullText.slice(0, i));
      await new Promise(res => setTimeout(res, 12));
    }
    setStreaming(false);
    setChatMessages(prev => [
      ...prev,
      { sender: "system", text: fullText, time: new Date() },
    ]);
    setStreamedText("");
  };

  // Send a new chat message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !documentId) return;
    setChatError(null);
    const now = new Date();
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: chatInput, time: now },
    ]);
    setChatLoading(true);
    const question = chatInput;
    setChatInput("");
    try {
      const body: any = {
        question,
        document_id: documentId,
      };
      if (selectedSession && selectedSession.session_id) {
        body.session_id = selectedSession.session_id;
      }
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Chat failed");
      }
      const data = await res.json();
      await simulateStreaming(data.response);
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        { sender: "system", text: "(Error) " + (err.message || "An error occurred during chat."), time: new Date() },
      ]);
      setChatError(err.message || "An error occurred during chat.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle document selection from history
  const handleSelectDocument = async (item: DocumentHistoryItem) => {
    setSelectedDocument(item);
    setSelectedSession(null);
    setSessionsLoading(true);
    setSessionsError(null);
    setChatMessages([]); // Clear old chat history
    setChatInput(""); // Clear old input
    setChatLoading(false); // Clear old loading state
    setChatError(null); // Clear old error state
    setDocumentId(item.document_id);
    setChatInput("");
    setDocumentsCollapsed(true); // Collapse document list
    setTimeout(() => {
      chatSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300); // Wait for UI update
    
    try {
      const res = await fetch(`${API_BASE_URL}/chat/?document_id=${item.document_id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to fetch sessions");
      }
      const data = await res.json();
      setAllSessions(data);
      setSessionTotalCount(data.length);
      setSessionPage(0); // Reset to first page
      // Calculate the current page's sessions
      const startIndex = 0;
      const endIndex = sessionPageSize;
      setSessions(data.slice(startIndex, endIndex));
    } catch (err: any) {
      setSessionsError(err.message || "Failed to load chat sessions.");
    } finally {
      setSessionsLoading(false);
    }
  };

  // Handle session selection
  const handleSelectSession = async (session: ChatSessionItem) => {
    setSelectedSession(session);
    setChatLoading(true);
    setChatError(null);
    setChatMessages([]); // Clear old chat history
    setChatInput(""); // Clear old input
    setChatLoading(false); // Clear old loading state
    setChatError(null); // Clear old error state
    
    try {
      const res = await fetch(`${API_BASE_URL}/chat/${session.session_id}/history`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to fetch session");
      }
      const data = await res.json();
      const chatHistory = data.history.map((msg: any) => [
        { sender: "user", text: msg.user, time: new Date(msg.timestamp) },
        { sender: "system", text: msg.assistant, time: new Date(msg.timestamp) },
      ]).flat();
      setChatMessages(chatHistory);
      
      // Fetch documents for the selected session
      if (session.chat_id) {
        await fetchChatDocuments(session.chat_id);
        await fetchSessionDocuments(session.chat_id, session.session_id);
      }
    } catch (err: any) {
      setChatMessages([
        { sender: "system", text: "(Error) " + (err.message || "Failed to load chat session."), time: new Date() },
      ]);
      setChatError(err.message || "Failed to load chat session.");
    } finally {
      setChatLoading(false);
    }
  };

  // Handle document download
  const handleDownload = async (documentId: string, filename: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("Download failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Download error:', err);
      alert('Failed to download document: ' + err.message);
    }
  };

  // Handle document view
  const handleView = async (documentId: string, filename: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/documents/${documentId}/download`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error("View failed");
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfFilename(filename);
      setPdfModalOpen(true);
    } catch (err: any) {
      console.error('View error:', err);
      alert('Failed to view document: ' + err.message);
    }
  };

  const handleClosePdfModal = () => {
    setPdfModalOpen(false);
    if (pdfUrl) {
      window.URL.revokeObjectURL(pdfUrl);
      setPdfUrl("");
    }
    setPdfFilename("");
  };

  // Step 1: Create Chat handler
  const handleCreateChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewChatError(null);
    setNewChatSuccess(false);
    setNewChatLoading(true);
    try {
      const res = await fetch("https://api.myjurist.io/api/v1/chats", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newChatName,
          description: newChatDescription,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Failed to create chat");
      }
      const data = await res.json();
      setCreatedChat(data);
      setNewChatSuccess(true);
      setNewAnalysisStep('upload');
    } catch (err: any) {
      setNewChatError(err.message || "An error occurred while creating chat.");
    } finally {
      setNewChatLoading(false);
    }
  };

  // Timeline/collapsible logic for new analysis flow
  const steps = [
    { key: 'create', label: 'Create Chat' },
    { key: 'upload', label: 'Upload Documents' },
    { key: 'select', label: 'Select Documents & Start Session' },
    { key: 'chat', label: 'Chat' },
  ];
  const currentStepIndex = createdSession ? 3 : (sessionSuccess ? 2 : (uploadSuccess ? 1 : 0));
  const [collapsedSteps, setCollapsedSteps] = useState<{[key: string]: boolean}>({});
  const handleToggleStep = (key: string) => {
    setCollapsedSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Determine current step for timeline
  const getCurrentStep = () => {
    if (tab === 'new') {
      if (selectedSession) return "conversation";
      if (apiResult) return "communication";
      return "upload";
    } else {
      if (selectedSession) return "conversation";
      if (selectedDocument) return "chat";
      return "documents";
    }
  };

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createdChat?.id || !createdSession?.id || !chatInput.trim()) return;
    setChatError(null);
    setChatLoading(true);
    const userMsg = chatInput;
    setChatInput("");
    setChatMessages(prev => [
      ...prev,
      { sender: "user", text: userMsg, time: new Date() },
    ]);
    try {
      const res = await fetch(`https://api.myjurist.io/api/v1/chats/${createdChat.id}/sessions/${createdSession.id}/messages`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMsg }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to send message');
      }
      const data = await res.json();
      setChatMessages(prev => [
        ...prev,
        { sender: "system", text: data.assistant_response, time: new Date(data.timestamp) },
      ]);
    } catch (err: any) {
      setChatError(err.message || 'An error occurred while sending message.');
    } finally {
      setChatLoading(false);
    }
  };

  // Fetch chat documents
  const fetchChatDocuments = async (chatId: string) => {
    if (!chatId) return;
    setChatDocumentsLoading(true);
    try {
      const res = await fetch(`https://api.myjurist.io/api/v1/chats/${chatId}/documents`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch chat documents');
      }
      const data = await res.json();
      setChatDocuments(data.documents || []);
    } catch (err: any) {
      console.error('Error fetching chat documents:', err);
    } finally {
      setChatDocumentsLoading(false);
    }
  };

  // Fetch session documents
  const fetchSessionDocuments = async (chatId: string, sessionId: string) => {
    if (!chatId || !sessionId) return;
    setSessionDocumentsLoading(true);
    try {
      const res = await fetch(`https://api.myjurist.io/api/v1/chats/${chatId}/sessions/${sessionId}/documents`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        throw new Error('Failed to fetch session documents');
      }
      const data = await res.json();
      
      // Handle different response formats
      if (Array.isArray(data)) {
        setSessionDocuments(data);
      } else if (typeof data === 'string') {
        // If it's a single document ID string, we'll filter from chat documents
        const sessionDoc = chatDocuments.find(doc => doc.id === data);
        setSessionDocuments(sessionDoc ? [sessionDoc] : []);
      } else if (data && typeof data === 'object' && data.documents) {
        // If it's an object with documents array
        setSessionDocuments(data.documents);
      } else {
        // Default to empty array
        setSessionDocuments([]);
      }
    } catch (err: any) {
      console.error('Error fetching session documents:', err);
      setSessionDocuments([]);
    } finally {
      setSessionDocumentsLoading(false);
    }
  };

  const handleDeleteDocument = async (documentId: string, context: 'chat' | 'session') => {
    if (!createdChat?.id && !selectedSession?.chat_id) return;
    let chatId = createdChat?.id || selectedSession?.chat_id;
    let sessionId = createdSession?.id || selectedSession?.session_id;

    if (!chatId) return;

    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (!confirmDelete) return;

    try {
      let url = '';
      if (context === 'chat') {
        url = `https://api.myjurist.io/api/v1/chats/${chatId}/documents/${documentId}`;
      } else if (context === 'session' && sessionId) {
        url = `https://api.myjurist.io/api/v1/chats/${chatId}/sessions/${sessionId}/documents/${documentId}`;
      } else {
        return;
      }
      const res = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || 'Failed to delete document');
      }
      // Refresh document lists after delete
      await fetchChatDocuments(chatId);
      if (sessionId) await fetchSessionDocuments(chatId, sessionId);
    } catch (err: any) {
      alert(err.message || 'Failed to delete document');
    }
  };

  const handleAddToSession = async (documentIds: string[]) => {
    if (!createdChat?.id && !selectedSession?.chat_id) return;
    let chatId = createdChat?.id || selectedSession?.chat_id;
    let sessionId = createdSession?.id || selectedSession?.session_id;
    if (!chatId || !sessionId) return;
    try {
      for (const docId of documentIds) {
        const url = `https://api.myjurist.io/api/v1/chats/${chatId}/sessions/${sessionId}/documents/${docId}`;
        const res = await fetch(url, {
          method: 'PUT',
          headers: getAuthHeaders(),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.detail?.[0]?.msg || 'Failed to add document to session');
        }
      }
      // Refresh session documents after adding
      await fetchSessionDocuments(chatId, sessionId);
      setAddToSessionSuccessTrigger(t => t + 1);
      toast({ title: 'Added to session', description: 'Document(s) added to session context.' });
    } catch (err: any) {
      alert(err.message || 'Failed to add document to session');
    }
  };

  const chatSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (uploadSuccess) {
      setCollapsedSteps(prev => ({ ...prev, upload: true }));
    }
  }, [uploadSuccess]);

  useEffect(() => {
    if (sessionSuccess) {
      setCollapsedSteps(prev => ({ ...prev, select: true, chat: false }));
    }
  }, [sessionSuccess]);

  useEffect(() => {
    if (createdChat?.id) {
      fetchChatDocuments(createdChat.id);
    }
  }, [createdChat?.id]);

  useEffect(() => {
    if (createdChat?.id && createdSession?.id) {
      fetchSessionDocuments(createdChat.id, createdSession.id);
    }
  }, [createdChat?.id, createdSession?.id]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-4 sm:gap-6 min-h-screen">
      <Tabs value={tab} onValueChange={(value) => {
        const newTab = value as 'new' | 'history';
        setTab(newTab);
        if (newTab === 'new') {
          setProcessing(false);
          setApiResult(null);
          setApiError(null);
          setChatMessages([]); // Clear old chat history
          setChatInput(""); // Clear old input
          setChatLoading(false); // Clear old loading state
          setChatError(null); // Clear old error state
          setSessionId(null);
          setDocumentId(null);
          setChatInput("");
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="new" className="text-sm py-2 px-2 sm:px-4">New Analysis</TabsTrigger>
          <TabsTrigger value="history" className="text-sm py-2 px-2 sm:px-4">History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 flex-1">
          {/* Timeline Indicator */}
          {/* <TimelineIndicator 
            currentStep={getCurrentStep()}
            selectedDocument={selectedDocument?.filename}
            selectedChat={selectedSession?.session_id}
          /> */}

          {/* Document Upload Section */}
          {/* <CollapsibleSection
            title="Upload Document"
            isCollapsed={uploadCollapsed}
            onToggle={setUploadCollapsed}
          >
            <DocumentUploader
              file={file}
              onProcess={handleProcess}
              processing={processing}
              error={apiError}
            />
          </CollapsibleSection> */}
          
          {/* Chat Interface for New Analysis - Show when document is processed */}
          {apiResult && (
            <Card className="w-full flex-1 min-h-[500px] flex flex-col">
              {/* Document Header for New Analysis */}
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words truncate">{apiResult.filename}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Document processed successfully • {apiResult.total_tokens} tokens • {apiResult.total_chunks} chunks
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20">
                      Ready for chat
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              {/* Chat Interface - Full width */}
              <CardContent className="flex-1 p-0">
                <ChatInterface
                  chat={chatMessages}
                  onSend={handleSend}
                  input={chatInput}
                  setInput={setChatInput}
                  loading={chatLoading}
                  streaming={streaming}
                  streamedText={streamedText}
                  error={chatError}
                  disabled={chatLoading || streaming}
                  continuingSession={false}
                  onDeleteDocument={handleDeleteDocument}
                />
              </CardContent>
            </Card>
          )}

          {tab === 'new' && (
            <div className="w-full">
              {/* Timeline */}
              <div className="flex w-full justify-between items-center mb-6">
                {steps.map((step, idx) => (
                  <React.Fragment key={step.key}>
                    <div
                      className={`flex flex-col items-center flex-1 min-w-0 ${
                        idx < currentStepIndex
                          ? 'text-primary'
                          : idx === currentStepIndex
                          ? 'font-bold text-primary'
                          : 'text-muted-foreground'
                      }`}
                      style={{ minWidth: 0 }}
                    >
                      <div
                        className={`rounded-full w-9 h-9 flex items-center justify-center mb-1 border-2 transition-colors
                          ${
                            idx < currentStepIndex
                              ? 'bg-primary text-white border-primary'
                              : idx === currentStepIndex
                              ? 'bg-primary/80 text-black dark:text-black border-primary'
                              : 'bg-muted text-black dark:text-white border-border'
                          }
                        `}
                      >
                        {idx < currentStepIndex ? (
                          <Check className="w-5 h-5 text-white dark:text-black" />
                        ) : (
                          idx + 1
                        )}
                      </div>
                      <span className="text-xs text-center break-words w-full max-w-[80px]">{step.label}</span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div
                        className="flex-1 h-1 mx-1 transition-colors"
                        style={{
                          background:
                            idx < currentStepIndex
                              ? 'var(--tw-prose-bold, hsl(var(--primary)))'
                              : 'hsl(var(--border))',
                          opacity: idx < currentStepIndex ? 1 : 0.5,
                        }}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Step 1: Create Chat */}
              <CollapsibleSection
                title="1. Create Chat"
                isCollapsed={currentStepIndex > 0 && collapsedSteps['create'] !== false}
                onToggle={() => handleToggleStep('create')}
                className="w-full"
              >
                {newAnalysisStep === 'create' && !createdChat && (
                  <div className="max-w-lg w-full mx-auto">
                    <div className="mb-6">
                      <h2 className="text-xl font-bold mb-2 text-foreground">Start a New Analysis</h2>
                      <p className="text-muted-foreground text-sm">Create a new chat to begin your document analysis workflow.</p>
                    </div>
                    <form onSubmit={handleCreateChat} className="space-y-4">
                      <div>
                        <label htmlFor="chat-name" className="block text-sm font-medium mb-1">Chat Name</label>
                        <input
                          id="chat-name"
                          type="text"
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          placeholder="Enter a name for this chat"
                          value={newChatName}
                          onChange={e => setNewChatName(e.target.value)}
                          required
                          maxLength={64}
                        />
                      </div>
                      <div>
                        <label htmlFor="chat-desc" className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                          id="chat-desc"
                          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary min-h-[80px] resize-y"
                          placeholder="Describe the purpose of this analysis (optional)"
                          value={newChatDescription}
                          onChange={e => setNewChatDescription(e.target.value)}
                          maxLength={256}
                        />
                      </div>
                      {newChatError && (
                        <div className="bg-red-900/80 text-red-200 rounded-lg px-4 py-3 text-center text-sm border border-red-700/50 shadow-lg">
                          {newChatError}
                        </div>
                      )}
                      {newChatSuccess && (
                        <div className="bg-green-900/80 text-green-200 rounded-lg px-4 py-3 text-center text-sm border border-green-700/50 shadow-lg">
                          Chat created successfully!
                        </div>
                      )}
                      <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-white text-black border border-border font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
                        disabled={newChatLoading || !newChatName.trim()}
                      >
                        {newChatLoading ? "Creating..." : "Create Chat"}
                      </button>
                    </form>
                  </div>
                )}
              </CollapsibleSection>

              {/* Step 2: Upload Documents */}
              <CollapsibleSection
                title="2. Upload Documents"
                isCollapsed={currentStepIndex > 1 && collapsedSteps['upload'] !== false}
                onToggle={() => handleToggleStep('upload')}
                className="w-full"
              >
                {newAnalysisStep === 'upload' && createdChat && (
                  <div className="w-full max-w-2xl mx-auto">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>Upload Documents</CardTitle>
                        <p className="text-muted-foreground text-sm">Upload one or more documents to add to this chat.</p>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleUploadDocuments} className="space-y-4">
                          <div>
                            <label htmlFor="doc-upload" className="block text-sm font-medium mb-1">Select Documents</label>
                            <input
                              id="doc-upload"
                              type="file"
                              multiple
                              className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
                              onChange={handleFileChange}
                              disabled={uploading}
                            />
                            {uploadFiles.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {uploadFiles.map((file, idx) => (
                                  <span key={idx} className="inline-block bg-muted px-3 py-1 rounded text-xs text-foreground/80 max-w-[160px] truncate border border-border" title={file.name}>{file.name}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          {uploadError && (
                            <div className="bg-red-900/80 text-red-200 rounded-lg px-4 py-3 text-center text-sm border border-red-700/50 shadow-lg">{uploadError}</div>
                          )}
                          {uploadSuccess && (
                            <div className="bg-green-900/80 text-green-200 rounded-lg px-4 py-3 text-center text-sm border border-green-700/50 shadow-lg">Documents uploaded successfully!</div>
                          )}
                          <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-white text-black border border-border font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
                            disabled={uploading || uploadFiles.length === 0}
                          >
                            {uploading ? 'Uploading...' : 'Upload Documents'}
                          </button>
                        </form>
                        {/* Uploaded Documents List */}
                        {uploadedDocs.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-base font-semibold mb-2 text-foreground">Uploaded Documents</h3>
                            <ul className="space-y-2">
                              {uploadedDocs.map((doc, idx) => (
                                <li key={doc.id || idx} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm border border-border">
                                  <span className="flex-shrink-0 w-4 h-4 inline-block"><FileText className="w-4 h-4 text-primary" /></span>
                                  <span className="break-all flex-1">{doc.filename}</span>
                                  <span className="text-xs text-muted-foreground">{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : ''}</span>
                                  <span className="text-xs text-muted-foreground">{doc.processing_status}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CollapsibleSection>

              {/* Step 3: Select Documents & Start Session */}
              <CollapsibleSection
                title="3. Select Documents & Start Session"
                isCollapsed={currentStepIndex > 2 && collapsedSteps['select'] !== false}
                onToggle={() => handleToggleStep('select')}
                className="w-full"
              >
                {newAnalysisStep === 'upload' && createdChat && uploadedDocs.length > 0 && (
                  <div className="w-full max-w-2xl mx-auto mt-8">
                    <Card className="w-full">
                      <CardHeader>
                        <CardTitle>Select Documents & Start Session</CardTitle>
                        <p className="text-muted-foreground text-sm">Select one or more documents and start a chat session for analysis.</p>
                      </CardHeader>
                      <CardContent>
                        <form onSubmit={handleCreateSession} className="space-y-4">
                          <div className="space-y-2">
                            {uploadedDocs.map(doc => (
                              <label key={doc.id} className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2 cursor-pointer border border-border">
                                <input
                                  type="checkbox"
                                  checked={selectedDocIds.includes(doc.id)}
                                  onChange={() => handleToggleDoc(doc.id)}
                                  className="accent-primary w-5 h-5"
                                />
                                <span className="break-all flex-1 text-sm text-foreground">{doc.filename}</span>
                                <span className="text-xs text-muted-foreground">{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : ''}</span>
                              </label>
                            ))}
                          </div>
                          <div>
                            <label htmlFor="session-name" className="block text-sm font-medium mb-1">Session Name</label>
                            <input
                              id="session-name"
                              type="text"
                              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Enter a name for this session"
                              value={sessionName}
                              onChange={e => setSessionName(e.target.value)}
                              required
                              maxLength={64}
                            />
                          </div>
                          {sessionError && (
                            <div className="bg-red-900/80 text-red-200 rounded-lg px-4 py-3 text-center text-sm border border-red-700/50 shadow-lg">{sessionError}</div>
                          )}
                          {sessionSuccess && (
                            <div className="bg-green-900/80 text-green-200 rounded-lg px-4 py-3 text-center text-sm border border-green-700/50 shadow-lg">Session created successfully!</div>
                          )}
                          <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-white text-black border border-border font-semibold hover:bg-gray-100 transition-colors disabled:opacity-60"
                            disabled={sessionLoading || selectedDocIds.length === 0 || !sessionName.trim()}
                          >
                            {sessionLoading ? 'Creating Session...' : 'Start Session'}
                          </button>
                        </form>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </CollapsibleSection>

              {/* Step 4: Chat */}
              <CollapsibleSection
                title="4. Chat"
                isCollapsed={currentStepIndex < 3 || collapsedSteps['chat'] === true}
                onToggle={() => handleToggleStep('chat')}
                className="w-full"
              >
                {createdSession && (
                  <div className="w-full mx-auto mt-8">
                    <h3 className="text-lg font-bold mb-2 text-foreground">4. Chat</h3>
                    <ChatInterface
                      chat={chatMessages}
                      onSend={handleSendChatMessage}
                      input={chatInput}
                      setInput={setChatInput}
                      loading={chatLoading}
                      streaming={false}
                      streamedText={""}
                      error={chatError}
                      disabled={chatLoading}
                      continuingSession={true}
                      continuingSessionId={createdSession.id}
                      chatDocuments={chatDocuments}
                      sessionDocuments={sessionDocuments}
                      chatId={createdChat?.id}
                      sessionId={createdSession?.id}
                      onViewDocument={handleView}
                      onDownloadDocument={handleDownload}
                      onDeleteDocument={handleDeleteDocument}
                      onAddToSession={handleAddToSession}
                      addToSessionSuccessTrigger={addToSessionSuccessTrigger}
                    />
                  </div>
                )}
              </CollapsibleSection>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex flex-col gap-6 flex-1">
          {/* Timeline Indicator */}
          {/* <TimelineIndicator 
            currentStep={getCurrentStep()}
            selectedDocument={selectedDocument?.filename}
            selectedChat={selectedSession?.session_id}
          /> */}

          {/* Documents Section - Always visible at top */}
          <CollapsibleSection
            title="Documents"
            isCollapsed={documentsCollapsed}
            onToggle={setDocumentsCollapsed}
          >
            {documentsLoading ? (
              <Alert>
                <AlertDescription>Loading documents...</AlertDescription>
              </Alert>
            ) : documentsError ? (
              <Alert variant="destructive">
                <AlertDescription>{documentsError}</AlertDescription>
              </Alert>
            ) : (
              <DocumentHistoryList
                history={documents.map(d => ({
                  document_id: d.document_id,
                  filename: d.filename,
                  upload_timestamp: d.upload_timestamp,
                }))}
                onSelect={handleSelectDocument}
                onDownload={handleDownload}
                onView={handleView}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
              />
            )}
          </CollapsibleSection>

          {/* Chat Sessions Section - Appears when document is selected */}
          {selectedDocument && (
            <div ref={chatSectionRef}>
              <CollapsibleSection
                title={`Chat Sessions - ${selectedDocument.filename.length > 20 ? selectedDocument.filename.substring(0, 20) + '...' : selectedDocument.filename}`}
                isCollapsed={sessionsCollapsed}
                onToggle={setSessionsCollapsed}
              >
                {sessionsLoading ? (
                  <Alert>
                    <AlertDescription>Loading chat sessions...</AlertDescription>
                  </Alert>
                ) : sessionsError ? (
                  <Alert variant="destructive">
                    <AlertDescription>{sessionsError}</AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-3">
                    {sessions.length === 0 && (
                      <div className="text-muted-foreground text-center py-4">No chat sessions found for this document.</div>
                    )}
                    {sessions.map(session => (
                      <Card 
                        key={session.session_id}
                        className={`cursor-pointer hover:bg-muted/50 transition-all ${
                          selectedSession?.session_id === session.session_id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleSelectSession(session)}
                      >
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex flex-col text-left flex-1 min-w-0">
                              <span className="font-medium text-foreground text-sm">Session: {session.session_id.slice(0, 8)}...</span>
                              <span className="text-xs text-muted-foreground">
                                Created: {new Date(session.created_at).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Last: {new Date(session.last_activity).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              {session.message_count} msgs
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Pagination Controls for Sessions */}
                    {sessionTotalCount > sessionPageSize && (
                      <div className="flex justify-center items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSessionPage(sessionPage - 1)}
                          disabled={sessionPage === 0}
                        >
                          Prev
                        </Button>
                        <span className="text-foreground text-sm">Page {sessionPage + 1} of {Math.ceil(sessionTotalCount / sessionPageSize)}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSessionPage(sessionPage + 1)}
                          disabled={sessionPage + 1 >= Math.ceil(sessionTotalCount / sessionPageSize)}
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CollapsibleSection>
            </div>
          )}

          {/* Chat Interface - Takes full width at bottom */}
          {selectedSession && (
            <Card className="w-full flex-1 min-h-[500px] flex flex-col">
              {/* Document Header */}
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg break-words truncate">{selectedDocument?.filename}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Session: {selectedSession.session_id.slice(0, 8)}... • {selectedSession.message_count} messages
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleView(selectedDocument!.document_id, selectedDocument!.filename)}
                      title="View Document"
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(selectedDocument!.document_id, selectedDocument!.filename)}
                      title="Download Document"
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Chat Interface - Full width */}
              <CardContent className="flex-1 p-0">
                <ChatInterface
                  chat={chatMessages}
                  onSend={handleSendChatMessage}
                  input={chatInput}
                  setInput={setChatInput}
                  loading={chatLoading}
                  streaming={streaming}
                  streamedText={streamedText}
                  error={chatError}
                  disabled={chatLoading || streaming}
                  continuingSession={true}
                  continuingSessionId={selectedSession.session_id}
                  chatDocuments={chatDocuments}
                  sessionDocuments={sessionDocuments}
                  chatId={selectedSession?.chat_id}
                  sessionId={selectedSession?.session_id}
                  onViewDocument={handleView}
                  onDownloadDocument={handleDownload}
                  onDeleteDocument={handleDeleteDocument}
                  onAddToSession={handleAddToSession}
                  addToSessionSuccessTrigger={addToSessionSuccessTrigger}
                />
              </CardContent>
            </Card>
          )}

          {/* Empty State when no session is selected */}
          {selectedDocument && !selectedSession && (
            <Card className="w-full flex items-center justify-center py-12">
              <CardContent className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                  <MessageCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Select a Chat Session</h3>
                <p className="text-sm text-muted-foreground">Choose a chat session from the list above to start conversing</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        onClose={handleClosePdfModal}
        pdfUrl={pdfUrl}
        filename={pdfFilename}
      />
    </div>
  );
} 