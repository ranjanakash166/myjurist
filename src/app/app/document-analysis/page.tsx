"use client";
import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../constants";
import { useAuth } from "../../../components/AuthProvider";
import DocumentUploader from "./DocumentUploader";
import DocumentHistoryList from "./DocumentHistoryList";
import ChatInterface from "./ChatInterface";

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
      fetch(`${API_BASE_URL}/documents`, {
        headers: getAuthHeaders(),
      })
        .then(res => res.json())
        .then(data => {
          const allDocs = data.documents || [];
          setAllDocuments(allDocs);
          setTotalCount(allDocs.length);
          // Calculate the current page's documents
          const startIndex = page * pageSize;
          const endIndex = startIndex + pageSize;
          setDocuments(allDocs.slice(startIndex, endIndex));
        })
        .catch(() => setDocumentsError("Failed to load documents."))
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

  // When a document is selected, fetch its chat sessions (with frontend pagination)
  const handleSelectDocument = async (item: DocumentHistoryItem) => {
    setSelectedDocument(item);
    setSessionsLoading(true);
    setSessionsError(null);
    setSessions([]);
    setSelectedSession(null);
    setChat([
      { sender: "system", text: "Select a chat session to view its history.", time: new Date() },
    ]);
    try {
      const res = await fetch(`${API_BASE_URL}/chat/?document_id=${item.document_id}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch chat sessions");
      const data = await res.json();
      setAllSessions(data);
      setSessionTotalCount(data.length);
      setSessionPage(0); // Reset to first page
      // Calculate the current page's sessions
      const startIndex = 0;
      const endIndex = sessionPageSize;
      setSessions(data.slice(startIndex, endIndex));
    } catch (err: any) {
      setSessionsError("Failed to load chat sessions.");
    } finally {
      setSessionsLoading(false);
    }
  };

  // Update sessions when sessionPage changes (frontend pagination)
  useEffect(() => {
    if (allSessions.length > 0) {
      const startIndex = sessionPage * sessionPageSize;
      const endIndex = startIndex + sessionPageSize;
      setSessions(allSessions.slice(startIndex, endIndex));
    }
  }, [sessionPage, allSessions]);

  // When a session is selected, fetch its chat history
  const handleSelectSession = async (session: ChatSessionItem) => {
    setSelectedSession(session);
    setSessionId(session.session_id);
    setDocumentId(session.document_id);
    setHistoryLoading(true);
    setInput("");
    try {
      const res = await fetch(`${API_BASE_URL}/chat/${session.session_id}/history`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();
      const chatHistory = data.history.map((msg: any) => [
        { sender: "user", text: msg.user, time: new Date(msg.timestamp) },
        { sender: "system", text: msg.assistant, time: new Date(msg.timestamp) },
      ]).flat();
      setChat(chatHistory);
    } catch (err: any) {
      setChat([
        { sender: "system", text: "Failed to load chat history.", time: new Date() },
      ]);
    } finally {
      setHistoryLoading(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 md:px-12 py-4 flex flex-col gap-8">
      {/* Tabs */}
      <div className="flex gap-4 mb-2">
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'new' ? 'bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          onClick={() => {
            setTab('new');
            setFile(null);
            setApiResult(null);
            setApiError(null);
            setChat([
              { sender: "system", text: "Upload and process a document to start asking questions.", time: new Date() },
            ]);
            setSessionId(null);
            setDocumentId(null);
            setInput("");
          }}
        >
          New Analysis
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg font-semibold transition-all ${tab === 'history' ? 'bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white' : 'bg-slate-800 text-slate-300'}`}
          onClick={() => setTab('history')}
        >
          History
        </button>
      </div>
      {/* New Analysis Section */}
      {tab === 'new' && (
        <DocumentUploader
          file={file}
          onFileChange={handleFileChange}
          onProcess={handleProcess}
          processing={processing}
          error={apiError}
        />
      )}
      {/* History Section */}
      {tab === 'history' && (
        <div className="flex flex-col gap-6">
          {/* Document List */}
          {documentsLoading ? (
            <div className="glass-effect rounded-2xl p-8 flex items-center justify-center text-slate-300">Loading documents...</div>
          ) : documentsError ? (
            <div className="glass-effect rounded-2xl p-8 flex items-center justify-center text-red-400">{documentsError}</div>
          ) : (
            <>
              <DocumentHistoryList
                history={documents.map(d => ({
                  document_id: d.document_id,
                  filename: d.filename,
                  upload_timestamp: d.upload_timestamp,
                }))}
                onSelect={handleSelectDocument}
                page={page}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPage}
              />
              {/* Chat Sessions for selected document */}
              {selectedDocument && (
                <div className="glass-effect rounded-2xl p-8 flex flex-col w-full">
                  <h2 className="text-lg font-bold gradient-text-animate mb-4">Chat Sessions for {selectedDocument.filename}</h2>
                  {sessionsLoading ? (
                    <div className="text-slate-300">Loading chat sessions...</div>
                  ) : sessionsError ? (
                    <div className="text-red-400">{sessionsError}</div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-3">
                        {sessions.length === 0 && <div className="text-slate-400">No chat sessions found for this document.</div>}
                        {sessions.map(session => (
                          <button
                            key={session.session_id}
                            className={`flex items-center justify-between bg-slate-800/60 border border-ai-blue-500/20 rounded-lg px-4 py-3 hover:bg-ai-blue-500/10 transition-all ${selectedSession?.session_id === session.session_id ? 'ring-2 ring-ai-blue-400' : ''}`}
                            onClick={() => handleSelectSession(session)}
                          >
                            <div className="flex flex-col">
                              <span className="font-medium text-white">Session: {session.session_id.slice(0, 8)}...</span>
                              <span className="text-xs text-slate-400">Created: {new Date(session.created_at).toLocaleString()}</span>
                              <span className="text-xs text-slate-400">Last Activity: {new Date(session.last_activity).toLocaleString()}</span>
                            </div>
                            <span className="text-slate-400 text-sm">{session.message_count} messages</span>
                          </button>
                        ))}
                      </div>
                      {/* Pagination Controls for Sessions */}
                      {sessionTotalCount > sessionPageSize && (
                        <div className="flex justify-center items-center gap-2 mt-4">
                          <button
                            className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
                            onClick={() => setSessionPage(sessionPage - 1)}
                            disabled={sessionPage === 0}
                          >
                            Prev
                          </button>
                          <span className="text-slate-300 text-sm">Page {sessionPage + 1} of {Math.ceil(sessionTotalCount / sessionPageSize)}</span>
                          <button
                            className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
                            onClick={() => setSessionPage(sessionPage + 1)}
                            disabled={sessionPage + 1 >= Math.ceil(sessionTotalCount / sessionPageSize)}
                          >
                            Next
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
      {/* Chat Interface (always visible, but shows history or new analysis chat) */}
      <ChatInterface
        chat={chat}
        onSend={handleSend}
        input={input}
        setInput={setInput}
        loading={chatLoading}
        streaming={streaming}
        streamedText={streamedText}
        error={chatError}
        disabled={
          processing ||
          !documentId ||
          chatLoading ||
          streaming ||
          (tab === 'new' && !file && !apiResult)
        }
        // Add a prop to indicate if continuing an old chat
        continuingSession={!!selectedSession}
        continuingSessionId={selectedSession?.session_id}
      />
    </div>
  );
} 