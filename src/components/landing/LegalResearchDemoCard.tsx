"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, FileText, ChevronDown, Filter, Sparkles, Lightbulb, Award, FileCheck, X } from "lucide-react";

type Stage = 0 | 1 | 2 | 3;

const STAGE_DURATION_MS = 2600;
const STAGE_3_HOLD_MS = 4500;

const LegalResearchDemoCard: React.FC = () => {
  const [stage, setStage] = useState<Stage>(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setReducedMotion(
      typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const advance = () => {
      setStage((prev) => ((prev + 1) % 4) as Stage);
    };

    const delay = stage === 3 ? STAGE_3_HOLD_MS : STAGE_DURATION_MS;
    timeoutRef.current = setTimeout(advance, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stage, reducedMotion]);

  const placeholder = "What legal information are you looking for?";
  const typedQuery = "Contract Dispute";

  return (
    <div
      className="h-full flex flex-col min-h-0 overflow-hidden px-4 md:px-6 lg:px-8 pt-2 md:pt-3 pb-4 md:pb-6 lg:pb-8 transition-opacity duration-500 ease-in-out"
      aria-hidden
    >
      {/* Search bar: centered in stage 0, at top when user has typed (stages 1–3) */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          stage === 0 ? "flex-1 flex justify-center items-center" : "flex-none"
        }`}
      >
        <div className="flex items-center gap-2 w-full max-w-full rounded-full bg-white border border-slate-200/80 shadow-sm px-3 py-2.5 min-h-[48px]">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
            <Search className="w-4 h-4 text-blue-600" />
          </div>
          <div
            className={`flex-1 min-w-0 flex items-center ${
              stage === 0 ? "justify-center" : ""
            }`}
          >
            {stage === 0 && (
              <span className="text-slate-500 text-sm md:text-base truncate text-center">
                {placeholder}
              </span>
            )}
            {(stage === 1 || stage === 2 || stage === 3) && (
              <>
                <span className="text-slate-800 text-sm md:text-base">
                  {typedQuery}
                </span>
                {stage === 1 && (
                  <span
                    className="inline-block w-0.5 h-4 md:h-5 bg-blue-600 ml-0.5 animate-pulse"
                    style={{ animationDuration: "1s" }}
                  />
                )}
              </>
            )}
          </div>
          {(stage === 2 || stage === 3) && (
            <button
              type="button"
              className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
              aria-hidden
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* White card: only shimmer (stage 2) and results (stage 3) */}
      <div
        className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-500 ease-in-out ${
          stage === 2 || stage === 3
            ? "opacity-100 mt-2"
            : "max-h-0 opacity-0 mt-0 flex-none"
        }`}
      >
        {stage === 2 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-3 md:p-4">
            {/* Skeleton loading placeholders */}
            <div className="flex justify-end gap-1.5 mb-2 shrink-0">
              <span className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 rounded-full bg-slate-200 animate-pulse" style={{ animationDelay: "300ms" }} />
            </div>
            <div className="space-y-3 flex-1 min-h-0 overflow-hidden max-md:overflow-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-slate-200 shrink-0 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
                    <span className="h-3 rounded bg-slate-200 w-1/4 animate-pulse" style={{ animationDelay: `${i * 80 + 40}ms` }} />
                  </div>
                  <span className="block h-3 rounded bg-slate-200 w-full animate-pulse" style={{ animationDelay: `${i * 80 + 80}ms` }} />
                </div>
              ))}
              <span className="block h-3 rounded bg-slate-200 w-2/3 animate-pulse" style={{ animationDelay: "320ms" }} />
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-3 md:p-4">
            <div className="flex items-center justify-between gap-2 mb-2 text-xs text-slate-600 shrink-0">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                3 Sources analyzed
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 px-2 py-1.5 rounded-md border border-slate-200 bg-white text-slate-700"
                >
                  All courts
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  className="p-1.5 rounded-md border border-slate-200 bg-white text-slate-600"
                >
                  <Filter className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden max-md:overflow-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide space-y-2 min-h-0 pb-2">
              {/* AI Summary */}
              <div className="rounded-lg p-3 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span className="font-semibold text-sm text-slate-800">AI Summary</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  The analysis of the provided search results unequivocally establishes a
                  settled legal position under Indian law: disputes primarily arising from
                  the terms and conditions of…
                  <span className="text-blue-600 font-medium">More</span>
                </p>
              </div>

              {/* Key Legal Insights */}
              <div className="rounded-lg p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-semibold text-sm text-slate-800">Key Legal Insights</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  <strong>Disputed Questions of Fact:</strong> Writ jurisdiction is
                  ill-suited for resolving disputed questions of fact, particularly those
                  arising from contractual terms…
                </p>
              </div>

              {/* Relevant Precedents */}
              <div className="rounded-lg p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-semibold text-sm text-slate-800">Relevant Precedents</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  State of U.P. v. Bridge &amp; Roof Co. (India) Ltd., (1996) 6 SCC 22: A
                  foundational judgment affirming that contractual disputes are generally
                  outside the purview of Article 226.
                </p>
              </div>

              {/* Legal Areas Covered */}
              <div className="rounded-lg p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-sm text-slate-800">Legal Areas Covered</span>
                </div>
                <p className="text-xs text-slate-700">
                  Constitutional Law (specifically, writ jurisdiction under Article 226)
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LegalResearchDemoCard;
