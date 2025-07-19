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
        <div className="mb-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700/30 text-blue-800 dark:text-blue-100 text-sm font-semibold text-center">
          Continuing previous chat session: <span className="font-mono text-blue-900 dark:text-blue-200">{continuingSessionId.slice(0, 8)}...</span>
        </div>
      )}

      {/* Scrollable Chat Area - Fixed height with proper bottom padding */}
      <div className="flex-1 overflow-y-auto pb-32 bg-gray-50 dark:bg-gray-900/40 rounded-lg p-4 transition-all border border-gray-200 dark:border-gray-700/30 relative">
        {chat.length === 0 && !loading && !streaming && (
          <div className="flex items-center justify-center h-full text-black dark:text-gray-400">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800/60 rounded-full flex items-center justify-center border border-gray-300 dark:border-gray-600/30">
                <Search className="w-8 h-8 text-black dark:text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-black dark:text-gray-200">Start a Conversation</h3>
              <p className="text-sm text-black dark:text-gray-400">Ask questions about your document to get started</p>
            </div>
          </div>
        )}
        
        {chat.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-4 flex items-end gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "system" && (
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                AI
              </div>
            )}
            <div
              className={`px-4 py-3 rounded-2xl max-w-md text-sm shadow-lg transition-all duration-200 ${
                msg.sender === "user"
                  ? "bg-blue-600 dark:bg-blue-600 text-white rounded-br-md"
                  : "bg-white dark:bg-gray-800 text-black dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-600"
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-xs mt-2 ${msg.sender === "user" ? "text-blue-100" : "text-black dark:text-gray-400"}`}>
                {formatTime(new Date(msg.time))}
              </div>
            </div>
            {msg.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 bg-gray-600 dark:bg-gray-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
            )}
          </div>
        ))}
        
        {/* Simulated streaming bubble */}
        {streaming && (
          <div className="mb-4 flex items-end gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-lg border border-gray-200 dark:border-gray-600 rounded-bl-md">
              <div className="whitespace-pre-wrap">{streamedText || <span className="opacity-60">Typing...</span>}</div>
              <div className="text-xs text-black dark:text-gray-400 mt-2 flex items-center gap-1">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-black dark:bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-black dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-black dark:bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {loading && !streaming && (
          <div className="mb-4 flex items-end gap-3 justify-start">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-600 dark:bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              AI
            </div>
            <div className="px-4 py-3 rounded-2xl max-w-md text-sm bg-white dark:bg-gray-800 text-black dark:text-gray-100 shadow-lg border border-gray-200 dark:border-gray-600 rounded-bl-md">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black dark:border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating response...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
        
        {/* Fixed Input at Bottom - Part of Chat Container */}
        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-950/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700/50 p-4 shadow-xl">
        <form onSubmit={handleSubmit} className="w-full">
            {/* Main Input Field */}
            <div className="relative mb-3">
              <input
                ref={inputRef}
                type="text"
                className="w-full px-4 py-4 pr-16 rounded-2xl bg-white dark:bg-gray-900/80 border border-gray-300 dark:border-gray-600/50 focus:border-blue-500 dark:focus:border-blue-500/50 focus:outline-none text-black dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-500 text-base shadow-lg transition-all duration-200"
                placeholder="Ask a follow-up question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={disabled}
                autoFocus
              />
              
              {/* Send Button */}
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
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
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-all duration-200 border border-gray-300 dark:border-gray-600/30 shadow-md hover:shadow-lg"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-all duration-200 border border-gray-300 dark:border-gray-600/30 shadow-md hover:shadow-lg"
                  title="Generate"
                >
                  <Zap className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-all duration-200 border border-gray-300 dark:border-gray-600/30 shadow-md hover:shadow-lg"
                  title="Visual Search"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>

              {/* Right Group - Action Icons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-all duration-200 border border-gray-300 dark:border-gray-600/30 shadow-md hover:shadow-lg"
                  title="Attach File"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 text-black dark:text-gray-300 hover:text-black dark:hover:text-gray-100 transition-all duration-200 border border-gray-300 dark:border-gray-600/30 shadow-md hover:shadow-lg"
                  title="Voice Input"
                >
                  <Mic className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-3 w-full bg-red-50 dark:bg-red-900/80 text-red-700 dark:text-red-200 rounded-xl px-4 py-3 text-center text-sm border border-red-200 dark:border-red-700/50 shadow-lg">
                {error}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
} 