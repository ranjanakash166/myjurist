import React from "react";
import { Paperclip, Clock } from "lucide-react";

interface HistoryItem {
  document_id: string;
  session_id: string;
  filename: string;
  created_at: string;
}

interface DocumentHistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function DocumentHistoryList({ history, onSelect }: DocumentHistoryListProps) {
  return (
    <div className="glass-effect rounded-2xl p-8 flex flex-col w-full">
      <h2 className="text-xl font-bold gradient-text-animate mb-6">Document Analysis History</h2>
      <div className="flex flex-col gap-3">
        {history.map(item => (
          <button
            key={item.session_id}
            className="flex items-center justify-between bg-slate-800/60 border border-ai-blue-500/20 rounded-lg px-4 py-3 hover:bg-ai-blue-500/10 transition-all"
            onClick={() => onSelect(item)}
          >
            <div className="flex items-center gap-3">
              <Paperclip className="w-5 h-5 text-ai-blue-400" />
              <span className="font-medium text-white">{item.filename}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Clock className="w-4 h-4" />
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 