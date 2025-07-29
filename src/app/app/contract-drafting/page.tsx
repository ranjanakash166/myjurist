"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../components/AuthProvider";
import { createContractApi, ContractTemplate, ContractDraftRequest, ContractDraftResponse } from "../../../lib/contractApi";
import { createPDFGenerator } from "../../../lib/pdfGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  FileCheck, 
  FileText, 
  Download, 
  Copy, 
  CheckCircle, 
  AlertTriangle, 
  Loader2,
  Eye,
  Edit3,
  Plus,
  ArrowLeft,
  Save
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import ContractTemplateSelector from "./components/ContractTemplateSelector";
import ContractForm from "./components/ContractForm";
import ContractPreview from "./components/ContractPreview";

export default function ContractDraftingPage() {
  const { getAuthHeaders } = useAuth();
  const [contractApi] = useState(() => createContractApi(getAuthHeaders));
  
  // State management
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [generatedContract, setGeneratedContract] = useState<ContractDraftResponse | null>(null);
  const [currentStep, setCurrentStep] = useState<'templates' | 'form' | 'preview'>('templates');
  
  // Loading states
  const [templatesLoading, setTemplatesLoading] = useState(false);
  const [generatingContract, setGeneratingContract] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch templates on component mount
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    setError(null);
    
    try {
      const templatesData = await contractApi.getTemplates();
      setTemplates(templatesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch templates';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setTemplatesLoading(false);
    }
  };

  const handleTemplateSelect = (template: ContractTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setGeneratedContract(null);
    setCurrentStep('form');
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!selectedTemplate) return;

    setGeneratingContract(true);
    setError(null);

    try {
      const request: ContractDraftRequest = {
        template_type: selectedTemplate.type,
        title: data.title || `${selectedTemplate.name} - ${new Date().toLocaleDateString()}`,
        description: data.description || `Generated ${selectedTemplate.name} contract`,
        input_data: data,
        jurisdiction: selectedTemplate.jurisdiction,
        governing_law: selectedTemplate.governing_law,
        enhance_with_ai: true,
      };

      const response = await contractApi.generateContractDraft(request);
      setGeneratedContract(response);
      setCurrentStep('preview');
      
      toast({
        title: "Success",
        description: "Contract generated successfully!",
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate contract';
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setGeneratingContract(false);
    }
  };

  const handleBackToTemplates = () => {
    setSelectedTemplate(null);
    setFormData({});
    setGeneratedContract(null);
    setCurrentStep('templates');
  };

  const handleBackToForm = () => {
    setCurrentStep('form');
  };

  const handleDownloadContract = () => {
    if (!generatedContract) return;

    const blob = new Blob([generatedContract.generated_content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedContract.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Downloaded",
      description: "Contract downloaded successfully!",
    });
  };

  const handleDownloadPDF = () => {
    if (!generatedContract) return;

    try {
      const pdfGenerator = createPDFGenerator({
        title: generatedContract.title,
        author: 'My Jurist',
        subject: `${generatedContract.template_type.replace('_', ' ')} Contract`,
        keywords: ['legal', 'contract', generatedContract.template_type, 'myjurist']
      });
      
      pdfGenerator.downloadPDF(generatedContract);

      toast({
        title: "PDF Downloaded",
        description: "Contract PDF downloaded successfully!",
      });
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast({
        title: "Error",
        description: "Failed to download PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyToClipboard = async () => {
    if (!generatedContract) return;

    try {
      await navigator.clipboard.writeText(generatedContract.generated_content);
      toast({
        title: "Copied",
        description: "Contract content copied to clipboard!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <FileCheck className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contract Drafting</h1>
            <p className="text-muted-foreground">Generate professional legal contracts with AI assistance</p>
          </div>
        </div>
        
        {currentStep !== 'templates' && (
          <Button
            variant="outline"
            onClick={handleBackToTemplates}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Templates
          </Button>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Template Selection or Form */}
        <div className="lg:col-span-2">
          {currentStep === 'templates' && (
            <ContractTemplateSelector
              templates={templates}
              loading={templatesLoading}
              onTemplateSelect={handleTemplateSelect}
            />
          )}

          {currentStep === 'form' && selectedTemplate && (
            <ContractForm
              template={selectedTemplate}
              onSubmit={handleFormSubmit}
              loading={generatingContract}
            />
          )}

          {currentStep === 'preview' && generatedContract && (
            <ContractPreview
              contract={generatedContract}
              onBack={handleBackToForm}
              onDownload={handleDownloadContract}
              onCopy={handleCopyToClipboard}
            />
          )}
        </div>

        {/* Right Panel - Progress/Info */}
        <div className="space-y-6">
          {/* Progress Indicator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'templates' ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary'
                }`}>
                  {currentStep === 'templates' ? '1' : <CheckCircle className="w-4 h-4" />}
                </div>
                <span className={currentStep === 'templates' ? 'font-medium' : 'text-muted-foreground'}>
                  Select Template
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'form' ? 'bg-primary text-primary-foreground' : 
                  currentStep === 'preview' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'form' ? '2' : 
                   currentStep === 'preview' ? <CheckCircle className="w-4 h-4" /> : '2'}
                </div>
                <span className={currentStep === 'form' ? 'font-medium' : 
                               currentStep === 'preview' ? 'text-primary' : 'text-muted-foreground'}>
                  Fill Details
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep === 'preview' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>
                  {currentStep === 'preview' ? '3' : '3'}
                </div>
                <span className={currentStep === 'preview' ? 'font-medium' : 'text-muted-foreground'}>
                  Review & Download
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Selected Template Info */}
          {selectedTemplate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Selected Template</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{selectedTemplate.name}</h4>
                  <p className="text-sm text-muted-foreground">{selectedTemplate.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{selectedTemplate.type}</Badge>
                  <Badge variant="outline">{selectedTemplate.jurisdiction}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Required fields: {selectedTemplate.required_fields.length}</p>
                  <p>Optional fields: {selectedTemplate.optional_fields.length}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Contract Info */}
          {generatedContract && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Contract</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium">{generatedContract.title}</h4>
                  <p className="text-sm text-muted-foreground">{generatedContract.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant="secondary">{generatedContract.template_type}</Badge>
                  <Badge variant="outline">{generatedContract.status}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>Generated: {new Date(generatedContract.created_at).toLocaleString()}</p>
                  <p>Processing time: {generatedContract.processing_time_ms}ms</p>
                  {generatedContract.ai_provider_used && (
                    <p>AI Provider: {generatedContract.ai_provider_used}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 