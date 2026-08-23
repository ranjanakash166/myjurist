"use client";

import React, { useState } from "react";
import { BarChart3, FileText, Loader2, AlertTriangle } from "lucide-react";
import type { DocumentCategorizationResponse } from "@/lib/documentCategorizationApi";
import { formatConfidencePercent } from "../lib/documentCategorizationUtils";

interface DocumentCategorizationResultsPanelProps {
  result: DocumentCategorizationResponse;
  loading?: boolean;
}

export default function DocumentCategorizationResultsPanel({
  result,
  loading = false,
}: DocumentCategorizationResultsPanelProps) {
  const [expandedFilenames, setExpandedFilenames] = useState<Set<string>>(new Set());

  const toggleExpand = (filename: string) => {
    setExpandedFilenames((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px] text-slate-400">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const sortedSummary = Object.entries(result.summary).sort(([, a], [, b]) => b - a);
  const maxCount = Math.max(...Object.values(result.summary), 1);

  return (
    <div className="flex-1 min-w-0 space-y-6">
      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-fuchsia-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Category Distribution</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          {sortedSummary.map(([category, count]) => (
            <div key={category} className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-slate-900 truncate">{category}</span>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                  {count} document(s)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-fuchsia-600"
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl bg-white border border-slate-200 overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-100">
          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <FileText className="h-5 w-5 text-fuchsia-700" />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">Document Result</h2>
        </div>
        <div className="p-6 space-y-4">
          {result.categorization_results.map((doc) => {
            const expanded = expandedFilenames.has(doc.filename);
            const sortedCategories = [...doc.assigned_categories].sort(
              (a, b) => b.confidence - a.confidence
            );

            return (
              <div
                key={doc.filename}
                className="rounded-xl border border-slate-200 bg-slate-50/50 overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3 p-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-900 truncate">{doc.filename}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {sortedCategories.length}{" "}
                      {sortedCategories.length === 1 ? "Category" : "Categories"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {sortedCategories.slice(0, 4).map((cat) => (
                        <span
                          key={cat.category}
                          className="inline-flex px-2 py-1 rounded-lg bg-sky-200 text-xs text-slate-900"
                        >
                          {cat.category} ({formatConfidencePercent(cat.confidence)}%)
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleExpand(doc.filename)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 shrink-0"
                  >
                    {expanded ? "− Collapse" : "+ Expand"}
                  </button>
                </div>

                {expanded && (
                  <div className="border-t border-slate-200 bg-white px-4 py-4 space-y-4">
                    {sortedCategories.map((cat) => (
                      <div key={cat.category} className="space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-xs text-slate-800">
                            {cat.category}
                          </span>
                          <span className="text-xs text-slate-500">
                            Confidence Score: {formatConfidencePercent(cat.confidence)}%
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          <span className="font-medium text-slate-700">Reasoning: </span>
                          {cat.reasoning}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {doc.error_message && (
                  <div className="mx-4 mb-4 p-3 rounded-lg bg-red-50 border border-red-100 flex gap-2 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                    {doc.error_message}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
