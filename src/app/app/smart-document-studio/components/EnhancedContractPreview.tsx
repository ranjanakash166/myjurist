'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Download, FileText, Clock, CheckCircle, Copy, Edit3, MessageSquare } from 'lucide-react';
import { ContractDraftResponse, EnhancedContractApi } from '@/lib/enhancedContractApi';
import { TiptapEditor } from './DynamicTiptapEditor';
import { DocumentChatInterface } from './DocumentChatInterface';
import { useDocumentEditorStore } from '@/lib/stores/documentEditorStore';

interface EnhancedContractPreviewProps {
  contract: ContractDraftResponse;
  api: EnhancedContractApi;
  onBack: () => void;
  onStartOver: () => void;
  onDownload: (format: 'pdf' | 'docx') => Promise<void>;
}

export function EnhancedContractPreview({ 
  contract, 
  api,
  onBack, 
  onStartOver, 
  onDownload 
}: EnhancedContractPreviewProps) {
  const [isDownloading, setIsDownloading] = useState<'pdf' | 'docx' | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'chat'>('editor');

  const { setContent, content, isDirty, updateContent } = useDocumentEditorStore();

  // Initialize editor with contract content
  useEffect(() => {
    if (contract.generated_content) {
      setContent(contract.generated_content);
    }
  }, [contract.generated_content, setContent]);

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
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleSave = async (newContent: string) => {
    try {
      console.log('💾 Starting save process:', {
        contractId: contract.contract_id,
        contentLength: newContent.length,
        contentPreview: newContent.substring(0, 100) + '...'
      });

      // Update the contract via API - only send generated_content
      // The API will only update the fields that are provided
      const updatedContract = await api.updateContract(
        contract.contract_id, 
        newContent
      );
      
      updateContent(newContent, 'Manual save');
      console.log('✅ Contract saved successfully:', updatedContract);
    } catch (error) {
      console.error('❌ Failed to save contract:', error);
      throw error; // Re-throw to let the editor handle the error state
    }
  };

  const handleDownloadContent = (newContent: string) => {
    // Convert HTML to plain text for download
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = newContent;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${contract.title}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleApplySuggestion = (suggestion: string, description: string) => {
    // This will be handled by the Zustand store
    console.log('Applying suggestion:', suggestion, description);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatProcessingTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 relative">
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
              Enhanced document editing with AI assistance
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
          {isDirty && (
            <Badge variant="destructive" className="text-sm">
              Modified
            </Badge>
          )}
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
                {formatProcessingTime(contract.processing_time_ms || 0)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Generated</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {formatDate(contract.created_at)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p className="text-sm text-gray-900 dark:text-white">
                {contract.status}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Editing Interface */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'editor' | 'chat')} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Edit3 className="w-4 h-4" />
            <span>Document Editor</span>
          </TabsTrigger>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="w-4 h-4" />
            <span>AI Assistant</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="editor" className="mt-6">
          <TiptapEditor
            initialContent={contract.generated_content || ''}
            onContentChange={(content) => {
              // Content changes are handled by Zustand store
            }}
            onSave={handleSave}
            onDownload={handleDownloadContent}
            className="h-[600px]"
            contractId={contract.contract_id}
          />
        </TabsContent>
        
        <TabsContent value="chat" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
            <div className="relative z-10">
              <TiptapEditor
                initialContent={contract.generated_content || ''}
                onContentChange={(content) => {
                  // Content changes are handled by Zustand store
                }}
                onSave={handleSave}
                onDownload={handleDownloadContent}
                className="h-full"
                contractId={contract.contract_id}
              />
            </div>
            <div className="relative z-10">
              <DocumentChatInterface
                onApplySuggestion={handleApplySuggestion}
                className="h-full"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Export Actions - Moved below main sections */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Download className="w-5 h-5 text-blue-600" />
            <span>Export Options</span>
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
              size="lg"
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
              size="lg"
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

            <Button
              onClick={handleCopy}
              variant="outline"
              className="flex items-center space-x-2"
              size="lg"
            >
              <Copy className="w-4 h-4" />
              <span>{copied ? 'Copied!' : 'Copy Text'}</span>
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
          <CheckCircle className="w-4 h-4" />
          <span>Create Another Contract</span>
        </Button>
      </div>
    </div>
  );
}
