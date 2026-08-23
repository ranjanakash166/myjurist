"use client";

import React, { useRef } from "react";
import { FileText, X, Plus, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { formatFileSize } from "../lib/documentCategorizationUtils";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,.rtf";

interface DocumentCategorizationSelectedFilesProps {
  files: File[];
  processing: boolean;
  categorizeError: string | null;
  onSelectFiles: (files: FileList) => void;
  onRemoveFile: (index: number) => void;
  onProceedAndCategorize: () => void;
}

export default function DocumentCategorizationSelectedFiles({
  files,
  processing,
  categorizeError,
  onSelectFiles,
  onRemoveFile,
  onProceedAndCategorize,
}: DocumentCategorizationSelectedFilesProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-fuchsia-700" />
          <h2 className="text-xl font-bold text-slate-900">Selected Files ({files.length})</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={processing}
            onClick={() => inputRef.current?.click()}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add more Files
          </Button>
          <Button
            type="button"
            disabled={processing || files.length === 0}
            onClick={onProceedAndCategorize}
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {processing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            Proceed &amp; Upload
          </Button>
        </div>
      </div>

      {categorizeError && (
        <Alert variant="destructive">
          <AlertDescription>{categorizeError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file, index) => (
          <div
            key={`${file.name}-${file.size}-${index}`}
            className="relative rounded-xl bg-slate-100 border border-slate-200 p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-fuchsia-700" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
              <p className="text-xs text-slate-500 mt-0.5">{formatFileSize(file.size)}</p>
            </div>
            <button
              type="button"
              disabled={processing}
              onClick={() => onRemoveFile(index)}
              className="absolute top-3 right-3 p-1 text-slate-400 hover:text-slate-600"
              aria-label={`Remove ${file.name}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={(e) => {
          if (e.target.files) onSelectFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
