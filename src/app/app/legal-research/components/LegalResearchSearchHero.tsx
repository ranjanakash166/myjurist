"use client";

import React from "react";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LegalResearchSearchHeroProps {
  query: string;
  maxLength: number;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function LegalResearchSearchHero({
  query,
  maxLength,
  isSearching,
  onQueryChange,
  onSubmit,
}: LegalResearchSearchHeroProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-fuchsia-700 bg-clip-text text-transparent">
          Lightning-Fast Legal Research
        </h1>
        <p className="text-lg md:text-xl text-slate-500">
          Search through case law, regulations, and legal precedents
        </p>
      </div>

      <form onSubmit={onSubmit}>
        <div className="rounded-2xl bg-white p-6 shadow-xl border border-slate-100 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <textarea
              value={query}
              onChange={(e) => onQueryChange(e.target.value.slice(0, maxLength))}
              placeholder="What Legal information you are looking for?"
              disabled={isSearching}
              rows={3}
              className="flex-1 resize-none border-0 bg-transparent text-base text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0"
            />
            <span className="text-sm text-slate-400 shrink-0">
              {query.length}/{maxLength}
            </span>
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSearching || !query.trim()}
              className="h-12 w-12 rounded-lg bg-blue-600 hover:bg-blue-700 p-0"
              aria-label="Search"
            >
              {isSearching ? (
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              ) : (
                <Search className="h-6 w-6 text-white" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
