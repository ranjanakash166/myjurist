'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { FileText, Search, Clock, Download, Trash2, Eye } from 'lucide-react';
import { EnhancedContractApi, ContractDraftResponse } from '@/lib/enhancedContractApi';

interface ContractHistoryProps {
  api: EnhancedContractApi;
}

export function ContractHistory({ api }: ContractHistoryProps) {
  const [contracts, setContracts] = useState<ContractDraftResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const loadContracts = async (pageNum: number = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.getContractHistory(pageNum, 10);
      setContracts(response.drafts);
      setTotalCount(response.total_count);
      setPage(pageNum);
    } catch (err) {
      console.error('Error loading contracts:', err);
      
      // Check if it's a network error or API not available
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('404') ||
        err.message.includes('500')
      )) {
        setError('Failed to load contract history. The API is not available. Please ensure the backend server is running.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load contract history. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleDownload = async (contractId: string, format: 'pdf' | 'docx') => {
    setIsDownloading(`${contractId}-${format}`);
    try {
      const blob = await api.downloadContract(contractId, format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contract-${contractId}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Download error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to download contract. Please try again.';
      setError(errorMessage);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleDelete = async (contractId: string) => {
    if (!confirm('Are you sure you want to delete this contract?')) {
      return;
    }

    try {
      await api.deleteContract(contractId);
      setContracts(prev => prev.filter(c => c.contract_id !== contractId));
      setTotalCount(prev => prev - 1);
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete contract. Please try again.';
      setError(errorMessage);
    }
  };

  const filteredContracts = (contracts || []).filter(contract =>
    contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.template_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <span>Contract History</span>
            </CardTitle>
            <CardDescription>
              View and manage your previously generated contracts
            </CardDescription>
          </div>
          <Badge variant="outline">
            {totalCount} contracts
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-red-700 text-sm font-medium">{error}</p>
                {error.includes('API is not available') && (
                  <p className="text-red-600 text-xs mt-1">
                    Please ensure the backend server is running on http://localhost:8000
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadContracts(page)}
                disabled={isLoading}
                className="ml-3 text-red-600 border-red-300 hover:bg-red-50 text-xs"
              >
                {isLoading ? 'Retrying...' : 'Retry'}
              </Button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-600">Loading contracts...</span>
            </div>
          </div>
        )}

        {/* Contracts List */}
        {!isLoading && (
          <div className="space-y-4">
            {filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchQuery ? 'No contracts found' : 'No contracts yet'}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {searchQuery 
                    ? `No contracts match "${searchQuery}". Try a different search term.`
                    : 'Generate your first contract to see it here.'
                  }
                </p>
              </div>
            ) : (
              filteredContracts.map((contract) => (
                <Card key={contract.contract_id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {contract.title}
                          </h3>
                          <Badge className={getStatusColor(contract.status)}>
                            {contract.status}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                          {contract.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <FileText className="w-4 h-4" />
                            <span>{contract.template_type}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDate(contract.created_at)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>AI: {contract.ai_provider_used}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(contract.contract_id, 'pdf')}
                          disabled={isDownloading === `${contract.contract_id}-pdf`}
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>PDF</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownload(contract.contract_id, 'docx')}
                          disabled={isDownloading === `${contract.contract_id}-docx`}
                          className="flex items-center space-x-1"
                        >
                          <Download className="w-4 h-4" />
                          <span>DOCX</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(contract.contract_id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalCount > 10 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, totalCount)} of {totalCount} contracts
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadContracts(page - 1)}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => loadContracts(page + 1)}
                disabled={page * 10 >= totalCount}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
