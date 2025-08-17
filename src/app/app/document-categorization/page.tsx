"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Upload, 
  Settings, 
  CheckCircle, 
  AlertTriangle, 
  Tag,
  BarChart3,
  FileCheck,
  Sparkles
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import DocumentUploader from "./components/DocumentUploader";
import CategorizationResults from "./components/CategorizationResults";


import { DocumentCategorizationResponse } from "../../../lib/documentCategorizationApi";

export default function DocumentCategorizationPage() {
  const { getAuthHeaders } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');
  const [processing, setProcessing] = useState(false);
  const [categorizationResult, setCategorizationResult] = useState<DocumentCategorizationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCategorizationComplete = (result: DocumentCategorizationResponse) => {
    setCategorizationResult(result);
    setActiveTab('results');
    toast({
      title: "Categorization Complete",
      description: `Successfully categorized ${result.total_documents} document(s)`,
    });
  };

  const handleProcessingStart = () => {
    setProcessing(true);
    setError(null);
  };

  const handleProcessingComplete = () => {
    setProcessing(false);
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setProcessing(false);
    toast({
      title: "Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-primary/10 rounded-full">
            <Tag className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Document Categorization</h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Automatically categorize your legal documents using AI-powered analysis. 
          Upload multiple documents and get intelligent category assignments with confidence scores.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="text-center p-6">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">AI-Powered Analysis</h3>
          <p className="text-muted-foreground text-sm">
            Advanced AI algorithms analyze document content and assign relevant categories
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <FileCheck className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Multi-Document Support</h3>
          <p className="text-muted-foreground text-sm">
            Process multiple documents simultaneously with efficient chunking for large files
          </p>
        </Card>
        
        <Card className="text-center p-6">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Confidence Scoring</h3>
          <p className="text-muted-foreground text-sm">
            Get detailed confidence scores and reasoning for each category assignment
          </p>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Upload & Categorize
              </TabsTrigger>
              <TabsTrigger value="results" className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Results
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsContent value="upload" className="space-y-6">
              <DocumentUploader
                onProcessingStart={handleProcessingStart}
                onProcessingComplete={handleProcessingComplete}
                onCategorizationComplete={handleCategorizationComplete}
                onError={handleError}
                processing={processing}
              />
            </TabsContent>
            
            <TabsContent value="results" className="space-y-6">
              {categorizationResult ? (
                <CategorizationResults result={categorizationResult} />
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Results Yet</h3>
                  <p className="text-muted-foreground">
                    Upload and categorize documents to see results here
                  </p>
                </div>
              )}
            </TabsContent>
            

          </Tabs>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Processing Indicator */}
      {processing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Processing Documents</h3>
            <p className="text-muted-foreground">
              AI is analyzing your documents and assigning categories...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
