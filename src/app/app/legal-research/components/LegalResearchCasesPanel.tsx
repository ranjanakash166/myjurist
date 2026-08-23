"use client";

import React from "react";
import { FileText, Copy, Download, Loader2, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { SearchResult } from "@/lib/legalResearchApi";
import { formatCaseTitle } from "../lib/legalResearchUtils";

interface LegalResearchCasesPanelProps {
  results: SearchResult[];
  totalResults: number;
  selectedCase: SearchResult | null;
  selectedCasePdfUrl: string | null;
  isLoadingCasePdf: boolean;
  casePdfError: string | null;
  isGeneratingPDF: boolean;
  onSelectCase: (result: SearchResult) => void;
  onCopyCase: (result: SearchResult) => void;
  onDownloadPDF: (title: string, result: SearchResult) => void;
}

export default function LegalResearchCasesPanel({
  results,
  totalResults,
  selectedCase,
  selectedCasePdfUrl,
  isLoadingCasePdf,
  casePdfError,
  isGeneratingPDF,
  onSelectCase,
  onCopyCase,
  onDownloadPDF,
}: LegalResearchCasesPanelProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg bg-white border border-slate-200 p-12 text-center">
        <Search className="h-10 w-10 text-slate-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900">No results found</h3>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          Try adjusting your search terms or using different keywords to find relevant legal information
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <FileText className="h-6 w-6 text-slate-700" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">Relevant Cases</h2>
        </div>
        <div className="flex items-center gap-1 text-sm text-slate-600">
          <FileText className="h-5 w-5" />
          {totalResults} {totalResults === 1 ? "Result" : "Results"}
        </div>
      </div>

      <div className="p-4 flex flex-col xl:flex-row gap-4">
        <div className="w-full xl:w-[335px] shrink-0 rounded-lg bg-slate-100 overflow-hidden">
          <div className="border-b border-slate-200 px-3 py-4">
            <p className="text-base font-medium text-slate-600">Cases ({results.length})</p>
          </div>
          <div className="max-h-[768px] overflow-y-auto">
            {results.map((result, index) => {
              const isSelected =
                selectedCase?.source_file === result.source_file &&
                selectedCase?.chunk_id === result.chunk_id;
              const rowKey =
                result.document_id ?? (result.chunk_id != null ? String(result.chunk_id) : `row-${index}`);
              return (
                <button
                  key={rowKey}
                  type="button"
                  onClick={() => onSelectCase(result)}
                  className={`w-full text-left p-3 transition-colors border-b border-slate-200/60 ${
                    isSelected ? "bg-blue-100" : "hover:bg-slate-200/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-900">Case {index + 1}</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onCopyCase(result);
                      }}
                      className="h-8 w-8 p-0 shrink-0"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-w-0 rounded-lg bg-slate-100 overflow-hidden flex flex-col min-h-[400px] xl:min-h-[768px]">
          <div className="border-b border-slate-200 px-3 py-4 flex items-center justify-between gap-3">
            <p className="text-base font-medium text-slate-900 truncate">
              {selectedCase ? formatCaseTitle(selectedCase) : "Select a case to preview PDF"}
            </p>
            {selectedCase && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onDownloadPDF(formatCaseTitle(selectedCase), selectedCase)}
                disabled={isGeneratingPDF}
                className="shrink-0"
              >
                {isGeneratingPDF ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                {isGeneratingPDF ? "Generating..." : "Download"}
              </Button>
            )}
          </div>
          <div className="flex-1 bg-slate-50">
            {!selectedCase ? (
              <div className="h-full min-h-[300px] flex items-center justify-center text-sm text-slate-500 px-4 text-center">
                Click any case on the left to render its PDF here.
              </div>
            ) : isLoadingCasePdf ? (
              <div className="h-full min-h-[300px] flex items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading PDF preview...
              </div>
            ) : casePdfError ? (
              <div className="h-full min-h-[300px] flex items-center justify-center p-4">
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{casePdfError}</AlertDescription>
                </Alert>
              </div>
            ) : selectedCasePdfUrl ? (
              <iframe
                src={selectedCasePdfUrl}
                className="w-full h-full min-h-[400px] xl:min-h-[700px] border-0"
                title={formatCaseTitle(selectedCase)}
              />
            ) : (
              <div className="h-full min-h-[300px] flex items-center justify-center text-sm text-slate-500">
                PDF preview unavailable.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
