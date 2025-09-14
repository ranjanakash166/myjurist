'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Download, FileText, Clock, Sparkles, CheckCircle, Copy } from 'lucide-react';
import { ContractDraftResponse } from '@/lib/enhancedContractApi';

interface ContractPreviewProps {
  contract: ContractDraftResponse;
  onBack: () => void;
  onStartOver: () => void;
  onDownload: (format: 'pdf' | 'docx') => Promise<void>;
}

export function ContractPreview({ contract, onBack, onStartOver, onDownload }: ContractPreviewProps) {
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'docx' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (format: 'pdf' | 'docx') => {
    setIsDownloading(format);
    try {
      await onDownload(format);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contract.generated_content || 'No content available');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {contract.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Your contract has been generated successfully
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="text-sm">
            {contract.template_type}
          </Badge>
          <Badge variant="secondary" className="text-sm">
            {contract.status}
          </Badge>
        </div>
      </div>

      {/* Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Contract Details</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Contract ID</p>
              <p className="text-sm text-gray-900 dark:text-white font-mono">
                {contract.contract_id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Processing Time</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatProcessingTime(contract.processing_time_ms)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Generated</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(contract.created_at)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contract Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Generated Contract</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center space-x-2"
              >
                <Copy className="w-4 h-4" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </Button>
            </div>
          </div>
          <CardDescription>
            Review your generated contract below. You can copy the text or download it as a file.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              value={contract.generated_content || 'No content available'}
              readOnly
              className="min-h-[500px] font-mono text-sm"
              placeholder="Contract content will appear here..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-600" />
            <span>Download Options</span>
          </CardTitle>
          <CardDescription>
            Download your contract in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => handleDownload('pdf')}
              disabled={isDownloading === 'pdf'}
              className="flex items-center space-x-2"
            >
              {isDownloading === 'pdf' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Downloading PDF...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Download PDF</span>
                </>
              )}
            </Button>
            
            <Button
              onClick={() => handleDownload('docx')}
              disabled={isDownloading === 'docx'}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isDownloading === 'docx' ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  <span>Downloading DOCX...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Download DOCX</span>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Details</span>
        </Button>
        
        <Button
          onClick={onStartOver}
          className="flex items-center space-x-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>Create Another Contract</span>
        </Button>
      </div>
    </div>
  );
}
