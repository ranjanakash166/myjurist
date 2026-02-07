"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Upload,
  Check,
  FileText,
  Send,
  Sparkles,
} from "lucide-react";

type Stage = 0 | 1 | 2 | 3 | 4;

const STAGE_DURATION_MS = 2600;
const STAGE_4_HOLD_MS = 4500;

const STEPS = ["Upload Files", "Ask Questions", "Get Answers"] as const;

const SmartDraftingDemoCard: React.FC = () => {
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
      setStage((prev) => ((prev + 1) % 5) as Stage);
    };

    const delay = stage === 4 ? STAGE_4_HOLD_MS : STAGE_DURATION_MS;
    timeoutRef.current = setTimeout(advance, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stage, reducedMotion]);

  // Stepper: step 0 active for stages 0–1, step 1 active for stage 2, step 2 active for stage 3, all done for stage 4
  const completedStepCount =
    stage === 0 || stage === 1 ? 0 : stage === 2 ? 1 : stage === 3 ? 2 : 3;
  const activeStepIndex =
    stage === 0 || stage === 1 ? 0 : stage === 2 ? 1 : stage === 3 ? 2 : -1;

  return (
    <div
      className="h-full flex flex-col min-h-0 overflow-hidden overflow-x-hidden px-6 md:px-8 lg:px-10 py-8 md:py-10 lg:py-12 transition-opacity duration-500 ease-in-out"
      aria-hidden
    >
      {/* Stepper: on gradient, above card */}
      <div className="flex-none flex items-center justify-center gap-2 mb-6">
        {STEPS.map((label, i) => {
          const completed = i < completedStepCount;
          const active = i === activeStepIndex;
          const isLast = i === STEPS.length - 1;
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors ${
                    completed
                      ? "bg-blue-600 border-blue-600 text-white"
                      : active
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-slate-200 text-slate-400"
                  }`}
                >
                  {completed ? (
                    <Check className="w-4 h-4" strokeWidth={2.5} />
                  ) : (
                    <span
                      className={`w-2 h-2 rounded-full ${active ? "bg-white" : "bg-slate-300"}`}
                    />
                  )}
                </div>
                <span
                  className={`text-xs mt-1.5 font-medium whitespace-nowrap ${
                    completed || active ? "text-slate-700" : "text-slate-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`w-8 md:w-12 h-0.5 rounded transition-colors ${
                    completed ? "bg-blue-600" : "bg-slate-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Card area: only white card content; stages 3 and 4 card constrained like Legal Research */}
      <div
        className={`flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-500 ease-in-out ${
          stage >= 0 ? "opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {/* Stage 0: Upload – white card with drop zone */}
        {stage === 0 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-5">
            <div className="flex-1 min-h-0 flex flex-col justify-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50 p-6">
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                  <Upload className="w-5 h-5 text-slate-500" />
                </div>
              </div>
              <p className="text-center font-semibold text-slate-700 text-sm mb-1">
                Drag & drop or Click to browse
              </p>
              <p className="text-center text-slate-500 text-xs mb-6">
                Supports pdf, txt, doc, docx, & rtf files
              </p>
              <div className="flex justify-center gap-4 items-center">
                <div className="w-10 h-12 rounded bg-red-500 flex items-center justify-center text-white text-[10px] font-bold">
                  PDF
                </div>
                <button
                  type="button"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-700 text-white text-sm font-medium"
                  aria-hidden
                >
                  <Upload className="w-4 h-4" />
                  Upload
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 1: Upload success – white card with file */}
        {stage === 1 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-5">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white">
              <div className="w-10 h-12 rounded bg-red-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                PDF
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  file 187656.pdf
                </p>
                <p className="text-slate-500 text-xs">4.2 MB</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <Check className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
        )}

        {/* Stage 2: Ask Questions – white card with file + input */}
        {stage === 2 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-5">
            <div className="flex items-center gap-3 p-3 rounded-lg border border-blue-200/80 bg-slate-50/50 mb-4 shrink-0">
              <div className="w-6 h-6 rounded border-2 border-blue-600 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 text-blue-600" strokeWidth={2.5} />
              </div>
              <div className="w-8 h-10 rounded bg-red-500 flex items-center justify-center text-white text-[8px] font-bold shrink-0">
                PDF
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">
                  file 187656.pdf
                </p>
                <p className="text-slate-500 text-xs">4.2 MB</p>
              </div>
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
              <div className="flex items-center gap-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 min-h-[52px] shadow-sm">
                <span className="text-slate-800 text-sm">
                  Summarize this document.
                </span>
                <span
                  className="inline-block w-0.5 h-4 bg-blue-600 animate-pulse"
                  style={{ animationDuration: "1s" }}
                />
                <div className="flex-1" />
                <button
                  type="button"
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 flex items-center justify-center text-white shrink-0"
                  aria-hidden
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stage 3: Shimmer – white card with skeleton (Get Answers loading) */}
        {stage === 3 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-5">
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
              <div className="space-y-3 flex-1 min-h-0 overflow-hidden max-md:overflow-hidden md:overflow-y-auto scrollbar-hide">
                <div className="h-4 rounded bg-slate-200 w-3/4 animate-pulse" style={{ animationDelay: "0ms" }} />
                <div className="h-4 rounded bg-slate-200 w-1/2 animate-pulse" style={{ animationDelay: "80ms" }} />
                <div className="h-24 rounded bg-slate-200 w-full animate-pulse mt-2" style={{ animationDelay: "160ms" }} />
              </div>
            </div>
          </div>
        )}

        {/* Stage 4: Get Answers – white card with file ref + AI Summary */}
        {stage === 4 && (
          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-5">
            <div className="flex items-center gap-2 mb-4 shrink-0 text-slate-600">
              <FileText className="w-4 h-4 shrink-0" />
              <span className="font-medium text-sm text-slate-800 truncate">
                file 187656.pdf
              </span>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden max-md:overflow-y-hidden max-md:overflow-x-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide">
              <div className="rounded-lg p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-sm text-slate-800">
                    AI Summary
                  </span>
                </div>
                <div className="text-xs text-slate-700 leading-relaxed space-y-2">
                  <p>
                    This document is about a Rental/Lease Agreement.
                  </p>
                  <p>
                    The provided sections indicate that it is a request for
                    missing mandatory information needed to draft a comprehensive
                    Rental/Lease Agreement under Indian law.
                  </p>
                  <p>
                    It lists various details such as Tenant&apos;s PAN, Property
                    Address, Monthly Rent, Security Deposit, Lease Start Date,
                    Lease Duration, and Maintenance Charges, which are all
                    components of such an agreement.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SmartDraftingDemoCard;
