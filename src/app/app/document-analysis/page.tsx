"use client";
import React, { useState, useEffect } from "react";
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
import { Eye, Download, MessageCircle } from "lucide-react";

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
  const [file, setFile] = useState<File | null>(null);
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
  const handleFileChange = (file: File | null) => {
    setFile(file);
    setApiResult(null);
    setApiError(null);
    setChat([
      { sender: "system", text: "Upload and process a document to start asking questions.", time: new Date() },
    ]);
    setSessionId(null);
    setDocumentId(null);
    setInput("");
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setApiResult(null);
    setApiError(null);
    setSessionId(null);
    setDocumentId(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch(`${API_BASE_URL}/documents/upload`, {
        method: "POST",
        headers: {
          "Authorization": getAuthHeaders().Authorization,
        },
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Upload failed");
      }
      const data: ApiResponse = await res.json();
      setApiResult(data);
      const newSessionId = generateSessionId();
      setSessionId(newSessionId);
      setDocumentId(data.document_id);
      setChat([
        { sender: "system", text: `Document '${data.filename}' processed. You can now ask questions.`, time: new Date() },
      ]);
      // Collapse upload section when document is processed
      setUploadCollapsed(true);
    } catch (err: any) {
      setApiError(err.message || "An error occurred during upload.");
    } finally {
      setProcessing(false);
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

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-4 sm:gap-6 min-h-screen">
      <Tabs value={tab} onValueChange={(value) => {
        const newTab = value as 'new' | 'history';
        setTab(newTab);
        if (newTab === 'new') {
          setFile(null);
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
          <CollapsibleSection
            title="Upload Document"
            isCollapsed={uploadCollapsed}
            onToggle={setUploadCollapsed}
          >
            <DocumentUploader
              file={file}
              onFileChange={handleFileChange}
              onProcess={handleProcess}
              processing={processing}
              error={apiError}
            />
          </CollapsibleSection>
          
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