import React, { useState } from "react";
import { FileText, Eye, Download, ExternalLink, FileImage, FileVideo, FileAudio, FileArchive, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DocumentViewerModal from "./DocumentViewerModal";

interface Document {
  id: string | null;
  filename: string;
  file_size?: number | null;
  content_type?: string | null;
  upload_timestamp?: string | null;
  total_chunks?: number | null;
  total_tokens?: number | null;
  processing_status?: string;
  source_type?: string;
  // Legacy support for old format
  name?: string;
  url?: string;
  type?: string;
  size?: number;
  uploadedAt?: string;
}

interface DocumentListProps {
  documents: Document[];
  title?: string;
  description?: string;
  showUploadDate?: boolean;
  className?: string;
}

export default function DocumentList({ 
  documents, 
  title = "Documents", 
  description,
  showUploadDate = false,
  className = ""
}: DocumentListProps) {
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getFileIcon = (type?: string) => {
    if (!type) return <FileText className="w-4 h-4" />;
    
    const fileType = type.toLowerCase();
    
    if (fileType.includes('pdf')) return <FileText className="w-4 h-4" />;
    if (fileType.includes('image')) return <FileImage className="w-4 h-4" />;
    if (fileType.includes('video')) return <FileVideo className="w-4 h-4" />;
    if (fileType.includes('audio')) return <FileAudio className="w-4 h-4" />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return <FileArchive className="w-4 h-4" />;
    if (fileType.includes('json') || fileType.includes('xml') || fileType.includes('csv')) return <FileCode className="w-4 h-4" />;
    if (fileType.includes('word') || fileType.includes('doc')) return <FileText className="w-4 h-4" />;
    
    return <FileText className="w-4 h-4" />;
  };

  const getFileTypeLabel = (type?: string) => {
    if (!type) return "Unknown";
    
    const fileType = type.toLowerCase();
    
    if (fileType.includes('pdf')) return "PDF";
    if (fileType.includes('image')) return "Image";
    if (fileType.includes('video')) return "Video";
    if (fileType.includes('audio')) return "Audio";
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('7z')) return "Archive";
    if (fileType.includes('json') || fileType.includes('xml') || fileType.includes('csv')) return "Data";
    if (fileType.includes('word') || fileType.includes('doc')) return "Word";
    if (fileType.includes('text') || fileType.includes('txt') || fileType.includes('rtf')) return "Text";
    
    return "Document";
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsModalOpen(true);
  };

  const handleDownloadDocument = (doc: Document) => {
    // Use legacy URL if available, otherwise show message
    if (doc.url) {
      const link = document.createElement('a');
      link.href = doc.url;
      link.download = doc.filename || doc.name || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Show message that download requires API call
      console.warn('Download requires API call - URL not available');
    }
  };

  const handleOpenInNewTab = (doc: Document) => {
    if (doc.url) {
      window.open(doc.url, '_blank');
    } else {
      console.warn('View requires API call - URL not available');
    }
  };

  const formatFileSize = (size?: number) => {
    if (!size) return "Unknown size";
    
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  if (documents.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Documents</h3>
            <p className="text-sm text-muted-foreground">
              No documents have been uploaded yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-6">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {title}
            </h3>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>

          {/* Document List */}
          <div className="space-y-3">
            {documents.map((document, index) => (
              <div
                key={document.id || `doc-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="text-blue-500 flex-shrink-0">
                    {getFileIcon(document.content_type || document.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" title={document.filename || document.name}>
                      {document.filename || document.name}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        {getFileTypeLabel(document.content_type || document.type)}
                      </Badge>
                      <span>{formatFileSize(document.file_size || document.size)}</span>
                      {showUploadDate && (document.upload_timestamp || document.uploadedAt) && (
                        <span>{formatDate(document.upload_timestamp || document.uploadedAt)}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDocument(document)}
                    className="h-8 w-8 p-0"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenInNewTab(document)}
                    className="h-8 w-8 p-0"
                    title="Open in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadDocument(document)}
                    className="h-8 w-8 p-0"
                    title="Download Document"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewerModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedDocument(null);
          }}
          documentUrl={selectedDocument.url}
          filename={selectedDocument.filename || selectedDocument.name}
          fileType={selectedDocument.content_type || selectedDocument.type}
          fileSize={selectedDocument.file_size || selectedDocument.size}
        />
      )}
    </>
  );
}
