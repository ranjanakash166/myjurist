"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, FileText, ChevronDown, Filter, Sparkles, Lightbulb, Award, Target, X } from "lucide-react";

type Stage = 0 | 1 | 2;

const STAGE_DURATION_MS = 2800;
const STAGE_2_HOLD_MS = 4500;

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
      setStage((prev) => {
        const next: Stage = prev === 0 ? 1 : prev === 1 ? 2 : 0;
        return next;
      });
    };

    const delay = stage === 2 ? STAGE_2_HOLD_MS : STAGE_DURATION_MS;
    timeoutRef.current = setTimeout(advance, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stage, reducedMotion]);

  const placeholder = "What legal information are you looking for?";
  const typedQuery = "Contract Dispute";

  return (
    <div
      className="h-full flex flex-col px-6 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12 transition-opacity duration-500 ease-in-out"
      style={{
        background: "linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
      }}
      aria-hidden
    >
      {/* Stage 0: center search bar; Stage 1 & 2: search bar at top */}
      <div
        className={`transition-all duration-500 ease-in-out min-h-0 ${
          stage === 0
            ? "flex-1 flex justify-center items-center"
            : "flex-none"
        }`}
      >
        <div className="flex items-center gap-2 w-full max-w-full rounded-full bg-white border border-slate-200/80 shadow-sm px-4 py-3 min-h-[52px]">
        <div className="flex-shrink-0 w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center">
          <Search className="w-4 h-4 text-blue-600" />
        </div>
        <div className="flex-1 min-w-0 flex items-center">
          {stage === 0 && (
            <span className="text-slate-500 text-sm md:text-base truncate">
              {placeholder}
            </span>
          )}
          {(stage === 1 || stage === 2) && (
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
        <button
          type="button"
          className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white hover:bg-slate-600 transition-colors"
          aria-hidden
        >
          <X className="w-4 h-4" />
        </button>
        </div>
      </div>

      {/* Stage 2 only: results header + content below search */}
      <div
        className={`flex flex-col min-h-0 overflow-hidden transition-all duration-500 ease-in-out ${
          stage === 2 ? "flex-1 opacity-100 mt-5" : "flex-none max-h-0 opacity-0 mt-0"
        }`}
      >
        {stage === 2 && (
          <>
            <div className="flex items-center justify-between gap-2 mb-4 text-xs text-slate-600">
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

            <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide space-y-3 min-h-0 pb-6">
              {/* AI Summary */}
              <div className="rounded-lg p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-purple-600" />
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
              <div className="rounded-lg p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-sm text-slate-800">Key Legal Insights</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  <strong>Disputed Questions of Fact:</strong> Writ jurisdiction is
                  ill-suited for resolving disputed questions of fact, particularly those
                  arising from contractual terms…
                </p>
              </div>

              {/* Relevant Precedents */}
              <div className="rounded-lg p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-sm text-slate-800">Relevant Precedents</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed line-clamp-2">
                  State of U.P. v. Bridge &amp; Roof Co. (India) Ltd., (1996) 6 SCC 22: A
                  foundational judgment affirming that contractual disputes are generally
                  outside the purview of Article 226.
                </p>
              </div>

              {/* Legal Areas Covered */}
              <div className="rounded-lg p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/30 transition-opacity duration-300 ease-out">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-sm text-slate-800">Legal Areas Covered</span>
                </div>
                <p className="text-xs text-slate-700">
                  Constitutional Law (specifically, writ jurisdiction under Article 226)
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LegalResearchDemoCard;
