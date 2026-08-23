"use client";

import React, { useRef } from "react";
import { Upload, Files, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,.rtf";

interface DocumentAnalysisUploadHeroProps {
  onSelectFiles: (files: FileList) => void;
  uploading?: boolean;
}

export default function DocumentAnalysisUploadHero({
  onSelectFiles,
  uploading = false,
}: DocumentAnalysisUploadHeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) onSelectFiles(files);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-700 bg-clip-text text-transparent">
          Document Analysis
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
          Upload and analyze legal documents with AI. Get detailed insights, risk assessment, and
          chat with AI about your documents.
        </p>
      </div>

      <div
        className="rounded-2xl bg-white border-2 border-dashed border-slate-300 p-8 md:p-12 flex flex-col items-center gap-6 shadow-sm"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <div className="w-[72px] h-[72px] rounded-lg bg-slate-100 flex items-center justify-center">
          <Upload className="h-10 w-10 text-slate-500" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-xl font-bold text-slate-900">Upload Documents</h2>
          <p className="text-sm text-slate-500">
            Drop files here or click to browse
            <br />
            Supports PDF, DOC, DOCX, TXT &amp; RTF files | Multiple files allowed
          </p>
        </div>
        <Button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-[246px] h-auto py-3.5 bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Files className="h-5 w-5" />
          )}
          Select Files
        </Button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
