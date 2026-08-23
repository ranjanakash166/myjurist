"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FileText, Sparkles, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

import { CHAT_PREFILL_KEY } from "../lib/legalResearchUtils";

interface LegalResearchResultsBannerProps {
  query: string;
  totalResults: number;
}

export default function LegalResearchResultsBanner({
  query,
  totalResults,
}: LegalResearchResultsBannerProps) {
  const router = useRouter();

  const handleAskAI = () => {
    sessionStorage.setItem(CHAT_PREFILL_KEY, query);
    router.push("/app/my-jurist-chat");
  };

  return (
    <div
      className="rounded-lg border border-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      style={{
        backgroundImage:
          "linear-gradient(100deg, rgb(219, 234, 254) 0%, rgb(250, 232, 255) 100%)",
      }}
    >
      <div className="space-y-1">
        <p className="text-lg md:text-xl text-slate-900">
          <span className="text-slate-600">Showing results for: </span>
          <span className="font-medium">&quot;{query}&quot;</span>
        </p>
        <div className="flex items-center gap-1 text-sm text-slate-600">
          <FileText className="h-5 w-5" />
          <span>
            {totalResults} {totalResults === 1 ? "Result" : "Results"}
          </span>
        </div>
      </div>
      <Button
        type="button"
        onClick={handleAskAI}
        className="bg-slate-800 hover:bg-slate-900 text-white gap-2 shrink-0"
      >
        <Sparkles className="h-5 w-5" />
        Ask AI
        <ExternalLink className="h-4 w-4" />
      </Button>
    </div>
  );
}