"use client";
import React, { useState, useRef, useCallback } from "react";
import { useAuth } from "../../../../components/AuthProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  X, 
  FileText, 
  File, 
  Settings, 
  Play,
  AlertTriangle,
  Info,
  CheckCircle
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import documentCategorizationApi, { 
  DocumentCategorizationResponse,
  CategorizationRequest 
} from "../../../../lib/documentCategorizationApi";

interface DocumentUploaderProps {
  onProcessingStart: () => void;
  onProcessingComplete: () => void;
  onCategorizationComplete: (result: DocumentCategorizationResponse) => void;
  onError: (error: string) => void;
  processing: boolean;
}

interface UploadedFile {
  file: File;
  id: string;
  size: string;
  type: string;
}

const SUPPORTED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export default function DocumentUploader({
  onProcessingStart,
  onProcessingComplete,
  onCategorizationComplete,
  onError,
  processing
}: DocumentUploaderProps) {
  const { getAuthHeaders } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>(['']);
  const [multiLabel, setMultiLabel] = useState(true);
  const [confidenceThreshold, setConfidenceThreshold] = useState([0.7]);
  const [dragActive, setDragActive] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_TYPES.includes(file.type)) {
      return `File type ${file.type} is not supported. Please upload PDF, DOCX, or TXT files.`;
    }
    
    if (file.size > MAX_FILE_SIZE) {
      return `File size ${formatFileSize(file.size)} exceeds the maximum limit of 50MB.`;
    }
    
    return null;
  };

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;
    
    const newFiles: UploadedFile[] = [];
    const errors: string[] = [];
    
    Array.from(files).forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        newFiles.push({
          file,
          id: Math.random().toString(36).substring(7),
          size: formatFileSize(file.size),
          type: file.type
        });
      }
    });
    
    if (errors.length > 0) {
      errors.forEach(error => {
        toast({
          title: "File Validation Error",
          description: error,
          variant: "destructive",
        });
      });
    }
    
    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  const removeFile = (id: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
  };

  const addCustomCategory = () => {
    setCustomCategories(prev => [...prev, '']);
  };

  const removeCustomCategory = (index: number) => {
    setCustomCategories(prev => prev.filter((_, i) => i !== index));
  };

  const updateCustomCategory = (index: number, value: string) => {
    setCustomCategories(prev => prev.map((cat, i) => i === index ? value : cat));
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No Files Selected",
        description: "Please select at least one document to categorize.",
        variant: "destructive",
      });
      return;
    }

    try {
      onProcessingStart();
      
      const authHeaders = await getAuthHeaders();
      const token = authHeaders.Authorization?.replace('Bearer ', '') || '';
      
      const request: CategorizationRequest = {
        files: uploadedFiles.map(uf => uf.file),
        multi_label: multiLabel,
        confidence_threshold: confidenceThreshold[0],
      };

      // Only add categories if they're not empty
      const validCategories = customCategories.filter(cat => cat.trim() !== '');
      if (validCategories.length > 0) {
        request.categories = validCategories;
      }

      const result = await documentCategorizationApi.categorizeDocuments(request, token);
      
      onCategorizationComplete(result);
      onProcessingComplete();
      
      toast({
        title: "Success",
        description: `Successfully categorized ${result.total_documents} document(s)`,
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError(errorMessage);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* File Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Drag & Drop Zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground mb-4">
              Support for PDF, DOCX, and TXT files up to 50MB each
            </p>
            <Button onClick={openFileDialog} variant="outline">
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.docx,.txt"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>

          {/* File List */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Selected Files ({uploadedFiles.length})</h4>
              <div className="space-y-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{file.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {file.size} • {file.type}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Categorization Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Custom Categories */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Custom Categories (Optional)</Label>
            <p className="text-sm text-muted-foreground">
              Provide predefined categories for more accurate classification. Leave empty for AI-generated categories.
            </p>
            <div className="space-y-2">
              {customCategories.map((category, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Enter category name..."
                    value={category}
                    onChange={(e) => updateCustomCategory(index, e.target.value)}
                  />
                  {customCategories.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeCustomCategory(index)}
                      className="px-3"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={addCustomCategory}
                className="w-full"
              >
                Add Category
              </Button>
            </div>
          </div>

          <Separator />

          {/* Multi-label Setting */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Multi-label Classification</Label>
              <p className="text-sm text-muted-foreground">
                Allow documents to be assigned to multiple categories
              </p>
            </div>
            <Switch
              checked={multiLabel}
              onCheckedChange={setMultiLabel}
            />
          </div>

          <Separator />

          {/* Confidence Threshold */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Confidence Threshold</Label>
              <Badge variant="secondary">{confidenceThreshold[0]}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Minimum confidence score required for category assignment
            </p>
            <Slider
              value={confidenceThreshold}
              onValueChange={setConfidenceThreshold}
              max={1}
              min={0}
              step={0.05}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0.0</span>
              <span>0.5</span>
              <span>1.0</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          disabled={uploadedFiles.length === 0 || processing}
          size="lg"
          className="px-8"
        >
          {processing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Processing...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Start Categorization
            </>
          )}
        </Button>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Processing Time:</strong> Large documents may take several minutes to process. 
          The AI will analyze document content and assign relevant categories based on the content analysis.
        </AlertDescription>
      </Alert>
    </div>
  );
}
