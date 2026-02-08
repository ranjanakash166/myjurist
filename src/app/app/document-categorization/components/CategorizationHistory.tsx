"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  History, 
  Search, 
  FileText, 
  Clock, 
  Calendar,
  Eye,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import documentCategorizationApi from "../../../../lib/documentCategorizationApi";

interface CategorizationHistoryItem {
  request_id: string;
  total_documents: number;
  created_at: string;
  status: string;
}

interface CategorizationHistoryResponse {
  categorizations: CategorizationHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export default function CategorizationHistory() {
  const { getAuthHeaders } = useAuth();
  const [history, setHistory] = useState<CategorizationHistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchHistory = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const authHeaders = await getAuthHeaders();
      const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const response = await documentCategorizationApi.getCategorizationHistory(
        token,
        page,
        itemsPerPage
      );
      
      setHistory(response.categorizations);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch history';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = () => {
    // Filter history based on search term
    // This would typically be handled by the API, but for now we'll filter client-side
    if (searchTerm.trim() === "") {
      fetchHistory(1);
    } else {
      // Client-side filtering for demo purposes
      // In production, this should be handled by the API
      const filtered = history.filter(item => 
        item.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setHistory(filtered);
    }
  };

  const handleRefresh = () => {
    fetchHistory(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchHistory(page);
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">Completed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">Processing</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-primary" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };



  const copyRequestId = (requestId: string) => {
    navigator.clipboard.writeText(requestId);
    toast({
      title: "Copied to Clipboard",
      description: "Request ID has been copied to your clipboard.",
    });
  };

  if (loading && history.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading categorization history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Categorization History</h2>
          <p className="text-muted-foreground">
            View and manage your previous document categorization requests
          </p>
        </div>
        <Button onClick={handleRefresh} variant="outline" disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="sr-only">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by request ID or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={loading}>
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 dark:border-red-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error:</span>
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <History className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No History Found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'No results match your search criteria.' : 'You haven\'t categorized any documents yet.'}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <Card key={item.request_id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  {/* Left side - Request info */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div>
                        <h4 className="font-semibold text-sm">Request ID</h4>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {item.request_id}
                        </code>
                      </div>
                    </div>
                    
                                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Documents:</span>
                          <div className="font-medium">{item.total_documents}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Status:</span>
                          <div>{getStatusBadge(item.status)}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Created:</span>
                          <div className="font-medium">{formatDate(item.created_at)}</div>
                        </div>
                      </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyRequestId(item.request_id)}
                    >
                      Copy ID
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // In a real app, this would navigate to detailed results
                        toast({
                          title: "Feature Coming Soon",
                          description: "Detailed view will be available in the next update.",
                        });
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages} • {history.length} items
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
