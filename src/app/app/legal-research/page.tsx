"use client";

import React, { useState } from "react";
import { AlertCircle, PanelLeft } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLegalResearchPageState } from "./hooks/useLegalResearchPageState";
import LegalResearchShell from "./components/LegalResearchShell";
import LegalResearchSidebar from "./components/LegalResearchSidebar";
import LegalResearchSearchHero from "./components/LegalResearchSearchHero";
import LegalResearchRecentSearches from "./components/LegalResearchRecentSearches";
import LegalResearchResultsBanner from "./components/LegalResearchResultsBanner";
import LegalResearchAISummary from "./components/LegalResearchAISummary";
import LegalResearchCasesPanel from "./components/LegalResearchCasesPanel";
import LegalResearchSavedPlaceholder from "./components/LegalResearchSavedPlaceholder";
import LegalResearchHistory from "./components/LegalResearchHistory";
import LegalResearchSkeleton from "./components/LegalResearchSkeleton";

export default function LegalResearchPage() {
  const state = useLegalResearchPageState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebar = (
    <LegalResearchSidebar
      sidebarTab={state.sidebarTab}
      onSidebarTabChange={(tab) => {
        state.setSidebarTab(tab);
        setMobileSidebarOpen(false);
      }}
      onNewSearch={() => {
        state.resetToNewSearch();
        setMobileSidebarOpen(false);
      }}
      searchType={state.searchType}
      topK={state.topK}
      onSearchTypeChange={state.setSearchType}
      onTopKChange={state.setTopK}
      onClearFilters={state.clearFilters}
      quickSearchQueries={state.quickSearchQueries}
      onQuickSearch={(q) => {
        state.handleQuickSearch(q);
        setMobileSidebarOpen(false);
      }}
    />
  );

  const renderSearchMain = () => {
    const showResults = !!state.searchResults;

    if (showResults) {
      return (
        <div className="mx-auto max-w-6xl space-y-6">
          <LegalResearchResultsBanner
            query={state.searchResults!.query}
            totalResults={state.searchResults!.total_results}
          />
          <LegalResearchAISummary
            aiSummary={state.aiSummary}
            isSearching={state.isSearching}
            onCopy={state.handleCopyContent}
            onDownload={state.handleDownloadSummary}
          />
          <LegalResearchCasesPanel
            results={state.searchResults!.results}
            totalResults={state.searchResults!.total_results}
            selectedCase={state.selectedCase}
            selectedCasePdfUrl={state.selectedCasePdfUrl}
            isLoadingCasePdf={state.isLoadingCasePdf}
            casePdfError={state.casePdfError}
            isGeneratingPDF={state.isGeneratingPDF}
            onSelectCase={state.handleSelectCase}
            onCopyCase={(r) => state.handleCopyContent(state.buildCaseCopyText(r))}
            onDownloadPDF={state.handleDownloadPDF}
          />
        </div>
      );
    }

    return (
      <>
        <LegalResearchSearchHero
          query={state.query}
          maxLength={state.maxQueryLength}
          isSearching={state.isSearching}
          onQueryChange={state.setQuery}
          onSubmit={state.handleSearch}
        />
        <LegalResearchRecentSearches
          items={state.recentHistory}
          isLoading={state.isLoadingRecentHistory}
          onSelect={state.handleQuickSearch}
        />
      </>
    );
  };

  const renderMainContent = () => {
    if (state.sidebarTab === "history") {
      return <LegalResearchHistory embedded />;
    }
    if (state.sidebarTab === "saved") {
      return <LegalResearchSavedPlaceholder />;
    }
    return (
      <div className="space-y-6">
        <div className="lg:hidden flex justify-end">
          <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
            <SheetTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="gap-2">
                <PanelLeft className="h-4 w-4" />
                Menu
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] p-0">
              {sidebar}
            </SheetContent>
          </Sheet>
        </div>
        {state.error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state.isSearching && !state.searchResults ? (
          <LegalResearchSkeleton />
        ) : (
          renderSearchMain()
        )}
      </div>
    );
  };

  return (
    <LegalResearchShell sidebar={sidebar}>
      {renderMainContent()}
    </LegalResearchShell>
  );
}
