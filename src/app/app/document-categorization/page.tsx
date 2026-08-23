"use client";

import React, { useState } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DocumentViewerModal from "@/components/DocumentViewerModal";
import { useDocumentCategorizationPageState } from "./hooks/useDocumentCategorizationPageState";
import DocumentCategorizationShell from "./components/DocumentCategorizationShell";
import DocumentCategorizationSidebar from "./components/DocumentCategorizationSidebar";
import DocumentCategorizationUploadHero from "./components/DocumentCategorizationUploadHero";
import DocumentCategorizationSelectedFiles from "./components/DocumentCategorizationSelectedFiles";
import DocumentCategorizationShimmer from "./components/DocumentCategorizationShimmer";
import DocumentCategorizationResultsPanel from "./components/DocumentCategorizationResultsPanel";
import DocumentCategorizationFilesPanel from "./components/DocumentCategorizationFilesPanel";

export default function DocumentCategorizationPage() {
  const state = useDocumentCategorizationPageState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebar = (
    <DocumentCategorizationSidebar
      groupedHistory={state.groupedHistory}
      historyLoading={state.historyLoading}
      activeRequestId={state.activeRequestId}
      onNewSession={() => {
        state.resetToNewSession();
        setMobileSidebarOpen(false);
      }}
      onSelectHistoryItem={(item) => {
        void state.handleSelectHistoryItem(item);
        setMobileSidebarOpen(false);
      }}
    />
  );

  const renderWithFilesPanel = (main: React.ReactNode) => (
    <div className="flex gap-4 max-w-[1400px] mx-auto w-full">
      {main}
      <DocumentCategorizationFilesPanel
        sessionLabel={state.sessionLabel}
        categoryCount={state.processing ? 0 : state.categoryCount}
        files={state.resultFileItems}
        localFiles={state.processing ? state.localFiles : undefined}
        loading={state.resultsLoading}
        onViewFile={
          state.viewMode === "results" ? (name) => state.handleViewLocalFile(name) : undefined
        }
        onDownloadFile={
          state.viewMode === "results" ? (name) => state.handleDownloadLocalFile(name) : undefined
        }
      />
    </div>
  );

  const renderMain = () => {
    if (state.viewMode === "upload") {
      return (
        <DocumentCategorizationUploadHero
          multiLabel={state.multiLabel}
          onMultiLabelChange={state.setMultiLabel}
          confidenceThresholdPct={state.confidenceThresholdPct}
          onConfidenceThresholdChange={state.setConfidenceThresholdPct}
          customCategories={state.customCategories}
          categoryInput={state.categoryInput}
          onCategoryInputChange={state.setCategoryInput}
          onAddCategory={state.handleAddCategory}
          onRemoveCategory={state.handleRemoveCategory}
          onSelectFiles={(files) => state.validateAndMergeFiles(files)}
        />
      );
    }

    if (state.viewMode === "file-selection") {
      return (
        <DocumentCategorizationSelectedFiles
          files={state.localFiles}
          processing={state.processing}
          categorizeError={state.categorizeError}
          onSelectFiles={(files) => state.validateAndMergeFiles(files)}
          onRemoveFile={state.handleRemoveLocalFile}
          onProceedAndCategorize={() => void state.handleProceedAndCategorize()}
        />
      );
    }

    if (state.viewMode === "categorizing") {
      return renderWithFilesPanel(<DocumentCategorizationShimmer />);
    }

    if (state.categorizationResult) {
      return renderWithFilesPanel(
        <DocumentCategorizationResultsPanel
          result={state.categorizationResult}
          loading={state.resultsLoading}
        />
      );
    }

    return null;
  };

  return (
    <>
      <DocumentCategorizationShell sidebar={sidebar}>
        <div className="space-y-4">
          <div className="lg:hidden flex justify-end">
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <PanelLeft className="h-4 w-4" />
                  Sessions
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                {sidebar}
              </SheetContent>
            </Sheet>
          </div>
          {renderMain()}
        </div>
      </DocumentCategorizationShell>

      <DocumentViewerModal
        isOpen={state.documentModalOpen}
        onClose={state.handleCloseDocumentModal}
        documentUrl={state.documentUrl}
        filename={state.documentModalFilename}
        fileType={state.documentModalType}
        fileSize={state.documentModalSize}
      />
    </>
  );
}
