import React, { useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Search, Zap, Eye, FileText, Download, Eye as EyeIcon } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface ChatMessage {
  sender: string;
  text: string;
  time: Date;
}

interface ChatDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_timestamp: string;
  processing_status: string;
  total_pages: number;
  total_tokens: number;
  total_chunks: number;
  added_to_chat_at: string;
}

interface SessionDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_timestamp: string;
  processing_status: string;
  total_pages: number;
  total_tokens: number;
  total_chunks: number;
  added_to_chat_at: string;
}

interface ChatInterfaceProps {
  chat: ChatMessage[];
  onSend: (e: React.FormEvent) => void;
  input: string;
  setInput: (val: string) => void;
  loading: boolean;
  streaming: boolean;
  streamedText: string;
  error?: string | null;
  disabled?: boolean;
  continuingSession?: boolean;
  continuingSessionId?: string;
  chatDocuments?: ChatDocument[];
  sessionDocuments?: SessionDocument[];
  chatId?: string;
  sessionId?: string;
  onViewDocument?: (documentId: string, filename: string) => void;
  onDownloadDocument?: (documentId: string, filename: string) => void;
  onDeleteDocument?: (documentId: string, context: 'chat' | 'session') => void;
}

export default function ChatInterface({ 
  chat, 
  onSend, 
  input, 
  setInput, 
  loading, 
  streaming, 
  streamedText, 
  error, 
  disabled, 
  continuingSession, 
  continuingSessionId,
  chatDocuments = [],
  sessionDocuments = [],
  chatId,
  sessionId,
  onViewDocument,
  onDownloadDocument,
  onDeleteDocument
}: ChatInterfaceProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading, streaming, streamedText]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(e);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="flex h-full gap-4">
      {/* Left Side - Chat Documents */}
      <div className="w-64 bg-neutral-950/90 rounded-lg border border-neutral-800 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-800">
          <FileText className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-200">Chat Documents</h3>
          <span className="ml-auto text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
            {chatDocuments.length}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {!Array.isArray(chatDocuments) || chatDocuments.length === 0 ? (
            <div className="text-center text-neutral-500 text-sm py-8">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No documents in chat</p>
            </div>
          ) : (
            (chatDocuments as any[]).map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-neutral-200 truncate flex-1">
                    {doc.filename}
                  </h4>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {onViewDocument && (
                    <button
                      onClick={() => onViewDocument(doc.id, doc.filename)}
                      className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                      title="View document"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  )}
                  {onDownloadDocument && (
                    <button
                      onClick={() => onDownloadDocument(doc.id, doc.filename)}
                      className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteDocument && (
                    <button
                      onClick={() => onDeleteDocument(doc.id, 'chat')}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete document"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Center - Chat Interface */}
      <div className="flex-1 flex flex-col">
        {/* Banner for continuing old chat */}
        {continuingSession && continuingSessionId && (
          <div className="mb-3 p-3 rounded-lg bg-neutral-900/80 border border-neutral-700 text-neutral-100 text-sm font-semibold text-center">
            Continuing previous chat session: <span className="font-mono text-neutral-300">{continuingSessionId.slice(0, 8)}...</span>
          </div>
        )}

        {/* Scrollable Chat Area - Takes remaining space */}
        <div className="flex-1 overflow-y-auto bg-neutral-950/90 rounded-lg p-4 transition-all border border-neutral-800">
          {chat.length === 0 && !loading && !streaming && (
            <div className="flex items-center justify-center h-full text-neutral-400">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-neutral-900 rounded-full flex items-center justify-center border border-neutral-800">
                  <Search className="w-8 h-8 text-neutral-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-neutral-200">Start a Conversation</h3>
                <p className="text-sm text-neutral-400">Ask questions about your document to get started</p>
              </div>
            </div>
          )}
          
          {chat.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "system" && (
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-200 font-bold text-sm border border-neutral-700">
                  AI
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-lg transition-all duration-200 ${
                  msg.sender === "user"
                    ? "bg-neutral-800 text-neutral-100 rounded-br-md border border-neutral-700"
                    : "bg-neutral-900 text-neutral-200 rounded-bl-md border border-neutral-800"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-neutral-400" : "text-neutral-500"}`}>
                  {formatTime(new Date(msg.time))}
                </div>
              </div>
              {msg.sender === "user" && (
                <div className="flex-shrink-0 w-8 h-8 bg-neutral-700 rounded-full flex items-center justify-center text-neutral-200 font-bold text-sm border border-neutral-800">
                  U
                </div>
              )}
            </div>
          ))}
          
          {/* Simulated streaming bubble */}
          {streaming && (
            <div className="mb-4 flex items-end gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-200 font-bold text-sm border border-neutral-700">
                AI
              </div>
              <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-neutral-900 text-neutral-200 shadow-lg border border-neutral-800 rounded-bl-md">
                <div className="whitespace-pre-wrap">{streamedText || <span className="opacity-60">Typing...</span>}</div>
                <div className="text-xs text-neutral-500 mt-2 flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1 h-1 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {loading && !streaming && (
            <div className="mb-4 flex items-end gap-3 justify-start">
              <div className="flex-shrink-0 w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-200 font-bold text-sm border border-neutral-700">
                AI
              </div>
              <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-neutral-900 text-neutral-200 shadow-lg border border-neutral-800 rounded-bl-md">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-neutral-500 border-t-transparent rounded-full animate-spin"></div>
                  <span>Generating response...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        
        {/* Input Area - Fixed at bottom */}
        <div className="bg-neutral-950/95 backdrop-blur-sm border-t border-neutral-800 p-4 shadow-xl mt-4 rounded-lg">
          <form onSubmit={handleSubmit} className="w-full">
            {/* Main Input Field */}
            <div className="relative mb-3">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-4 pr-16 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-neutral-600 focus:outline-none text-neutral-100 placeholder-neutral-500 text-base shadow-lg transition-all duration-200"
                placeholder="Ask a follow-up question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={disabled}
                autoFocus
              />
              {/* Send Button */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-neutral-800 text-neutral-100 hover:bg-neutral-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                disabled={disabled || !input.trim()}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Enhanced Icon Bar */}
            <div className="flex items-center justify-between px-2">
              {/* Left Group - Functionality Icons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all duration-200 border border-neutral-800 shadow-md hover:shadow-lg"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all duration-200 border border-neutral-800 shadow-md hover:shadow-lg"
                  title="Generate"
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all duration-200 border border-neutral-800 shadow-md hover:shadow-lg"
                  title="Visual Search"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              {/* Right Group - Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all duration-200 border border-neutral-800 shadow-md hover:shadow-lg"
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-neutral-200 transition-all duration-200 border border-neutral-800 shadow-md hover:shadow-lg"
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 w-full bg-red-900/80 text-red-200 rounded-xl px-4 py-3 text-center text-sm border border-red-700/50 shadow-lg">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Right Side - Session Documents */}
      <div className="w-64 bg-neutral-950/90 rounded-lg border border-neutral-800 p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-neutral-800">
          <FileText className="w-4 h-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-200">Session Context</h3>
          <span className="ml-auto text-xs text-neutral-500 bg-neutral-800 px-2 py-1 rounded">
            {sessionDocuments.length}
          </span>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {!Array.isArray(sessionDocuments) || sessionDocuments.length === 0 ? (
            <div className="text-center text-neutral-500 text-sm py-8">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No documents in context</p>
            </div>
          ) : (
            (sessionDocuments as any[]).map((doc) => (
              <div
                key={doc.id}
                className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-800 hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-neutral-200 truncate flex-1">
                    {doc.filename}
                  </h4>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  {onViewDocument && (
                    <button
                      onClick={() => onViewDocument(doc.id, doc.filename)}
                      className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                      title="View document"
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                  )}
                  {onDownloadDocument && (
                    <button
                      onClick={() => onDownloadDocument(doc.id, doc.filename)}
                      className="p-1 text-neutral-400 hover:text-neutral-200 transition-colors"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  {onDeleteDocument && (
                    <button
                      onClick={() => onDeleteDocument(doc.id, 'session')}
                      className="p-1 text-red-400 hover:text-red-600 transition-colors"
                      title="Delete document"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 