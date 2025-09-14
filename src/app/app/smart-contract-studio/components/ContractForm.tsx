'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Save, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { ContractTemplate, ContractField } from '@/lib/enhancedContractApi';

interface ContractFormProps {
  template: ContractTemplate;
  onSubmit: (data: Record<string, any>) => void;
  onBack: () => void;
}

export function ContractForm({ template, onSubmit, onBack }: ContractFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Initialize form data with default values
    const initialData: Record<string, any> = {
      title: template.name,
      description: template.description,
    };

    // Add default values for required fields
    template.required_fields?.forEach(field => {
      initialData[field.name] = '';
    });

    // Add default values for optional fields
    template.optional_fields?.forEach(field => {
      initialData[field.name] = '';
    });

    setFormData(initialData);
  }, [template]);

  const handleInputChange = (fieldName: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate required fields
    template.required_fields?.forEach(field => {
      const value = formData[field.name];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    // Validate date fields
    template.required_fields?.forEach(field => {
      if (field.type === 'date' && formData[field.name]) {
        const date = new Date(formData[field.name]);
        if (isNaN(date.getTime())) {
          newErrors[field.name] = 'Please enter a valid date';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: ContractField, isRequired: boolean) => {
    const hasError = !!errors[field.name];
    const fieldId = `field-${field.name}`;

    return (
      <div key={field.name} className="space-y-2">
        <Label htmlFor={fieldId} className="text-sm font-medium">
          {field.label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        {field.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {field.description}
          </p>
        )}

        {field.type === 'textarea' ? (
          <Textarea
            id={fieldId}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
            rows={4}
          />
        ) : field.type === 'date' ? (
          <Input
            id={fieldId}
            type="date"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            className={hasError ? 'border-red-500' : ''}
          />
        ) : field.type === 'number' ? (
          <Input
            id={fieldId}
            type="number"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
          />
        ) : (
          <Input
            id={fieldId}
            type="text"
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={hasError ? 'border-red-500' : ''}
          />
        )}

        {hasError && (
          <div className="flex items-center space-x-1 text-red-600 text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{errors[field.name]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
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
              {template.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Fill in the details to generate your contract
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-sm">
          {template.type || 'Contract'}
        </Badge>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Required Information</span>
            </CardTitle>
            <CardDescription>
              Please fill in all required fields to generate your contract
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {template.required_fields?.map(field => renderField(field, true))}
          </CardContent>
        </Card>

        {template.optional_fields && template.optional_fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="w-5 h-5 text-blue-600" />
                <span>Optional Information</span>
              </CardTitle>
              <CardDescription>
                Additional details to enhance your contract (optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {template.optional_fields.map(field => renderField(field, false))}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Contract</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
