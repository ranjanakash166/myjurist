import React, { useRef, useEffect } from "react";

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
}

export default function ChatInterface({ chat, onSend, input, setInput, loading, streaming, streamedText, error, disabled }: ChatInterfaceProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading, streaming, streamedText]);

  return (
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
        {loading && !streaming && (
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
      <form onSubmit={onSend} className="flex gap-2">
        <input
          type="text"
          className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-ai-blue-500/20 focus:border-ai-blue-400/40 focus:outline-none text-white"
          placeholder="Type your question..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={disabled}
          autoFocus
        />
        <button
          type="submit"
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white font-semibold hover:scale-105 transition-all ai-shadow disabled:opacity-50"
          disabled={disabled || !input.trim()}
        >
          {(loading || streaming) ? "Sending..." : "Send"}
        </button>
      </form>
      {error && (
        <div className="mt-2 w-full bg-red-900/80 text-red-300 rounded-lg px-4 py-2 text-center text-xs">{error}</div>
      )}
    </div>
  );
} 