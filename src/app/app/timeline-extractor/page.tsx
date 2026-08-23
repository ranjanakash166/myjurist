"use client";

import React, { useState } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import DocumentViewerModal from "@/components/DocumentViewerModal";
import { useTimelineExtractorPageState } from "./hooks/useTimelineExtractorPageState";
import TimelineExtractorShell from "./components/TimelineExtractorShell";
import TimelineExtractorSidebar from "./components/TimelineExtractorSidebar";
import TimelineExtractorUploadHero from "./components/TimelineExtractorUploadHero";
import TimelineExtractorSelectedFiles from "./components/TimelineExtractorSelectedFiles";
import TimelineExtractorShimmer from "./components/TimelineExtractorShimmer";
import TimelineExtractorResultsPanel from "./components/TimelineExtractorResultsPanel";
import TimelineExtractorFilesPanel from "./components/TimelineExtractorFilesPanel";

export default function TimelineExtractorPage() {
  const state = useTimelineExtractorPageState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebar = (
    <TimelineExtractorSidebar
      groupedTimelines={state.groupedTimelines}
      timelinesLoading={state.timelinesLoading}
      activeTimelineId={state.activeTimelineId}
      onNewTimeline={() => {
        state.resetToNewTimeline();
        setMobileSidebarOpen(false);
      }}
      onSelectTimeline={(item) => {
        state.handleSelectTimeline(item);
        setMobileSidebarOpen(false);
      }}
      onDeleteTimeline={(id) => void state.handleDeleteTimeline(id)}
    />
  );

  const filesPanelTitle = state.displayData?.title || state.timelineTitle || "Timeline";
  const filesPanelEventCount = state.displayData?.totalEvents ?? 0;
  const localFileItems = state.localFiles.map((f) => ({ name: f.name, size: f.size }));

  const renderWithFilesPanel = (main: React.ReactNode) => (
    <div className="flex gap-4 max-w-[1400px] mx-auto w-full">
      {main}
      <TimelineExtractorFilesPanel
        title={filesPanelTitle}
        eventCount={state.processing ? 0 : filesPanelEventCount}
        documents={state.timelineDocuments}
        localFiles={state.processing ? localFileItems : undefined}
        loading={state.resultsLoading}
        onViewDocument={
          state.viewMode === "results"
            ? (id, name, type, size) => void state.handleViewDocument(id, name, type, size)
            : undefined
        }
        onDownloadDocument={
          state.viewMode === "results"
            ? (id, name) => void state.handleDownloadDocument(id, name)
            : undefined
        }
      />
    </div>
  );

  const renderMain = () => {
    if (state.viewMode === "upload") {
      return (
        <TimelineExtractorUploadHero
          timelineTitle={state.timelineTitle}
          onTimelineTitleChange={state.setTimelineTitle}
          includeSummary={state.includeSummary}
          onIncludeSummaryChange={state.setIncludeSummary}
          eventTypesFilter={state.eventTypesFilter}
          onEventTypesFilterChange={state.setEventTypesFilter}
          dateRangeFilter={state.dateRangeFilter}
          onDateRangeFilterChange={state.setDateRangeFilter}
          advancedOpen={state.advancedOpen}
          onAdvancedOpenChange={state.setAdvancedOpen}
          onSelectFiles={state.handleSelectFiles}
        />
      );
    }

    if (state.viewMode === "file-selection") {
      return (
        <TimelineExtractorSelectedFiles
          files={state.localFiles}
          timelineTitle={state.timelineTitle}
          onTimelineTitleChange={state.setTimelineTitle}
          extracting={state.processing}
          extractError={state.extractError}
          onSelectFiles={state.handleSelectFiles}
          onRemoveFile={state.handleRemoveLocalFile}
          onProceedAndExtract={() => void state.handleProceedAndExtract()}
        />
      );
    }

    if (state.viewMode === "extracting") {
      return renderWithFilesPanel(<TimelineExtractorShimmer />);
    }

    if (state.displayData) {
      return renderWithFilesPanel(
        <TimelineExtractorResultsPanel
          data={state.displayData}
          loading={state.resultsLoading}
          onExportCSV={() => void state.handleExportCSV()}
        />
      );
    }

    return null;
  };

  return (
    <>
      <TimelineExtractorShell sidebar={sidebar}>
        <div className="space-y-4">
          <div className="lg:hidden flex justify-end">
            <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
              <SheetTrigger asChild>
                <Button type="button" variant="outline" size="sm" className="gap-2">
                  <PanelLeft className="h-4 w-4" />
                  Timelines
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] p-0">
                {sidebar}
              </SheetContent>
            </Sheet>
          </div>
          {renderMain()}
        </div>
      </TimelineExtractorShell>

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
