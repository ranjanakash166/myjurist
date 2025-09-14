'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, FileText, Sparkles, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuthenticatedApi } from '@/hooks/useAuthenticatedApi';
import { useAuth } from '@/components/AuthProvider';
import { createEnhancedContractApi } from '@/lib/enhancedContractApi';
import { ContractCategory, ContractTemplate, ContractDraftResponse } from '@/lib/enhancedContractApi';
import { CategorySelector } from './components/CategorySelector';
import { TemplateSelector } from './components/TemplateSelector';
import { ContractForm } from './components/ContractForm';
import { ContractPreview } from './components/ContractPreview';
import { ContractHistory } from './components/ContractHistory';

export default function SmartContractStudio() {
  const { authenticatedFetch } = useAuthenticatedApi();
  const { getAuthHeaders } = useAuth();
  const [api] = useState(() => createEnhancedContractApi(getAuthHeaders, authenticatedFetch));
  
  // State management
  const [categories, setCategories] = useState<ContractCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ContractCategory | null>(null);
  const [templates, setTemplates] = useState<ContractTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContractTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentStep, setCurrentStep] = useState<'categories' | 'templates' | 'form' | 'preview'>('categories');
  const [currentTab, setCurrentTab] = useState<'studio' | 'history'>('studio');
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [generatedContract, setGeneratedContract] = useState<ContractDraftResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error loading categories:', err);
      
      // Check if it's a network error or API not available
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('404') ||
        err.message.includes('500')
      )) {
        setError('The Smart Contract Studio API is not available. Please ensure the backend server is running on http://localhost:8000');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load contract categories. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategorySelect = async (category: ContractCategory) => {
    try {
      setIsLoading(true);
      setError(null);
      setSelectedCategory(category);
      const data = await api.getTemplatesByCategory(category.id);
      setTemplates(data);
      setCurrentStep('templates');
    } catch (err) {
      console.error('Error loading templates:', err);
      
      // Check if it's a network error or API not available
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('404') ||
        err.message.includes('500')
      )) {
        setError('Failed to load templates. The API is not available. Please ensure the backend server is running.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load templates for this category. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateSelect = async (template: ContractTemplate) => {
    try {
      setIsLoading(true);
      setError(null);
      const templateDetails = await api.getTemplateDetails(template.id);
      setSelectedTemplate(templateDetails);
      setCurrentStep('form');
    } catch (err) {
      console.error('Error loading template details:', err);
      
      // Check if it's a network error or API not available
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('404') ||
        err.message.includes('500')
      )) {
        setError('Failed to load template details. The API is not available. Please ensure the backend server is running.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load template details. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const data = await api.searchTemplates(query);
      setTemplates(data);
    } catch (err) {
      console.error('Error searching templates:', err);
      
      // Check if it's a network error or API not available
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('404') ||
        err.message.includes('500')
      )) {
        setError('Failed to search templates. The API is not available. Please ensure the backend server is running.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to search templates. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (data: Record<string, any>) => {
    if (!selectedTemplate) return;

    try {
      setIsLoading(true);
      setError(null);
      setFormData(data);
      
      const request = {
        template_id: selectedTemplate.id,
        title: data.title || selectedTemplate.name,
        description: data.description || selectedTemplate.description,
        input_data: data,
        enhance_with_ai: true
      };

      const response = await api.generateContract(request);
      setGeneratedContract(response);
      setCurrentStep('preview');
    } catch (err) {
      console.error('Error generating contract:', err);
      
      // Check if it's a network error or API not available
      if (err instanceof Error && (
        err.message.includes('Failed to fetch') || 
        err.message.includes('NetworkError') ||
        err.message.includes('404') ||
        err.message.includes('500')
      )) {
        setError('Failed to generate contract. The API is not available. Please ensure the backend server is running.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate contract. Please try again.';
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'templates':
        setCurrentStep('categories');
        setSelectedCategory(null);
        setTemplates([]);
        setSearchQuery('');
        break;
      case 'form':
        setCurrentStep('templates');
        setSelectedTemplate(null);
        setFormData({});
        break;
      case 'preview':
        setCurrentStep('form');
        setGeneratedContract(null);
        break;
    }
  };

  const handleStartOver = () => {
    setCurrentStep('categories');
    setSelectedCategory(null);
    setSelectedTemplate(null);
    setTemplates([]);
    setFormData({});
    setGeneratedContract(null);
    setSearchQuery('');
    setError(null);
  };

  const renderStepIndicator = () => {
    const steps = [
      { key: 'categories', label: 'Choose Category', icon: FileText },
      { key: 'templates', label: 'Select Template', icon: Search },
      { key: 'form', label: 'Fill Details', icon: CheckCircle },
      { key: 'preview', label: 'Review & Generate', icon: Sparkles }
    ];

    return (
      <div className="flex items-center justify-center space-x-4 mb-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.key;
          const isCompleted = steps.findIndex(s => s.key === currentStep) > index;
          
          return (
            <div key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                isActive 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : isCompleted 
                    ? 'border-green-500 bg-green-500 text-white'
                    : 'border-gray-300 bg-white text-gray-500'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`ml-2 text-sm font-medium ${
                isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className="w-8 h-0.5 bg-gray-300 mx-4" />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Smart Contract Studio
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Create professional legal documents with AI-powered assistance. 
            Choose from our comprehensive library of contract templates and generate 
            customized documents in minutes.
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-red-700 font-medium">{error}</p>
                {error.includes('API is not available') && (
                  <div className="mt-2 text-sm text-red-600">
                    <p className="font-medium">To fix this issue:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li>Ensure your backend server is running on http://localhost:8000</li>
                      <li>Check that the enhanced-contracts API endpoints are implemented</li>
                      <li>Verify your authentication token is valid</li>
                    </ul>
                    <div className="mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={loadCategories}
                        disabled={isLoading}
                        className="text-red-600 border-red-300 hover:bg-red-50"
                      >
                        {isLoading ? 'Retrying...' : 'Retry Connection'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 animate-spin text-blue-500" />
              <span className="text-gray-600">Loading...</span>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as 'studio' | 'history')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="studio">Smart Document Studio</TabsTrigger>
            <TabsTrigger value="history">Contract History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="studio" className="mt-6">
            {!isLoading && (
              <div className="max-w-6xl mx-auto">
                {currentStep === 'categories' && (
                  <CategorySelector
                    categories={categories}
                    onCategorySelect={handleCategorySelect}
                  />
                )}

                {currentStep === 'templates' && selectedCategory && (
                  <TemplateSelector
                    category={selectedCategory}
                    templates={templates}
                    searchQuery={searchQuery}
                    onSearch={handleSearch}
                    onTemplateSelect={handleTemplateSelect}
                    onBack={handleBack}
                  />
                )}

                {currentStep === 'form' && selectedTemplate && (
                  <ContractForm
                    template={selectedTemplate}
                    onSubmit={handleFormSubmit}
                    onBack={handleBack}
                  />
                )}

                {currentStep === 'preview' && generatedContract && (
                  <ContractPreview
                    contract={generatedContract}
                    onBack={handleBack}
                    onStartOver={handleStartOver}
                    onDownload={async (format) => {
                      try {
                        const blob = await api.downloadContract(generatedContract.contract_id, format);
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${generatedContract.title}.${format}`;
                        document.body.appendChild(a);
                        a.click();
                        window.URL.revokeObjectURL(url);
                        document.body.removeChild(a);
                      } catch (err) {
                        console.error('Download error:', err);
                        const errorMessage = err instanceof Error ? err.message : 'Failed to download contract. Please try again.';
                        setError(errorMessage);
                      }
                    }}
                  />
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="history" className="mt-6">
            <ContractHistory api={api} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
