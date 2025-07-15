import React from "react";
import { Paperclip, Clock, Download, Eye } from "lucide-react";

interface HistoryItem {
  document_id: string;
  filename: string;
  upload_timestamp: string;
}

interface DocumentHistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void | Promise<void>;
  onDownload: (documentId: string, filename: string) => void | Promise<void>;
  onView: (documentId: string, filename: string) => void | Promise<void>;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function DocumentHistoryList({ history, onSelect, onDownload, onView, page, pageSize, totalCount, onPageChange }: DocumentHistoryListProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  return (
    <div className="glass-effect rounded-2xl p-8 flex flex-col w-full">
      <h2 className="text-xl font-bold gradient-text-animate mb-6">Document Analysis History</h2>
      <div className="flex flex-col gap-3 mb-4">
        {history.map(item => (
          <div
            key={item.document_id}
            className="flex items-center justify-between bg-slate-800/60 border border-ai-blue-500/20 rounded-lg px-4 py-3 hover:bg-ai-blue-500/10 transition-all"
          >
            <button
              className="flex items-center gap-3 flex-1 text-left"
              onClick={() => onSelect(item)}
            >
              <Paperclip className="w-5 h-5 text-ai-blue-400" />
              <span className="font-medium text-white">{item.filename}</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-slate-400 text-sm mr-4">
                <Clock className="w-4 h-4" />
                {new Date(item.upload_timestamp).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(item.document_id, item.filename);
                  }}
                  className="p-2 rounded-lg hover:bg-ai-blue-500/20 text-ai-blue-400 hover:text-ai-blue-300 transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownload(item.document_id, item.filename);
                  }}
                  className="p-2 rounded-lg hover:bg-ai-blue-500/20 text-ai-blue-400 hover:text-ai-blue-300 transition-colors"
                  title="Download Document"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-2">
          <button
            className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 0}
          >
            Prev
          </button>
          <span className="text-slate-300 text-sm">Page {page + 1} of {totalPages}</span>
          <button
            className="px-3 py-1 rounded bg-slate-700 text-white disabled:opacity-50"
            onClick={() => onPageChange(page + 1)}
            disabled={page + 1 >= totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
} 