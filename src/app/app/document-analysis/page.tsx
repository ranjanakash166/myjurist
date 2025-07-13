"use client";
import React, { useRef, useState, useEffect } from "react";
import { API_BASE_URL } from "../../constants";
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

interface HistoryItem {
  document_id: string;
  session_id: string;
  filename: string;
  created_at: string;
}

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Mock history data
const mockHistory: HistoryItem[] = [
  {
    document_id: "doc1",
    session_id: "1f20e4e8-a730-4302-8ac7-1f0b797bb82d",
    filename: "EBAV_Patent_Analysis.pdf",
    created_at: "2025-07-12T18:29:46.080119",
  },
  {
    document_id: "doc2",
    session_id: "session2",
    filename: "Crypto_Regulation_Report.pdf",
    created_at: "2025-07-10T14:12:00.000000",
  },
];

export default function DocumentAnalysisPage() {
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
  const [historyLoading, setHistoryLoading] = useState(false);

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
    if (!input.trim() || !sessionId || !documentId) return;
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
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          document_id: documentId,
        }),
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

  // Fetch chat history for a selected document/session
  const handleSelectHistory = async (item: HistoryItem) => {
    setTab('history');
    setHistoryLoading(true);
    setSessionId(item.session_id);
    setDocumentId(item.document_id);
    setApiResult(null);
    setApiError(null);
    setFile(null);
    setInput("");
    try {
      const res = await fetch(`${API_BASE_URL}/chat/${item.session_id}/history`);
      if (!res.ok) throw new Error("Failed to fetch chat history");
      const data = await res.json();
      // Convert API history to chat format
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
        <DocumentHistoryList
          history={mockHistory}
          onSelect={handleSelectHistory}
        />
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
          !sessionId ||
          !documentId ||
          chatLoading ||
          streaming ||
          (tab === 'new' && !file && !apiResult)
        }
      />
    </div>
  );
} 