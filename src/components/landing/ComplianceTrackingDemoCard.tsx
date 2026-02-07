"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  CheckCircle2,
  Paperclip,
  Send,
  Sparkles,
  Copy,
  Download,
  ChevronDown,
} from "lucide-react";

type Stage = 0 | 1 | 2 | 3 | 4;

const STAGE_DURATION_MS = 2800;
const STAGE_4_HOLD_MS = 5000;

const QUERY =
  "How does the use of AI in law enforcement comply with human rights laws?";

const DIRECT_ANSWER =
  "The use of Artificial Intelligence (AI) in law enforcement in India currently operates without a comprehensive legal framework specifically regulating AI, which raises significant concerns regarding its compliance with human rights laws. While AI is being deployed across various sectors, including governance, there are noted failures to secure human rights protections, particularly for marginalized and ethnic minorities, and potential for violations through mass surveillance and discrimination.";

const ComplianceTrackingDemoCard: React.FC = () => {
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
    const advance = () => setStage((prev) => ((prev + 1) % 5) as Stage);
    const delay = stage === 4 ? STAGE_4_HOLD_MS : STAGE_DURATION_MS;
    timeoutRef.current = setTimeout(advance, delay);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [stage, reducedMotion]);

  const stageVisible = (s: Stage) =>
    stage === s ? "opacity-100" : "opacity-0 pointer-events-none";
  const transitionClass = "transition-opacity duration-500 ease-in-out";
  const layerClass =
    "absolute inset-0 flex flex-col min-h-0 px-4 md:px-5 lg:px-6 pt-4 md:pt-5 pb-4 md:pb-5 overflow-hidden";

  const ChatInput = ({
    value,
    showCursor = false,
    placeholder = "Ask me anything about this file...",
  }: {
    value?: string;
    showCursor?: boolean;
    placeholder?: string;
  }) => (
    <div className="flex items-center gap-2 w-full rounded-xl bg-white border border-slate-200/80 shadow-sm px-3 py-2.5 min-h-[48px] mt-auto">
      <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
      <span className="flex-1 min-w-0 text-sm text-slate-500 truncate">
        {value ?? placeholder}
      </span>
      {showCursor && (
        <span
          className="inline-block w-0.5 h-4 bg-blue-600 animate-pulse"
          style={{ animationDuration: "1s" }}
        />
      )}
      <button
        type="button"
        className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0"
        aria-hidden
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div
      className="h-full flex flex-col min-h-0 overflow-hidden relative rounded-xl"
      style={{
        background:
          "linear-gradient(180deg, #F5F3FF 0%, #EFF6FF 40%, #F8FAFC 100%)",
      }}
      aria-hidden
    >
      {/* Stage 0: Welcome + empty chat input */}
      <div
        className={`${layerClass} ${transitionClass} ${stageVisible(0)}`}
      >
        <div className="flex justify-center mt-2 mb-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <h4 className="text-center text-lg font-semibold text-slate-800 mb-0.5">
          Good to see you!
        </h4>
        <h4 className="text-center text-xl font-bold text-slate-900 mb-2">
          How can I be an Assistant?
        </h4>
        <p className="text-center text-xs text-slate-600 max-w-sm mx-auto mb-4 leading-relaxed">
          Ask questions about legal cases, patents, regulatory compliance, or
          general legal topics. I&apos;ll search through our legal database and
          provide you with relevant results.
        </p>
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-emerald-300 bg-white text-emerald-700 text-xs font-medium"
            aria-hidden
          >
            <BookOpen className="w-3.5 h-3.5" />
            Legal Case
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-violet-300 bg-white text-violet-700 text-xs font-medium"
            aria-hidden
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Compliance
          </button>
        </div>
        <ChatInput />
      </div>

      {/* Stage 1: Query typed in input, ready to send */}
      <div className={`${layerClass} ${transitionClass} ${stageVisible(1)}`}>
        <div className="flex justify-center mt-2 mb-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
            style={{
              background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
            }}
          >
            <Sparkles className="w-5 h-5 text-white" />
          </div>
        </div>
        <h4 className="text-center text-lg font-semibold text-slate-800 mb-0.5">
          Good to see you!
        </h4>
        <h4 className="text-center text-xl font-bold text-slate-900 mb-2">
          How can I be an Assistant?
        </h4>
        <p className="text-center text-xs text-slate-600 max-w-sm mx-auto mb-4 leading-relaxed">
          Ask questions about legal cases, patents, regulatory compliance, or
          general legal topics.
        </p>
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-emerald-300 bg-white text-emerald-700 text-xs font-medium"
            aria-hidden
          >
            <BookOpen className="w-3.5 h-3.5" />
            Legal Case
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 border-violet-300 bg-white text-violet-700 text-xs font-medium"
            aria-hidden
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Compliance
          </button>
        </div>
        <div className="flex items-center gap-2 w-full rounded-xl bg-white border border-slate-200/80 shadow-sm px-3 py-2.5 min-h-[48px] mt-auto">
          <Paperclip className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="flex-1 min-w-0 text-sm text-slate-800 truncate">
            How does the use of AI in law enforcement comply
          </span>
          <span
            className="inline-block w-0.5 h-4 bg-blue-600 animate-pulse"
            style={{ animationDuration: "1s" }}
          />
          <button
            type="button"
            className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-white shrink-0"
            aria-hidden
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stage 2: User message sent + Generating Response */}
      <div className={`${layerClass} ${transitionClass} ${stageVisible(2)}`}>
        <div className="flex-1 min-h-0 overflow-hidden overflow-y-auto scrollbar-hide flex flex-col gap-3 py-2">
          <div className="ml-auto max-w-[85%]">
            <p className="text-xs text-slate-500 mb-1">You · Just Now</p>
            <div className="rounded-2xl rounded-tr-md bg-slate-100 border border-slate-200/80 px-3 py-2.5">
              <p className="text-sm text-slate-800">{QUERY}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Sparkles className="w-4 h-4 text-violet-500 shrink-0" />
            <span>Generating Response..</span>
          </div>
        </div>
        <ChatInput />
      </div>

      {/* Stage 3: AI response (partial) + Generating Response */}
      <div className={`${layerClass} ${transitionClass} ${stageVisible(3)}`}>
        <div className="flex-1 min-h-0 overflow-hidden overflow-y-auto scrollbar-hide flex flex-col gap-3 py-2">
          <div className="ml-auto max-w-[85%]">
            <p className="text-xs text-slate-500 mb-1">You · Just Now</p>
            <div className="rounded-2xl rounded-tr-md bg-slate-100 border border-slate-200/80 px-3 py-2.5">
              <p className="text-sm text-slate-800">{QUERY}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 max-w-[90%]">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1">AI Assistant · Just Now</p>
              <div className="rounded-2xl rounded-tl-md bg-white border border-slate-200/80 shadow-sm p-3">
                <p className="font-semibold text-slate-800 text-sm mb-1.5">
                  Direct Answer:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {DIRECT_ANSWER}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                  <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                  <span>Generating Response..</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChatInput />
      </div>

      {/* Stage 4: Full output - document with Legal Status, provisions, Download */}
      <div className={`${layerClass} ${transitionClass} ${stageVisible(4)}`}>
        <div className="flex-1 min-h-0 overflow-hidden overflow-y-auto scrollbar-hide flex flex-col gap-3 py-2">
          <div className="ml-auto max-w-[85%]">
            <p className="text-xs text-slate-500 mb-1">You · Just Now</p>
            <div className="rounded-2xl rounded-tr-md bg-slate-100 border border-slate-200/80 px-3 py-2.5">
              <p className="text-sm text-slate-800">{QUERY}</p>
            </div>
          </div>
          <div className="flex items-start gap-2 max-w-[95%]">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
              style={{
                background: "linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)",
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-slate-500 mb-1">AI Assistant · Just Now</p>
              <div className="rounded-2xl rounded-tl-md bg-white border border-slate-200/80 shadow-sm p-3">
                <p className="font-semibold text-slate-800 text-sm mb-1.5">
                  Direct Answer:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  {DIRECT_ANSWER}
                </p>
                <p className="font-semibold text-slate-800 text-sm mb-1">
                  Legal Status:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  India currently operates without a comprehensive legal framework
                  specifically regulating AI in law enforcement. AI is being
                  deployed across various sectors, including governance. Source
                  1, Source 5, Source 6
                </p>
                <p className="font-semibold text-slate-800 text-sm mb-1">
                  Relevant Legal Provisions:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed mb-3">
                  No comprehensive AI-specific framework exists. The Digital
                  Personal Data Protection (DPDP) Act, 2023, includes provisions
                  on user consent and purpose limitation.
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-xs font-medium"
                    aria-hidden
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-medium"
                    aria-hidden
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download as Doc
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ChatInput />
      </div>
    </div>
  );
};

export default ComplianceTrackingDemoCard;
