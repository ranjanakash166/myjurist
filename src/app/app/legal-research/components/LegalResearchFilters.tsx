"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SearchType } from "../hooks/useLegalResearchPageState";

interface LegalResearchFiltersProps {
  searchType: SearchType;
  topK: number;
  onSearchTypeChange: (value: SearchType) => void;
  onTopKChange: (value: number) => void;
  onClearFilters: () => void;
}

export default function LegalResearchFilters({
  searchType,
  topK,
  onSearchTypeChange,
  onTopKChange,
  onClearFilters,
}: LegalResearchFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs text-slate-900">Court Type</label>
        <Select value={searchType} onValueChange={(v) => onSearchTypeChange(v as SearchType)}>
          <SelectTrigger className="h-10 text-xs bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="general">All Courts</SelectItem>
            <SelectItem value="supreme_court">Supreme Court</SelectItem>
            <SelectItem value="high_court">High Court</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-slate-900">No. of Results</label>
        <Select value={topK.toString()} onValueChange={(v) => onTopKChange(parseInt(v, 10))}>
          <SelectTrigger className="h-10 text-xs bg-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onClearFilters}
        className="w-full h-9 text-xs border-slate-900"
      >
        Clear Filters
      </Button>
    </div>
  );
}
