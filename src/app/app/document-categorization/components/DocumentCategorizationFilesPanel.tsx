"use client";

import React from "react";
import { FileText, Eye, Download, Loader2 } from "lucide-react";
import { formatFileSize } from "../lib/documentCategorizationUtils";

interface FileItem {
  name: string;
  size?: string;
  hasLocalFile?: boolean;
}

interface DocumentCategorizationFilesPanelProps {
  sessionLabel: string;
  categoryCount: number;
  files: FileItem[];
  localFiles?: File[];
  loading?: boolean;
  onViewFile?: (filename: string) => void;
  onDownloadFile?: (filename: string) => void;
}

export default function DocumentCategorizationFilesPanel({
  sessionLabel,
  categoryCount,
  files,
  localFiles = [],
  loading = false,
  onViewFile,
  onDownloadFile,
}: DocumentCategorizationFilesPanelProps) {
  const showLocal = files.length === 0 && localFiles.length > 0;
  const fileCount = showLocal ? localFiles.length : files.length;

  return (
    <aside className="hidden xl:flex w-[320px] shrink-0 flex-col rounded-xl bg-white border border-slate-200 p-4 min-h-[600px]">
      <div className="mb-4 pb-4 border-b border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 truncate">{sessionLabel}</h3>
        <p className="text-xs text-slate-500 mt-1">
          {categoryCount} {categoryCount === 1 ? "Category" : "Categories"} Found
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-900">Files ({fileCount})</span>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {showLocal
          ? localFiles.map((file, i) => (
              <div key={`${file.name}-${i}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-fuchsia-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            ))
          : files.map((file) => (
              <div
                key={file.name}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-fuchsia-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    {file.size && <p className="text-xs text-slate-500">{file.size}</p>}
                  </div>
                </div>
                {file.hasLocalFile && onViewFile && onDownloadFile && (
                  <div className="flex items-center gap-2 mt-2 ml-6">
                    <button
                      type="button"
                      onClick={() => onViewFile(file.name)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      aria-label="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadFile(file.name)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                      aria-label="Download document"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}

        {fileCount === 0 && !loading && (
          <p className="text-sm text-slate-400 text-center py-4">No files</p>
        )}
      </div>
    </aside>
  );
}
