"use client";

import React from "react";
import {
  Sparkles,
  Copy,
  Download,
  FileText,
  Lightbulb,
  BookOpen,
  Zap,
  AlertTriangle,
  Target,
  Loader2,
  Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { normalizeContentLineBreaks, parseBoldText, parseMarkdownText } from "@/lib/utils";
import type { AISummaryResponse } from "@/lib/legalResearchApi";
import { formatFileName, getParsedAISummaryData } from "../lib/legalResearchUtils";

interface LegalResearchAISummaryProps {
  aiSummary: AISummaryResponse | null;
  isSearching: boolean;
  onCopy: (text: string) => void;
  onDownload: () => void;
}

function SummarySection({
  title,
  icon: Icon,
  iconClass,
  bgClass,
  titleClass,
  children,
}: {
  title: string;
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
  titleClass: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg ${bgClass}`}>
      <div className="flex items-center gap-2 px-4 py-2">
        <Icon className={`h-5 w-5 ${iconClass}`} />
        <h3 className={`text-base font-medium ${titleClass}`}>{title}</h3>
      </div>
      <div className="px-4 pb-4 pt-1">{children}</div>
    </div>
  );
}

export default function LegalResearchAISummary({
  aiSummary,
  isSearching,
  onCopy,
  onDownload,
}: LegalResearchAISummaryProps) {
  if (isSearching) {
    return (
      <div className="rounded-lg bg-white border border-slate-200 p-12 text-center">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900">Generating AI Summary...</h3>
        <p className="text-slate-500 mt-2">Analyzing search results and creating intelligent summary</p>
      </div>
    );
  }

  if (!aiSummary) {
    return (
      <div className="rounded-lg bg-white border border-slate-200 p-12 text-center">
        <Brain className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-slate-900">No AI Summary Available</h3>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          AI summary will be generated automatically when search results are found
        </p>
      </div>
    );
  }

  const parsed = getParsedAISummaryData(aiSummary);
  let summaryText = parsed.ai_summary;
  if (parsed.ai_summary === aiSummary.ai_summary && aiSummary.ai_summary.includes('"ai_summary"')) {
    const match = aiSummary.ai_summary.match(/"ai_summary":\s*"([^"]+)"/);
    if (match) summaryText = match[1];
  }

  return (
    <div className="rounded-lg bg-white border border-slate-200 overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-slate-700" />
          </div>
          <h2 className="text-xl font-semibold text-slate-900">AI Summary</h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onCopy(parsed.ai_summary)}
            className="gap-2 border-slate-900 text-xs"
          >
            <Copy className="h-4 w-4" />
            Copy Summary
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onDownload}
            className="gap-2 border-slate-900 text-xs"
          >
            <Download className="h-4 w-4" />
            Download Summary
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <SummarySection
          title="Summary"
          icon={FileText}
          iconClass="text-blue-700"
          bgClass="bg-blue-50"
          titleClass="text-blue-700"
        >
          <div className="text-base leading-relaxed text-slate-900">
            {parseMarkdownText(normalizeContentLineBreaks(summaryText))}
          </div>
        </SummarySection>

        {parsed.key_legal_insights && parsed.key_legal_insights.length > 0 && (
          <SummarySection
            title="Key Legal Insights"
            icon={Lightbulb}
            iconClass="text-fuchsia-700"
            bgClass="bg-fuchsia-50"
            titleClass="text-fuchsia-700"
          >
            <ul className="list-disc pl-6 space-y-2 text-base text-slate-900">
              {parsed.key_legal_insights.map((item, i) => (
                <li key={i}>{parseBoldText(item)}</li>
              ))}
            </ul>
          </SummarySection>
        )}

        {parsed.relevant_precedents && parsed.relevant_precedents.length > 0 && (
          <SummarySection
            title="Relevant Precedents"
            icon={Lightbulb}
            iconClass="text-orange-700"
            bgClass="bg-orange-50"
            titleClass="text-orange-700"
          >
            <ul className="list-disc pl-6 space-y-2 text-base text-slate-900">
              {parsed.relevant_precedents.map((item, i) => (
                <li key={i}>{parseBoldText(item)}</li>
              ))}
            </ul>
          </SummarySection>
        )}

        {parsed.statutory_provisions && parsed.statutory_provisions.length > 0 && (
          <SummarySection
            title="Statutory Provisions"
            icon={BookOpen}
            iconClass="text-indigo-700"
            bgClass="bg-indigo-50"
            titleClass="text-indigo-700"
          >
            <ul className="list-disc pl-6 space-y-2 text-base text-slate-900">
              {parsed.statutory_provisions.map((item, i) => (
                <li key={i}>{parseBoldText(item)}</li>
              ))}
            </ul>
          </SummarySection>
        )}

        {parsed.procedural_developments && parsed.procedural_developments.length > 0 && (
          <SummarySection
            title="Procedural Developments"
            icon={Zap}
            iconClass="text-green-700"
            bgClass="bg-green-50"
            titleClass="text-green-700"
          >
            <ul className="list-disc pl-6 space-y-2 text-base text-slate-900">
              {parsed.procedural_developments.map((item, i) => (
                <li key={i}>{parseBoldText(item)}</li>
              ))}
            </ul>
          </SummarySection>
        )}

        {parsed.practical_implications && parsed.practical_implications.length > 0 && (
          <SummarySection
            title="Practical Implications"
            icon={AlertTriangle}
            iconClass="text-red-700"
            bgClass="bg-red-50"
            titleClass="text-red-700"
          >
            <ul className="list-disc pl-6 space-y-2 text-base text-slate-900">
              {parsed.practical_implications.map((item, i) => (
                <li key={i}>{parseBoldText(item)}</li>
              ))}
            </ul>
          </SummarySection>
        )}

        {parsed.legal_areas_covered && parsed.legal_areas_covered.length > 0 && (
          <SummarySection
            title="Legal Areas Covered"
            icon={Target}
            iconClass="text-slate-700"
            bgClass="bg-slate-50"
            titleClass="text-slate-900"
          >
            <div className="flex flex-wrap gap-2">
              {parsed.legal_areas_covered.map((area, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-sky-200 px-2 py-1 text-base text-slate-900"
                >
                  {area}
                </span>
              ))}
            </div>
          </SummarySection>
        )}

        {aiSummary.sources_analyzed && aiSummary.sources_analyzed.length > 0 && (
          <SummarySection
            title="Sources Analyzed"
            icon={FileText}
            iconClass="text-slate-600"
            bgClass="bg-slate-50"
            titleClass="text-slate-900"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {aiSummary.sources_analyzed.map((source, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  <FileText className="h-4 w-4 text-slate-500 shrink-0" />
                  <span className="truncate">{formatFileName(source)}</span>
                </div>
              ))}
            </div>
          </SummarySection>
        )}
      </div>
    </div>
  );
}
