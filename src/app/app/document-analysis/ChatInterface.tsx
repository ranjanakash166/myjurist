import React, { useRef, useEffect } from "react";
import { Send, Paperclip, Mic, Search, Zap, Eye } from "lucide-react";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

interface ChatMessage {
  sender: string;
  text: string;
  time: Date;
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
}

export default function ChatInterface({ chat, onSend, input, setInput, loading, streaming, streamedText, error, disabled, continuingSession, continuingSessionId }: ChatInterfaceProps) {
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

  return (
    <div className="flex flex-col h-full relative">
      {/* Banner for continuing old chat */}
      {continuingSession && continuingSessionId && (
        <div className="mb-3 p-3 rounded-lg bg-ai-blue-500/20 text-ai-blue-200 text-sm font-semibold text-center">
          Continuing previous chat session: <span className="font-mono text-white">{continuingSessionId.slice(0, 8)}...</span>
        </div>
      )}

      {/* Scrollable Chat Area */}
      <div className="flex-1 overflow-y-auto pb-24 bg-slate-800/40 rounded-lg p-4 transition-all">
        {chat.length === 0 && !loading && !streaming && (
          <div className="flex items-center justify-center h-full text-slate-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-700/60 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Start a Conversation</h3>
              <p className="text-sm">Ask questions about your document to get started</p>
            </div>
          </div>
        )}
        
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "system" && (
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-blue-500 to-ai-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-lg transition-all duration-200 ${
                msg.sender === "user"
                  ? "bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white rounded-br-md"
                  : "bg-slate-700/80 text-slate-200 rounded-bl-md border border-slate-600/50"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-blue-100" : "text-slate-400"}`}>
                {formatTime(new Date(msg.time))}
              </div>
            </div>
            {msg.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
            )}
          </div>
        ))}
        
        {/* Simulated streaming bubble */}
        {streaming && (
          <div className="mb-4 flex items-end gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-blue-500 to-ai-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-slate-700/80 text-slate-200 shadow-lg border border-slate-600/50 rounded-bl-md">
              <div className="whitespace-pre-wrap">{streamedText || <span className="opacity-60">Typing...</span>}</div>
              <div className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading && !streaming && (
          <div className="mb-4 flex items-end gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-ai-blue-500 to-ai-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-slate-700/80 text-slate-200 shadow-lg border border-slate-600/50 rounded-bl-md">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating response...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>

      {/* Fixed Input at Bottom - Only in Main Content Area */}
      <div className="fixed bottom-0 md:left-64 left-0 right-0 bg-slate-900/95 backdrop-blur-sm border-t border-slate-700/50 p-4 z-10">
        <form onSubmit={handleSubmit} className="relative">
          {/* Main Input Field */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-3 pr-20 rounded-xl bg-slate-800/80 border border-slate-600/50 focus:border-ai-blue-400/50 focus:outline-none text-white placeholder-slate-400 text-sm"
              placeholder="Ask a follow-up question..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={disabled}
              autoFocus
            />
            
            {/* Send Button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
              disabled={disabled || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Icon Bar */}
          <div className="flex items-center justify-between mt-3 px-2">
            {/* Left Group - Functionality Icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                title="Generate"
              >
                <Zap className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                title="Visual Search"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>

            {/* Right Group - Action Icons */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                title="Attach File"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="button"
                className="p-2 rounded-lg bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white transition-colors"
                title="Voice Input"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <div className="mt-3 w-full bg-red-900/80 text-red-300 rounded-lg px-4 py-2 text-center text-xs border border-red-700/50">
            {error}
          </div>
        )}
      </div>
    </div>
  );
} 