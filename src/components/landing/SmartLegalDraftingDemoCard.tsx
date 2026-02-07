"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  ChevronRight,
  Check,
  Sparkles,
  Download,
  Pencil,
  ChevronDown,
} from "lucide-react";

type Stage = 0 | 1 | 2 | 3 | 4 | 5;

const STAGE_DURATION_MS = 2600;
const STAGE_5_HOLD_MS = 4500;

const TEMPLATE_ITEMS = [
  { name: "Corporate Business Contract", count: 19, color: "bg-slate-600" },
  { name: "Power of Attorney Contract", count: 10, color: "bg-purple-500" },
  { name: "Property Contract", count: 7, color: "bg-indigo-600" },
  { name: "Will Contract", count: 5, color: "bg-teal-500" },
  { name: "Family Law Contract", count: 12, color: "bg-amber-600" },
  { name: "Bonds Contract", count: 8, color: "bg-emerald-500" },
];

const SmartLegalDraftingDemoCard: React.FC = () => {
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
      setStage((prev) => ((prev + 1) % 6) as Stage);
    };

    const delay = stage === 5 ? STAGE_5_HOLD_MS : STAGE_DURATION_MS;
    timeoutRef.current = setTimeout(advance, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stage, reducedMotion]);

  // Stage 0–1: template list (0 = initial, 1 = scrolled)
  // Stage 2: Family Law selected
  // Stage 3: Divorce Agreement selected (document preview)
  // Stage 4: required inputs form
  // Stage 5: agreement with download / edit

  const renderTemplateRow = (
    item: (typeof TEMPLATE_ITEMS)[0],
    selected?: boolean
  ) => (
    <div
      key={item.name}
      className={`flex items-center gap-3 p-3 rounded-xl bg-white border transition-colors ${
        selected ? "border-blue-300 ring-1 ring-blue-200" : "border-slate-200"
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
      >
        <FileText className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 text-sm truncate">
          {item.name}
        </p>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
          {item.count} Templates
        </span>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
    </div>
  );

  const stageVisible = (s: Stage) =>
    stage === s
      ? "opacity-100"
      : "opacity-0 pointer-events-none";
  const transitionClass = "transition-opacity duration-500 ease-in-out";
  const stageLayerClass = "absolute inset-0 flex flex-col min-h-0 px-4 md:px-6 lg:px-8 pt-4 md:pt-5 lg:pt-6 pb-6 md:pb-8 lg:pb-10";

  return (
    <div
      className="h-full flex flex-col min-h-0 overflow-hidden px-4 md:px-6 lg:px-8 pt-4 md:pt-5 lg:pt-6 pb-6 md:pb-8 lg:pb-10 relative"
      aria-hidden
    >
      {/* Stage 0: List shows contract templates */}
      <div
        className={`${stageLayerClass} ${transitionClass} ${stageVisible(0)}`}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-3">
          <div className="flex-1 min-h-0 overflow-hidden max-md:overflow-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide space-y-2 pr-1">
            {TEMPLATE_ITEMS.slice(0, 5).map((item) => renderTemplateRow(item))}
            <div className="h-14 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Stage 1: User slides and sees more templates */}
      <div
        className={`${stageLayerClass} ${transitionClass} ${stageVisible(1)}`}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-3">
          <div
            className="flex-1 min-h-0 overflow-hidden max-md:overflow-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide space-y-2 pr-1 transition-transform duration-700 ease-out"
            style={{ transform: "translateY(-72px)" }}
          >
            {TEMPLATE_ITEMS.map((item) => renderTemplateRow(item))}
          </div>
        </div>
      </div>

      {/* Stage 2: User selects Family Law Contract */}
      <div
        className={`${stageLayerClass} ${transitionClass} ${stageVisible(2)}`}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-3">
          <div className="flex-1 min-h-0 overflow-hidden max-md:overflow-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide space-y-2 pr-1">
            {TEMPLATE_ITEMS.map((item) =>
              renderTemplateRow(
                item,
                item.name === "Family Law Contract"
              )
            )}
          </div>
        </div>
      </div>

      {/* Stage 3: User selects Divorce Agreement (document cards) */}
      <div
        className={`${stageLayerClass} ${transitionClass} ${stageVisible(3)}`}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
          <div className="flex-1 min-h-0 flex items-center gap-2 overflow-hidden">
            <div className="w-1/4 min-w-[80px] flex-shrink-0 -ml-2 rounded-xl border border-slate-200 bg-white p-3 opacity-80">
              <p className="text-slate-400 text-xs truncate">…d of Adoption</p>
              <div className="mt-2 space-y-1.5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-2 rounded bg-slate-200 w-full"
                  />
                ))}
              </div>
            </div>
            <div className="flex-1 min-w-0 rounded-xl border-2 border-blue-200 bg-white p-4 shadow-sm">
              <p className="font-semibold text-slate-800 text-sm mb-3">
                Divorce Agreement
              </p>
              <div className="space-y-2">
                {[90, 70, 65, 40, 30].map((w, i) => (
                  <div
                    key={i}
                    className="h-2.5 rounded bg-slate-200"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stage 4: Required inputs */}
      <div
        className={`${stageLayerClass} ${transitionClass} ${stageVisible(4)}`}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
          <div className="flex items-center gap-2 mb-3 shrink-0">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Required Information
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden max-md:overflow-hidden md:overflow-y-auto md:overflow-x-hidden scrollbar-hide">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  1st Party Name
                </label>
                <div className="h-9 rounded-lg border border-slate-200 bg-white px-3 flex items-center text-sm text-slate-800">
                  Suraj Verma
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  2nd Party Name
                </label>
                <div className="h-9 rounded-lg border border-slate-200 bg-white px-3 flex items-center text-sm text-slate-800">
                  Kumari Neeta
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Additional Details
                </label>
                <div className="h-14 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-400 resize-none flex items-start">
                  Enter details here
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 flex justify-end shrink-0 pt-2 border-t border-slate-100">
            <span
              role="img"
              aria-hidden
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-800 text-white text-sm font-medium cursor-default select-none"
            >
              <Sparkles className="w-4 h-4" />
              Generate Contract
            </span>
          </div>
        </div>
      </div>

      {/* Stage 5: Agreement with download / edit */}
      <div
        className={`${stageLayerClass} ${transitionClass} ${stageVisible(5)}`}
      >
        <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden p-4">
          <div className="flex-1 min-h-0 flex gap-3 overflow-hidden">
            <div className="flex-1 min-w-0 rounded-xl border border-slate-200 bg-white p-4 overflow-hidden max-md:overflow-hidden md:overflow-y-auto scrollbar-hide">
              <p className="font-semibold text-slate-800 text-sm mb-3">
                Divorce Agreement
              </p>
              <div className="space-y-2">
                {[95, 85, 80, 50, 35, 25].map((w, i) => (
                  <div
                    key={i}
                    className="h-2.5 rounded bg-slate-200"
                    style={{ width: `${w}%` }}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <span
                role="img"
                aria-hidden
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg bg-blue-600 text-white text-xs font-medium cursor-default select-none"
              >
                <Download className="w-3.5 h-3.5" />
                Download as Doc
                <ChevronDown className="w-3.5 h-3.5" />
              </span>
              <span
                role="img"
                aria-hidden
                className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-800 text-xs font-medium cursor-default select-none"
              >
                <Pencil className="w-3.5 h-3.5" />
                Edit
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartLegalDraftingDemoCard;
