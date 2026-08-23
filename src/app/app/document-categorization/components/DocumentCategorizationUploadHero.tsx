"use client";

import React, { useRef } from "react";
import { Upload, Files } from "lucide-react";
import { Button } from "@/components/ui/button";
import DocumentCategorizationSettingsPanel from "./DocumentCategorizationSettingsPanel";

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,.rtf";

interface DocumentCategorizationUploadHeroProps {
  multiLabel: boolean;
  onMultiLabelChange: (value: boolean) => void;
  confidenceThresholdPct: number;
  onConfidenceThresholdChange: (value: number) => void;
  customCategories: string[];
  categoryInput: string;
  onCategoryInputChange: (value: string) => void;
  onAddCategory: (value: string) => void;
  onRemoveCategory: (category: string) => void;
  onSelectFiles: (files: FileList) => void;
}

export default function DocumentCategorizationUploadHero({
  multiLabel,
  onMultiLabelChange,
  confidenceThresholdPct,
  onConfidenceThresholdChange,
  customCategories,
  categoryInput,
  onCategoryInputChange,
  onAddCategory,
  onRemoveCategory,
  onSelectFiles,
}: DocumentCategorizationUploadHeroProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (files && files.length > 0) onSelectFiles(files);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-700 bg-clip-text text-transparent">
          Document Categorization
        </h1>
        <p className="text-lg text-slate-500">Smart document classification and sorting.</p>
        <p className="text-base text-slate-500">
          AI categorizes documents by type with confidence scores.
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
          onClick={() => inputRef.current?.click()}
          className="w-full max-w-[246px] h-auto py-3.5 bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Files className="h-5 w-5" />
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

      <DocumentCategorizationSettingsPanel
        multiLabel={multiLabel}
        onMultiLabelChange={onMultiLabelChange}
        confidenceThresholdPct={confidenceThresholdPct}
        onConfidenceThresholdChange={onConfidenceThresholdChange}
        customCategories={customCategories}
        categoryInput={categoryInput}
        onCategoryInputChange={onCategoryInputChange}
        onAddCategory={onAddCategory}
        onRemoveCategory={onRemoveCategory}
      />
    </div>
  );
}
