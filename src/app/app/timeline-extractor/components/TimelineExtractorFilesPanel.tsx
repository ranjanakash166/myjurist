"use client";

import React from "react";
import { FileText, Eye, Download, Loader2 } from "lucide-react";
import type { TimelineDocument } from "@/lib/timelineApi";
import { formatFileSize } from "../lib/timelineExtractorUtils";

interface LocalFileItem {
  name: string;
  size: number;
}

interface TimelineExtractorFilesPanelProps {
  title: string;
  eventCount: number;
  documents: TimelineDocument[];
  localFiles?: LocalFileItem[];
  loading?: boolean;
  onViewDocument?: (documentId: string, filename: string, contentType: string, fileSize: number) => void;
  onDownloadDocument?: (documentId: string, filename: string) => void;
}

export default function TimelineExtractorFilesPanel({
  title,
  eventCount,
  documents,
  localFiles = [],
  loading = false,
  onViewDocument,
  onDownloadDocument,
}: TimelineExtractorFilesPanelProps) {
  const showLocal = documents.length === 0 && localFiles.length > 0;
  const fileCount = showLocal ? localFiles.length : documents.length;

  return (
    <aside className="hidden xl:flex w-[320px] shrink-0 flex-col rounded-xl bg-white border border-slate-200 p-4 min-h-[600px]">
      <div className="mb-4 pb-4 border-b border-slate-200">
        <h3 className="text-base font-semibold text-slate-900 truncate">{title || "Timeline"}</h3>
        <p className="text-xs text-slate-500 mt-1">
          {eventCount} {eventCount === 1 ? "event" : "events"} extracted
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-900">Files ({fileCount})</span>
        {loading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {showLocal
          ? localFiles.map((file, i) => (
              <div
                key={`${file.name}-${i}`}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-fuchsia-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
              </div>
            ))
          : documents.map((doc) => (
              <div
                key={doc.document_id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <FileText className="h-4 w-4 text-fuchsia-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900 truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-500">
                      {formatFileSize(doc.file_size)}
                    </p>
                  </div>
                </div>
                {onViewDocument && onDownloadDocument && (
                  <div className="flex items-center gap-2 mt-2 ml-6">
                    <button
                      type="button"
                      onClick={() =>
                        onViewDocument(
                          doc.document_id,
                          doc.filename,
                          doc.content_type,
                          doc.file_size
                        )
                      }
                      className="p-1 text-slate-400 hover:text-slate-700"
                      aria-label="View document"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDownloadDocument(doc.document_id, doc.filename)}
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
