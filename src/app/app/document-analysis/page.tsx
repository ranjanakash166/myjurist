"use client";
import React, { useRef, useState } from "react";

interface ApiResponse {
  document_id: string;
  filename: string;
  is_chunked: boolean;
  total_chunks: number;
  total_tokens: number;
  structure_analysis: string;
  file_size: number;
}

export default function DocumentAnalysisPage() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [apiResult, setApiResult] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [chat, setChat] = useState([
    { sender: "system", text: "Upload and process a document to start asking questions." },
  ]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setApiResult(null);
      setApiError(null);
    }
  };

  const handleProcess = async () => {
    if (!file) return;
    setProcessing(true);
    setApiResult(null);
    setApiError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://20.244.9.18:8000/api/v1/documents/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.detail?.[0]?.msg || "Upload failed");
      }
      const data: ApiResponse = await res.json();
      setApiResult(data);
      setChat([
        { sender: "system", text: `Document '${data.filename}' processed. You can now ask questions.` },
      ]);
    } catch (err: any) {
      setApiError(err.message || "An error occurred during upload.");
    } finally {
      setProcessing(false);
    }
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChat((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "system", text: "(Dummy response) This is where the answer will appear." },
    ]);
    setInput("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 md:px-8 py-4 flex flex-col gap-6">
      {/* Uploader and Process Button at the top */}
      <div className="glass-effect rounded-2xl p-6 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold gradient-text-animate mb-4">Document Uploader</h2>
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow mb-4"
          onClick={() => fileInputRef.current?.click()}
        >
          {file ? `Selected: ${file.name}` : "Choose File"}
        </button>
        <button
          className="w-full py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50"
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
      {/* API Result Section */}
      {apiResult && (
        <div className="glass-effect rounded-2xl p-6 mt-2 shadow-lg">
          <h3 className="text-lg font-bold gradient-text-animate mb-2">Document Analysis Result</h3>
          <div className="text-slate-200 text-sm flex flex-col gap-1">
            <div><span className="font-semibold">Document ID:</span> {apiResult.document_id}</div>
            <div><span className="font-semibold">Filename:</span> {apiResult.filename}</div>
            <div><span className="font-semibold">Is Chunked:</span> {apiResult.is_chunked ? "Yes" : "No"}</div>
            <div><span className="font-semibold">Total Chunks:</span> {apiResult.total_chunks}</div>
            <div><span className="font-semibold">Total Tokens:</span> {apiResult.total_tokens}</div>
            <div><span className="font-semibold">File Size:</span> {apiResult.file_size} bytes</div>
            <div><span className="font-semibold">Structure Analysis:</span> {apiResult.structure_analysis}</div>
          </div>
        </div>
      )}
      {/* Chat Interface below */}
      <div className="glass-effect rounded-2xl p-6 flex flex-col min-h-[350px] max-h-[70vh] h-auto">
        <h2 className="text-xl font-bold gradient-text-animate mb-4">Ask Questions</h2>
        <div className="flex-1 overflow-y-auto mb-4 bg-slate-800/40 rounded p-3 max-h-60 sm:max-h-96">
          {chat.map((msg, idx) => (
            <div key={idx} className={`mb-2 flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-3 py-2 rounded-lg max-w-xs text-sm ${msg.sender === "user" ? "bg-ai-blue-500 text-white" : "bg-slate-700 text-slate-200"}`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={processing || !apiResult}
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50"
            disabled={processing || !apiResult || !input.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
} 