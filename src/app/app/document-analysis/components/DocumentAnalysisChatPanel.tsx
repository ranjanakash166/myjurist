"use client";

import React, { useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Paperclip,
  Loader2,
  Eye,
  Download,
  X,
  FileText,
  Pencil,
} from "lucide-react";
import SimpleMarkdownRenderer from "@/components/SimpleMarkdownRenderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ChatMessage, DADocument } from "@/lib/documentAnalysisApi";
import { formatFileSize, getProcessingLabel } from "../lib/documentAnalysisUtils";

interface DocumentAnalysisChatPanelProps {
  messages: ChatMessage[];
  input: string;
  maxLength: number;
  chatLoading: boolean;
  messagesLoading: boolean;
  chatError: string | null;
  userInitial: string;
  contextFileCount: number;
  uploadingNewDocuments: boolean;
  onInputChange: (value: string) => void;
  onSend: (e: React.FormEvent) => void;
  onUploadNewDocuments: (files: FileList) => void;
}

export default function DocumentAnalysisChatPanel({
  messages,
  input,
  maxLength,
  chatLoading,
  messagesLoading,
  chatError,
  userInitial,
  contextFileCount,
  uploadingNewDocuments,
  onInputChange,
  onSend,
  onUploadNewDocuments,
}: DocumentAnalysisChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatLoading]);

  return (
    <div className="flex flex-1 flex-col min-h-[600px] min-w-0">
      <div className="flex-1 overflow-y-auto rounded-xl bg-white border border-slate-200 p-4 md:p-6">
        {messagesLoading ? (
          <div className="flex h-full items-center justify-center text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : messages.length === 0 && !chatLoading ? (
          <div className="flex h-full min-h-[400px] items-center justify-center">
            <div className="text-center space-y-4 max-w-md">
              <div className="mx-auto w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">Start a conversation</h3>
              <p className="text-sm text-slate-500">
                Ask questions about your documents to get AI-powered insights and analysis.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-3xl mx-auto">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={cn(
                  "flex items-end gap-3",
                  msg.sender === "user" ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === "system" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 max-w-[85%] text-sm shadow-sm",
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-white border border-slate-200 text-slate-900 rounded-bl-md"
                  )}
                >
                  <SimpleMarkdownRenderer
                    content={msg.text}
                    className={cn(
                      "text-sm leading-relaxed",
                      msg.sender === "user" &&
                        "[&_a]:text-white [&_p]:text-white [&_li]:text-white [&_ul]:text-white"
                    )}
                  />
                </div>
                {msg.sender === "user" && (
                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                    {userInitial}
                  </div>
                )}
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-end gap-3 justify-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="rounded-2xl px-4 py-3 bg-white border border-slate-200 text-sm">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating response…
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className="mt-4 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm relative">
        {uploadingNewDocuments && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10 rounded-2xl">
            <div className="flex items-center gap-2 text-slate-700">
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading documents…
            </div>
          </div>
        )}
        <form onSubmit={onSend} className="space-y-3">
          <div className="flex items-start gap-3">
            <textarea
              value={input}
              onChange={(e) => onInputChange(e.target.value.slice(0, maxLength))}
              placeholder="Ask a legal Question…"
              rows={2}
              disabled={chatLoading || messagesLoading}
              className="flex-1 resize-none border-0 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <span className="text-sm text-slate-400 shrink-0 pt-1">
              {input.length}/{maxLength}
            </span>
          </div>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={uploadingNewDocuments}
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
                aria-label="Attach documents"
              >
                <Paperclip className="h-4 w-4" />
              </button>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                {contextFileCount} {contextFileCount === 1 ? "file" : "files"} in context
              </span>
            </div>
            <Button
              type="submit"
              disabled={chatLoading || messagesLoading || !input.trim()}
              className="h-10 w-10 p-0 bg-blue-600 hover:bg-blue-700 rounded-lg"
              aria-label="Send message"
            >
              <Send className="h-4 w-4 text-white" />
            </Button>
          </div>
          {chatError && <p className="text-sm text-red-600">{chatError}</p>}
        </form>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.rtf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              onUploadNewDocuments(e.target.files);
              e.target.value = "";
            }
          }}
        />
      </div>
    </div>
  );
}

interface DocumentAnalysisSessionFilesPanelProps {
  sessionName: string;
  documents: DADocument[];
  chatDocuments: DADocument[];
  documentsLoading: boolean;
  uploadingNewDocuments: boolean;
  onView: (documentId: string, filename: string) => void;
  onDownload: (documentId: string, filename: string) => void;
  onRemove: (documentId: string) => void;
}

export function DocumentAnalysisSessionFilesPanel({
  sessionName,
  documents,
  chatDocuments,
  documentsLoading,
  uploadingNewDocuments,
  onView,
  onDownload,
  onRemove,
}: DocumentAnalysisSessionFilesPanelProps) {
  const sessionIds = new Set(documents.map((d) => d.id));
  const pendingDocs = chatDocuments.filter(
    (d) => !sessionIds.has(d.id) && getProcessingLabel(d.processing_status)
  );

  return (
    <aside className="hidden xl:flex w-[320px] shrink-0 flex-col rounded-xl bg-white border border-slate-200 p-4 min-h-[600px]">
      <div className="mb-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-semibold text-slate-900 truncate">{sessionName}</h3>
          <Pencil className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden />
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Documents in this session are used as context for your queries.
        </p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-slate-900">Files ({documents.length})</span>
        {documentsLoading && <Loader2 className="h-4 w-4 animate-spin text-slate-400" />}
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {documents.length === 0 && !documentsLoading && !uploadingNewDocuments ? (
          <p className="text-sm text-slate-400 py-4 text-center">No documents in context</p>
        ) : (
          documents.map((doc) => (
            <FileRow
              key={doc.id}
              doc={doc}
              onView={onView}
              onDownload={onDownload}
              onRemove={onRemove}
            />
          ))
        )}

        {(uploadingNewDocuments || pendingDocs.length > 0) &&
          pendingDocs.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-slate-200 bg-slate-50 p-3 opacity-80"
            >
              <div className="flex items-start gap-2">
                <FileText className="h-4 w-4 text-fuchsia-700 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">{doc.filename}</p>
                  <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    {getProcessingLabel(doc.processing_status) || "Analyzing…"}
                  </p>
                </div>
              </div>
            </div>
          ))}

        {uploadingNewDocuments && pendingDocs.length === 0 && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs text-blue-600 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Uploading…
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

function FileRow({
  doc,
  onView,
  onDownload,
  onRemove,
}: {
  doc: DADocument;
  onView: (id: string, name: string) => void;
  onDownload: (id: string, name: string) => void;
  onRemove: (id: string) => void;
}) {
  const statusLabel = getProcessingLabel(doc.processing_status);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 hover:bg-slate-100 transition-colors">
      <div className="flex items-start gap-2">
        <FileText className="h-4 w-4 text-fuchsia-700 shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-slate-900 truncate">{doc.filename}</p>
          <p className="text-xs text-slate-500">{formatFileSize(doc.file_size)}</p>
          {statusLabel && (
            <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              {statusLabel}
            </p>
          )}
        </div>
      </div>
      {!statusLabel && (
        <div className="flex items-center gap-2 mt-2 ml-6">
          <button
            type="button"
            onClick={() => onView(doc.id, doc.filename)}
            className="p-1 text-slate-400 hover:text-slate-700"
            aria-label="View document"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onDownload(doc.id, doc.filename)}
            className="p-1 text-slate-400 hover:text-slate-700"
            aria-label="Download document"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(doc.id)}
            className="p-1 text-slate-400 hover:text-red-600 ml-auto"
            aria-label="Remove from context"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
