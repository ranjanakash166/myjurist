import React, { useState } from "react";
import { ContractTemplate, ContractField } from "../../../../lib/contractApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  Loader2,
  ArrowLeft,
  Send
} from "lucide-react";

interface ContractFormProps {
  template: ContractTemplate;
  onSubmit: (data: Record<string, any>) => void;
  loading: boolean;
}

export default function ContractForm({
  template,
  onSubmit,
  loading
}: ContractFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

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
    template.required_fields.forEach(field => {
      const value = formData[field.name];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: ContractField) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const isRequired = field.required;

    const commonProps = {
      id: field.name,
      value: value,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => 
        handleInputChange(field.name, e.target.value),
      placeholder: field.placeholder || `Enter ${field.label.toLowerCase()}`,
      className: error ? 'border-red-500' : '',
    };

    switch (field.type) {
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              {...commonProps}
              rows={4}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => handleInputChange(field.name, val)}
            >
              <SelectTrigger className={error ? 'border-red-500' : ''}>
                <SelectValue placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input
              {...commonProps}
              type="date"
              onChange={(e) => handleInputChange(field.name, e.target.value)}
            />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );

      default: // text
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="flex items-center gap-2">
              {field.label}
              {isRequired && <span className="text-red-500">*</span>}
            </Label>
            <Input {...commonProps} />
            {field.description && (
              <p className="text-sm text-muted-foreground">{field.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {error}
              </p>
            )}
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold mb-2">Fill Contract Details</h2>
        <p className="text-muted-foreground">
          Complete the form below to generate your {template.name}
        </p>
      </div>

      {/* Template Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{template.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Badge variant="secondary">{template.type}</Badge>
            <Badge variant="outline">{template.jurisdiction}</Badge>
            <Badge variant="outline">{template.governing_law}</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required Fields */}
        {template.required_fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Required Information
                <Badge variant="secondary" className="ml-2">
                  {template.required_fields.length} fields
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {template.required_fields.map(renderField)}
            </CardContent>
          </Card>
        )}

        {/* Optional Fields */}
        {template.optional_fields.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Optional Information
                <Badge variant="outline" className="ml-2">
                  {template.optional_fields.length} fields
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                These fields are optional but can enhance your contract
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              {template.optional_fields.map(renderField)}
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Contract...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Generate Contract
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 