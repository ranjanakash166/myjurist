"use client";

import React, { useState } from "react";
import { PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import PdfViewerModal from "@/components/PdfViewerModal";
import { useDocumentAnalysisPageState } from "./hooks/useDocumentAnalysisPageState";
import DocumentAnalysisShell from "./components/DocumentAnalysisShell";
import DocumentAnalysisSidebar from "./components/DocumentAnalysisSidebar";
import DocumentAnalysisUploadHero from "./components/DocumentAnalysisUploadHero";
import DocumentAnalysisSelectedFiles from "./components/DocumentAnalysisSelectedFiles";
import DocumentAnalysisChatPanel, {
  DocumentAnalysisSessionFilesPanel,
} from "./components/DocumentAnalysisChatPanel";
import DocumentAnalysisSkeleton from "./components/DocumentAnalysisSkeleton";

export default function DocumentAnalysisPage() {
  const state = useDocumentAnalysisPageState();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const sidebar = (
    <DocumentAnalysisSidebar
      groupedSessions={state.groupedSessions}
      sessionsLoading={state.sessionsLoading}
      activeSessionId={state.activeSessionId}
      onNewSession={() => {
        state.resetToNewSession();
        setMobileSidebarOpen(false);
      }}
      onSelectSession={(item) => {
        void state.handleSelectSession(item);
        setMobileSidebarOpen(false);
      }}
    />
  );

  const renderMain = () => {
    if (state.viewMode === "upload") {
      return (
        <DocumentAnalysisUploadHero
          onSelectFiles={state.handleSelectFiles}
          uploading={state.uploading}
        />
      );
    }

    if (state.viewMode === "file-selection") {
      return (
        <DocumentAnalysisSelectedFiles
          files={state.localFiles}
          uploading={state.uploading}
          uploadError={state.uploadError}
          onSelectFiles={state.handleSelectFiles}
          onRemoveFile={state.handleRemoveLocalFile}
          onProceedAndUpload={() => void state.handleProceedAndUpload()}
        />
      );
    }

    return (
      <div className="flex gap-4 max-w-[1400px] mx-auto w-full">
        {state.messagesLoading ? (
          <div className="flex-1">
            <DocumentAnalysisSkeleton />
          </div>
        ) : (
          <DocumentAnalysisChatPanel
            messages={state.chatMessages}
            input={state.chatInput}
            maxLength={state.maxQueryLength}
            chatLoading={state.chatLoading}
            messagesLoading={state.messagesLoading}
            chatError={state.chatError}
            userInitial={state.userInitial}
            contextFileCount={state.sessionDocuments.length}
            uploadingNewDocuments={state.uploadingNewDocuments}
            onInputChange={state.setChatInput}
            onSend={(e) => void state.handleSendMessage(e)}
            onUploadNewDocuments={(files) => void state.handleUploadNewDocuments(files)}
          />
        )}
        <DocumentAnalysisSessionFilesPanel
          sessionName={state.activeSession?.name ?? "Session"}
          documents={state.sessionDocuments}
          chatDocuments={state.chatDocuments}
          documentsLoading={state.documentsLoading}
          uploadingNewDocuments={state.uploadingNewDocuments}
          onView={(id, name) => void state.handleViewDocument(id, name)}
          onDownload={(id, name) => void state.handleDownloadDocument(id, name)}
          onRemove={(id) => void state.handleRemoveFromSession(id)}
        />
      </div>
    );
  };

  return (
    <>
      <DocumentAnalysisShell sidebar={sidebar}>
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
      </DocumentAnalysisShell>

      <PdfViewerModal
        isOpen={state.pdfModalOpen}
        onClose={state.handleClosePdfModal}
        pdfUrl={state.pdfUrl}
        filename={state.pdfFilename}
      />
    </>
  );
}
