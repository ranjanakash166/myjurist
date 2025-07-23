import React from "react";
import { MessageCircle, Clock, FileText, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SelectedDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  upload_timestamp: string;
  processing_status: string;
  total_pages: number;
  total_tokens: number;
  total_chunks: number;
  added_to_chat_at: string;
}

interface Session {
  id: string;
  chat_id: string;
  name: string;
  created_at: string;
  last_activity: string;
  message_count: number;
  is_active: boolean;
  selected_document_count: number;
  selected_documents: SelectedDocument[];
}

interface SessionListProps {
  sessions: Session[];
  onSelect: (session: Session) => void | Promise<void>;
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
  selectedChatName?: string;
}

export default function SessionList({ 
  sessions, 
  onSelect, 
  page, 
  pageSize, 
  totalCount, 
  onPageChange, 
  loading = false,
  selectedChatName
}: SessionListProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Sessions {selectedChatName && `- ${selectedChatName}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading sessions...</p>
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No sessions found</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {sessions.map(session => (
                <Card 
                  key={session.id}
                  className="cursor-pointer hover:bg-muted/50 transition-all"
                  onClick={() => onSelect(session)}
                >
                  <CardContent className="p-3 sm:p-4 w-full max-w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 w-full max-w-full min-w-0">
                      <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0 w-full max-w-full">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0 w-full max-w-full">
                          <p className="font-medium text-foreground text-sm sm:text-base break-all min-w-0 w-full max-w-full">
                            {session.name}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3" />
                            <span className="hidden sm:inline">
                              {new Date(session.last_activity).toLocaleDateString()}
                            </span>
                            <span className="sm:hidden">
                              {new Date(session.last_activity).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{session.selected_document_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{session.message_count}</span>
                          </div>
                        </div>
                        <Badge 
                          variant={session.is_active ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {session.is_active ? "Active" : "Inactive"}
                        </Badge>
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