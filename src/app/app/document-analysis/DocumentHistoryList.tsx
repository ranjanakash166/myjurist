import React from "react";
import { Paperclip, Clock, Download, Eye, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HistoryItem {
  document_id: string;
  filename: string;
  upload_timestamp: string;
}

interface DocumentHistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void | Promise<void>;
  onDownload: (documentId: string, filename: string) => void | Promise<void>;
  onView: (documentId: string, filename: string) => void | Promise<void>;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
}

export default function DocumentHistoryList({ history, onSelect, onDownload, onView, page, pageSize, totalCount, onPageChange }: DocumentHistoryListProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Document Analysis History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No documents found</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {history.map(item => (
                <Card 
                  key={item.document_id}
                  className="cursor-pointer hover:bg-muted/50 transition-all"
                  onClick={() => onSelect(item)}
                >
                  <CardContent className="p-3 sm:p-4 w-full max-w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 w-full max-w-full min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0 w-full max-w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <Paperclip className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 w-full max-w-full">
                          <p className="font-medium text-foreground text-sm sm:text-base break-all min-w-0 w-full max-w-full">
                            {item.filename}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {new Date(item.upload_timestamp).toLocaleDateString()}
                            </span>
                            <span className="sm:hidden">
                              {new Date(item.upload_timestamp).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onView(item.document_id, item.filename);
                          }}
                          className="h-8 w-8 p-0"
                          title="View Document"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDownload(item.document_id, item.filename);
                          }}
                          className="h-8 w-8 p-0"
                          title="Download Document"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 0}
                >
                  Prev
                </Button>
                <Badge variant="secondary" className="text-xs">
                  Page {page + 1} of {totalPages}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page + 1 >= totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
} 