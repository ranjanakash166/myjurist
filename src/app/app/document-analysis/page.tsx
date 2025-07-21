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
import { Eye, Download, MessageCircle, FileText } from "lucide-react";

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
  const [chat, setChat] = useState<any[]>([
    { sender: "system", text: "Upload and process a document to start asking questions.", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
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
      setChat([
        { sender: "system", text: "Select a document to view its chat history.", time: new Date() },
      ]);
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
    setChat(prev => [
      ...prev,
      { sender: "system", text: fullText, time: new Date() },
    ]);
    setStreamedText("");
  };

  // Send a new chat message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !documentId) return;
    setChatError(null);
    const now = new Date();
    setChat((prev) => [
      ...prev,
      { sender: "user", text: input, time: now },
    ]);
    setChatLoading(true);
    const question = input;
    setInput("");
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
      setChat((prev) => [
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
    setChat([
      { sender: "system", text: `Document '${item.filename}' selected. Choose a chat session to continue.`, time: new Date() },
    ]);
    setDocumentId(item.document_id);
    setInput("");
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
    setChat([
      { sender: "system", text: `Loading chat session: ${session.session_id.slice(0, 8)}...`, time: new Date() },
    ]);
    
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
      setChat(chatHistory);
    } catch (err: any) {
      setChat([
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

  const chatSectionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-4 sm:gap-6 min-h-screen">
      <Tabs value={tab} onValueChange={(value) => {
        const newTab = value as 'new' | 'history';
        setTab(newTab);
        if (newTab === 'new') {
          setProcessing(false);
          setApiResult(null);
          setApiError(null);
          setChat([
            { sender: "system", text: "Upload and process a document to start asking questions.", time: new Date() },
          ]);
          setSessionId(null);
          setDocumentId(null);
          setInput("");
        }
      }} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="new" className="text-sm py-2 px-2 sm:px-4">New Analysis</TabsTrigger>
          <TabsTrigger value="history" className="text-sm py-2 px-2 sm:px-4">History</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-6 flex-1">
          {/* Timeline Indicator */}
          <TimelineIndicator 
            currentStep={getCurrentStep()}
            selectedDocument={selectedDocument?.filename}
            selectedChat={selectedSession?.session_id}
          />

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
                  chat={chat}
                  onSend={handleSend}
                  input={input}
                  setInput={setInput}
                  loading={chatLoading}
                  streaming={streaming}
                  streamedText={streamedText}
                  error={chatError}
                  disabled={chatLoading || streaming}
                  continuingSession={false}
                />
              </CardContent>
            </Card>
          )}

          {tab === 'new' && (
            <div className="space-y-6 flex-1">
              {/* Timeline/Progress Indicator */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className={`flex items-center gap-2 ${newAnalysisStep === 'create' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>1. Create Chat</div>
                <div className="w-6 h-0.5 bg-border rounded-full" />
                <div className={`flex items-center gap-2 ${newAnalysisStep === 'upload' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>2. Upload Documents</div>
              </div>
              {/* Step 1: Create New Chat */}
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
                      className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                      disabled={newChatLoading || !newChatName.trim()}
                    >
                      {newChatLoading ? "Creating..." : "Create Chat"}
                    </button>
                  </form>
                </div>
              )}
              {/* Step 2 and beyond will go here after chat is created */}
              {newAnalysisStep === 'upload' && createdChat && (
                <div className="max-w-lg w-full mx-auto">
                  <div className="mb-6">
                    <h2 className="text-xl font-bold mb-2 text-foreground">Upload Documents</h2>
                    <p className="text-muted-foreground text-sm">Upload one or more documents to add to this chat.</p>
                  </div>
                  <form onSubmit={handleUploadDocuments} className="space-y-4">
                    <div>
                      <label htmlFor="doc-upload" className="block text-sm font-medium mb-1">Select Documents</label>
                      <input
                        id="doc-upload"
                        type="file"
                        multiple
                        className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                        onChange={handleFileChange}
                        disabled={uploading}
                      />
                      {uploadFiles.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-2">
                          {uploadFiles.map((file, idx) => (
                            <span key={idx} className="inline-block bg-muted px-3 py-1 rounded text-xs text-foreground/80 max-w-[160px] truncate" title={file.name}>{file.name}</span>
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
                      className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
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
                          <li key={doc.id || idx} className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm">
                            <span className="flex-shrink-0 w-4 h-4 inline-block"><FileText className="w-4 h-4 text-primary" /></span>
                            <span className="break-all flex-1">{doc.filename}</span>
                            <span className="text-xs text-muted-foreground">{doc.file_size ? (doc.file_size / 1024).toFixed(1) + ' KB' : ''}</span>
                            <span className="text-xs text-muted-foreground">{doc.processing_status}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {newAnalysisStep === 'upload' && createdChat && uploadedDocs.length > 0 && (
                <div className="max-w-lg w-full mx-auto mt-8">
                  <h3 className="text-lg font-bold mb-2 text-foreground">3. Select Documents & Start Session</h3>
                  <form onSubmit={handleCreateSession} className="space-y-4">
                    <div className="space-y-2">
                      {uploadedDocs.map(doc => (
                        <label key={doc.id} className="flex items-center gap-3 bg-muted rounded-lg px-3 py-2 cursor-pointer">
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
                      className="w-full py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
                      disabled={sessionLoading || selectedDocIds.length === 0 || !sessionName.trim()}
                    >
                      {sessionLoading ? 'Creating Session...' : 'Start Session'}
                    </button>
                  </form>
                  {createdSession && (
                    <div className="mt-4 p-4 bg-green-900/80 text-green-200 rounded-lg text-center text-sm border border-green-700/50 shadow-lg">
                      Session "{createdSession.name}" created! You can now start chatting.
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="flex flex-col gap-6 flex-1">
          {/* Timeline Indicator */}
          <TimelineIndicator 
            currentStep={getCurrentStep()}
            selectedDocument={selectedDocument?.filename}
            selectedChat={selectedSession?.session_id}
          />

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
                  chat={chat}
                  onSend={handleSend}
                  input={input}
                  setInput={setInput}
                  loading={chatLoading}
                  streaming={streaming}
                  streamedText={streamedText}
                  error={chatError}
                  disabled={chatLoading || streaming}
                  continuingSession={true}
                  continuingSessionId={selectedSession.session_id}
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