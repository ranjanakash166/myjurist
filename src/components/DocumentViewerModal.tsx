import React, { useState, useEffect } from "react";
import { X, Download, Eye, FileText, FileImage, FileVideo, FileAudio, FileArchive, FileCode, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  filename: string;
  fileType?: string;
  fileSize?: number;
}

interface FileTypeInfo {
  icon: React.ReactNode;
  label: string;
  canPreview: boolean;
  previewComponent?: React.ReactNode;
}

export default function DocumentViewerModal({ 
  isOpen, 
  onClose, 
  documentUrl, 
  filename, 
  fileType,
  fileSize 
}: DocumentViewerModalProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setError(null);
    }
  }, [isOpen, documentUrl]);

  const getFileTypeInfo = (): FileTypeInfo => {
    if (!fileType) {
      return {
        icon: <FileText className="w-6 h-6" />,
        label: "Unknown",
        canPreview: false
      };
    }

    const type = fileType.toLowerCase();
    
    if (type.includes('pdf')) {
      return {
        icon: <FileText className="w-6 h-6" />,
        label: "PDF Document",
        canPreview: true,
        previewComponent: (
          <iframe
            src={documentUrl}
            className="w-full h-full border-0"
            title={filename}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("Failed to load PDF");
              setIsLoading(false);
            }}
          />
        )
      };
    }
    
    if (type.includes('image')) {
      return {
        icon: <FileImage className="w-6 h-6" />,
        label: "Image",
        canPreview: true,
        previewComponent: (
          <img
            src={documentUrl}
            alt={filename}
            className="max-w-full max-h-full object-contain mx-auto"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setError("Failed to load image");
              setIsLoading(false);
            }}
          />
        )
      };
    }
    
    if (type.includes('text') || type.includes('txt') || type.includes('rtf')) {
      return {
        icon: <FileText className="w-6 h-6" />,
        label: "Text Document",
        canPreview: true,
        previewComponent: (
          <div className="w-full h-full overflow-auto p-4 bg-muted/30 rounded-lg">
            <pre className="text-sm whitespace-pre-wrap font-mono">
              {isLoading ? "Loading..." : "Text content would be displayed here"}
            </pre>
          </div>
        )
      };
    }
    
    if (type.includes('word') || type.includes('doc')) {
      return {
        icon: <FileText className="w-6 h-6" />,
        label: "Word Document",
        canPreview: false
      };
    }
    
    if (type.includes('video')) {
      return {
        icon: <FileVideo className="w-6 h-6" />,
        label: "Video",
        canPreview: true,
        previewComponent: (
          <video
            controls
            className="max-w-full max-h-full mx-auto"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setError("Failed to load video");
              setIsLoading(false);
            }}
          >
            <source src={documentUrl} type={fileType} />
            Your browser does not support the video tag.
          </video>
        )
      };
    }
    
    if (type.includes('audio')) {
      return {
        icon: <FileAudio className="w-6 h-6" />,
        label: "Audio",
        canPreview: true,
        previewComponent: (
          <audio
            controls
            className="max-w-full mx-auto"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setError("Failed to load audio");
              setIsLoading(false);
            }}
          >
            <source src={documentUrl} type={fileType} />
            Your browser does not support the audio tag.
          </audio>
        )
      };
    }
    
    if (type.includes('zip') || type.includes('rar') || type.includes('7z')) {
      return {
        icon: <FileArchive className="w-6 h-6" />,
        label: "Archive",
        canPreview: false
      };
    }
    
    if (type.includes('json') || type.includes('xml') || type.includes('csv')) {
      return {
        icon: <FileCode className="w-6 h-6" />,
        label: "Data File",
        canPreview: false
      };
    }
    
    return {
      icon: <FileText className="w-6 h-6" />,
      label: "Document",
      canPreview: false
    };
  };

  const fileTypeInfo = getFileTypeInfo();

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenInNewTab = () => {
    window.open(documentUrl, '_blank');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3">
              <div className="text-blue-500">
                {fileTypeInfo.icon}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white truncate max-w-md">
                  {filename}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {fileTypeInfo.label}
                  </Badge>
                  {fileSize && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {(fileSize / 1024).toFixed(1)} KB
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {fileTypeInfo.canPreview && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenInNewTab}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Open
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1 overflow-hidden p-6">
            {error ? (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-red-500 mb-4">
                      <FileText className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Error Loading Document</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleDownload} variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download Instead
                      </Button>
                      <Button onClick={handleOpenInNewTab} variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : fileTypeInfo.canPreview ? (
              <div className="h-full relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-muted-foreground">Loading document...</span>
                    </div>
                  </div>
                )}
                {fileTypeInfo.previewComponent}
              </div>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-blue-500 mb-4">
                      {fileTypeInfo.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Preview Not Available</h3>
                    <p className="text-muted-foreground mb-4">
                      This file type cannot be previewed. You can download it or open it in a new tab.
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Document
                      </Button>
                      <Button onClick={handleOpenInNewTab} variant="outline">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open in New Tab
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
