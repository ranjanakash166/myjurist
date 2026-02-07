import React, { useRef, useState } from "react";
import { Paperclip, Upload, FileText, Calendar, Settings, Filter, X, Eye, Download, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import DocumentViewerModal from "../../../components/DocumentViewerModal";

interface TimelineUploaderProps {
  files: File[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  timelineTitle: string;
  setTimelineTitle: (title: string) => void;
  includeSummary: boolean;
  setIncludeSummary: (include: boolean) => void;
  eventTypesFilter: string;
  setEventTypesFilter: (filter: string) => void;
  dateRangeFilter: string;
  setDateRangeFilter: (filter: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  processing: boolean;
  error?: string | null;
}

export default function TimelineUploader({
  files,
  onFileChange,
  timelineTitle,
  setTimelineTitle,
  includeSummary,
  setIncludeSummary,
  eventTypesFilter,
  setEventTypesFilter,
  dateRangeFilter,
  setDateRangeFilter,
  onGenerate,
  processing,
  error
}: TimelineUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRemoveFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    // Update files directly since we can't create a proper synthetic event
    const syntheticEvent = {
      target: {
        files: newFiles
      }
    } as unknown as React.ChangeEvent<HTMLInputElement>;
    onFileChange(syntheticEvent);
  };

  const handleViewFile = (file: File) => {
    setSelectedFile(file);
    setIsModalOpen(true);
  };

  const handleDownloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleOpenFileInNewTab = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    // Note: URL will be revoked when the page is closed
  };

  return (
    <div className="space-y-6">
      {/* Timeline Title */}
      <div className="space-y-2">
        <Label htmlFor="timeline-title" className="text-sm font-semibold text-foreground">
          <Calendar className="w-4 h-4 inline mr-2" />
          Timeline Title
        </Label>
        <Input
          id="timeline-title"
          type="text"
          placeholder="Enter a descriptive title for your timeline"
          value={timelineTitle}
          onChange={(e) => setTimelineTitle(e.target.value)}
          className="w-full"
          required
        />
        <p className="text-xs text-muted-foreground">
          Choose a clear, descriptive name to help you identify this timeline later
        </p>
      </div>

      {/* File Upload Area */}
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-foreground">
          <Upload className="w-4 h-4 inline mr-2" />
          Upload Documents
        </Label>
        
        {/* Modern File Upload Area */}
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onFileChange}
            disabled={processing}
            accept=".pdf,.doc,.docx,.txt,.rtf"
          />
          <div className="border-2 border-dashed border-primary/40 rounded-xl p-8 text-center hover:border-primary transition-colors duration-200 bg-primary/5 dark:bg-primary/10">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary-foreground" />
            </div>
            <p className="text-lg font-medium mb-2">Drop files here or click to browse</p>
            <p className="text-sm text-muted-foreground mb-4">
              Supports PDF, DOC, DOCX, TXT, RTF files • Multiple files allowed
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
              <Upload className="w-4 h-4" />
              Choose Files
            </div>
          </div>
        </div>

        {/* Selected Files Preview */}
        {files.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Selected Files ({files.length})
            </h4>
            <div className="grid gap-2">
              {files.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border hover:bg-muted/80 transition-colors">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" title={file.name}>{file.name}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <Badge variant="secondary" className="text-xs">
                          {file.type || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleViewFile(file)}
                      className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                      disabled={processing}
                      title="View File"
                    >
                      <Eye className="w-4 h-4 text-primary" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleOpenFileInNewTab(file)}
                      className="p-1 hover:bg-primary/10 rounded-full transition-colors"
                      disabled={processing}
                      title="Open in New Tab"
                    >
                      <ExternalLink className="w-4 h-4 text-primary" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(file)}
                      className="p-1 hover:bg-purple-100 dark:hover:bg-purple-900/20 rounded-full transition-colors"
                      disabled={processing}
                      title="Download File"
                    >
                      <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(idx)}
                      className="p-1 hover:bg-destructive/10 rounded-full transition-colors"
                      disabled={processing}
                      title="Remove File"
                    >
                      <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Separator />

      {/* Advanced Options */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Advanced Options
        </h4>
        
        {/* Include Summary Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="include-summary" className="text-sm font-medium">
              Include Summary
            </Label>
            <p className="text-xs text-muted-foreground">
              Generate an AI summary of the timeline events
            </p>
          </div>
          <Switch
            id="include-summary"
            checked={includeSummary}
            onCheckedChange={setIncludeSummary}
            disabled={processing}
          />
        </div>

        {/* Event Types Filter */}
        <div className="space-y-2">
          <Label htmlFor="event-types-filter" className="text-sm font-medium">
            <Filter className="w-4 h-4 inline mr-2" />
            Event Types Filter (Optional)
          </Label>
          <Input
            id="event-types-filter"
            type="text"
            placeholder="e.g., filings, hearings, judgments, amendments"
            value={eventTypesFilter}
            onChange={(e) => setEventTypesFilter(e.target.value)}
            className="w-full"
            disabled={processing}
          />
          <p className="text-xs text-muted-foreground">
            Comma-separated list of event types to include or exclude
          </p>
        </div>

        {/* Date Range Filter */}
        <div className="space-y-2">
          <Label htmlFor="date-range-filter" className="text-sm font-medium">
            <Calendar className="w-4 h-4 inline mr-2" />
            Date Range Filter (Optional)
          </Label>
          <Input
            id="date-range-filter"
            type="text"
            placeholder="e.g., 2020-01-01 to 2024-12-31"
            value={dateRangeFilter}
            onChange={(e) => setDateRangeFilter(e.target.value)}
            className="w-full"
            disabled={processing}
          />
          <p className="text-xs text-muted-foreground">
            Filter events within a specific date range (YYYY-MM-DD format)
          </p>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Generate Button */}
      <Button
        onClick={onGenerate}
        disabled={files.length === 0 || !timelineTitle.trim() || processing}
        className="w-full py-3 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg transition-all duration-200"
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Generating Timeline...
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Generate Timeline
          </div>
        )}
      </Button>

      {/* Tips */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Settings className="w-4 h-4" />
          Timeline Extraction Tips
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Upload multiple related documents for comprehensive timeline</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Use descriptive timeline titles for easy identification</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
            <span>Event types include: filings, hearings, judgments, amendments</span>
          </div>
          <div className="flex items-start gap-2 text-xs text-muted-foreground">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
            <span>AI automatically identifies dates and categorizes events</span>
          </div>
        </div>
      </div>

      {/* Document Viewer Modal */}
      {selectedFile && (
        <DocumentViewerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedFile(null);
          }}
          documentUrl={URL.createObjectURL(selectedFile)}
          filename={selectedFile.name}
          fileType={selectedFile.type}
          fileSize={selectedFile.size}
        />
      )}
    </div>
  );
} 