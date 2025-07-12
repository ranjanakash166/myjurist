"use client";
import React, { useRef, useState, useEffect } from "react";
import { Paperclip } from "lucide-react";

interface ApiResponse {
  document_id: string;
  filename: string;
  is_chunked: boolean;
  total_chunks: number;
  total_tokens: number;
  structure_analysis: string;
  file_size: number;
}

function generateSessionId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function DocumentAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chat, setChat] = useState([
    { sender: "system", text: "Upload and process a document to start asking questions.", time: new Date() },
  ]);
  const [input, setInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [streaming, setStreaming] = useState(false);
  const [streamedText, setStreamedText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, chatLoading, streaming, streamedText]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setApiResult(null);
      setApiError(null);
      setChat([
        { sender: "system", text: "Upload and process a document to start asking questions.", time: new Date() },
      ]);
      setSessionId(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setApiResult(null);
    setApiError(null);
    setSessionId(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("https://api.myjurist.io/api/v1/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Upload failed");
      }
      const data: ApiResponse = await res.json();
      setApiResult(data);
      setSessionId(generateSessionId());
      setChat([
        { sender: "system", text: `Document '${data.filename}' processed. You can now ask questions.`, time: new Date() },
      ]);
    } catch (err: any) {
      setApiError(err.message || "An error occurred during upload.");
    } finally {
      setProcessing(false);
    }
  };

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !apiResult || !sessionId) return;
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
      const res = await fetch("https://api.myjurist.io/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          document_id: apiResult.document_id,
          session_id: sessionId,
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

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-6 md:px-12 py-4 flex flex-col gap-8">
      {/* Redesigned Uploader */}
      <div className="glass-effect rounded-2xl p-8 flex flex-col items-center justify-center w-full">
        <h2 className="text-xl font-bold gradient-text-animate mb-6">Document Uploader</h2>
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="flex-1 w-full flex items-center gap-3 bg-slate-800/60 border border-ai-blue-500/30 rounded-lg px-4 py-3 min-h-[48px]">
            <Paperclip className="w-6 h-6 text-ai-blue-400" />
            <span className={`truncate text-base ${file ? 'text-white' : 'text-slate-400'}`}>
              {file ? file.name : "No file selected"}
            </span>
          </div>
          <button
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow w-full sm:w-auto"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            {file ? "Change File" : "Choose File"}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <button
          className="w-full max-w-md py-3 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50 mt-2"
          onClick={handleProcess}
          disabled={!file || processing}
        >
          {processing ? "Processing..." : "Process Document"}
        </button>
        {apiError && (
          <div className="mt-4 w-full bg-red-900/80 text-red-300 rounded-lg px-4 py-3 text-center">
            {apiError}
          </div>
        )}
      </div>
      {/* Chat Interface below */}
      <div className="glass-effect rounded-2xl p-8 flex flex-col min-h-[350px] max-h-[70vh] h-auto w-full">
        <h2 className="text-xl font-bold gradient-text-animate mb-4">Ask Questions</h2>
        <div className="flex-1 overflow-y-auto mb-4 bg-slate-800/40 rounded p-3 max-h-60 sm:max-h-96 transition-all">
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "system" && (
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-blue-500 to-ai-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  AI
                </div>
              )}
              <div
                className={`px-3 py-2 rounded-lg max-w-xs text-sm shadow-md transition-all duration-200 ${
                  msg.sender === "user"
                    ? "bg-ai-blue-500 text-white rounded-br-2xl"
                    : "bg-slate-700 text-slate-200 rounded-bl-2xl"
                }`}
              >
                {msg.text}
                <div className="text-xs text-slate-400 mt-1 text-right">
                  {formatTime(new Date(msg.time))}
                </div>
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold">
                  U
                </div>
              )}
            </div>
          ))}
          {/* Simulated streaming bubble */}
          {streaming && (
            <div className="mb-2 flex items-end gap-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-blue-500 to-ai-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                AI
              </div>
              <div className="px-3 py-2 rounded-lg max-w-xs text-sm bg-slate-700 text-slate-200 shadow-md">
                {streamedText || <span className="opacity-60">Typing...</span>}
                <div className="text-xs text-slate-400 mt-1 text-right">...</div>
              </div>
            </div>
          )}
          {chatLoading && !streaming && (
            <div className="mb-2 flex items-end gap-2 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-blue-500 to-ai-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                AI
              </div>
              <div className="px-3 py-2 rounded-lg max-w-xs text-sm bg-slate-700 text-slate-200 opacity-70 animate-pulse shadow-md">
                Generating response...
                <div className="text-xs text-slate-400 mt-1 text-right">...</div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={processing || !apiResult || chatLoading || streaming}
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50"
            disabled={processing || !apiResult || !input.trim() || chatLoading || streaming}
          >
            {(chatLoading || streaming) ? "Sending..." : "Send"}
          </button>
        </form>
        {chatError && (
          <div className="mt-2 w-full bg-red-900/80 text-red-300 rounded-lg px-4 py-2 text-center text-xs">
            {chatError}
          </div>
        )}
      </div>
    </div>
  );
} 