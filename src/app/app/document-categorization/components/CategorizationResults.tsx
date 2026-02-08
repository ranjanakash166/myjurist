"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Tag, 
  BarChart3, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Calendar
} from "lucide-react";
import { toast } from '@/hooks/use-toast';
import { DocumentCategorizationResponse, CategorizationResult } from "../../../../lib/documentCategorizationApi";

interface CategorizationResultsProps {
  result: DocumentCategorizationResponse;
}

export default function CategorizationResults({ result }: CategorizationResultsProps) {
  const [expandedDocuments, setExpandedDocuments] = useState<Set<string>>(new Set());

  const toggleDocumentExpansion = (filename: string) => {
    const newExpanded = new Set(expandedDocuments);
    if (newExpanded.has(filename)) {
      newExpanded.delete(filename);
    } else {
      newExpanded.add(filename);
    }
    setExpandedDocuments(newExpanded);
  };



  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.9) return "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary";
    if (confidence >= 0.7) return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
  };

  const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 0.9) return "Very High";
    if (confidence >= 0.7) return "High";
    if (confidence >= 0.5) return "Medium";
    return "Low";
  };



  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-primary" />
            Categorization Complete
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{result.total_documents}</div>
              <div className="text-sm text-muted-foreground">Documents Processed</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {result.categorization_results.filter(r => r.processing_status === 'completed').length}
              </div>
              <div className="text-sm text-muted-foreground">Successfully Processed</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Object.keys(result.summary).length}
              </div>
              <div className="text-sm text-muted-foreground">Categories Found</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Category Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(result.summary)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{category}</span>
                    <Badge variant="secondary">{count} document(s)</Badge>
                  </div>
                  <Progress 
                    value={(count / result.total_documents) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Generated Categories */}
      {result.generated_categories && result.generated_categories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="w-5 h-5" />
              AI-Generated Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {result.generated_categories.map((category, index) => (
                <Badge key={index} variant="outline" className="text-sm">
                  {category}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {result.categorization_results.map((docResult, index) => (
              <div key={index} className="border rounded-lg p-4">
                {/* Document Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-semibold">{docResult.filename}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {docResult.assigned_categories.length} categories
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-primary" />
                          {docResult.processing_status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleDocumentExpansion(docResult.filename)}
                  >
                    {expandedDocuments.has(docResult.filename) ? 'Collapse' : 'Expand'}
                  </Button>
                </div>

                {/* Categories Preview */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {docResult.assigned_categories
                    .sort((a, b) => b.confidence - a.confidence)
                    .slice(0, 3)
                    .map((category, catIndex) => (
                      <Badge 
                        key={catIndex} 
                        className={`${getConfidenceColor(category.confidence)} text-xs`}
                      >
                        {category.category} ({Math.round(category.confidence * 100)}%)
                      </Badge>
                    ))}
                  {docResult.assigned_categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{docResult.assigned_categories.length - 3} more
                    </Badge>
                  )}
                </div>

                {/* Expanded Categories */}
                {expandedDocuments.has(docResult.filename) && (
                  <div className="space-y-3 pt-3 border-t">
                    <h5 className="font-medium text-sm">All Categories:</h5>
                    {docResult.assigned_categories
                      .sort((a, b) => b.confidence - a.confidence)
                      .map((category, catIndex) => (
                        <div key={catIndex} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge className={getConfidenceColor(category.confidence)}>
                                {category.category}
                              </Badge>
                              <Badge variant="outline">
                                {getConfidenceLabel(category.confidence)} Confidence
                              </Badge>
                            </div>
                            <div className="text-sm font-mono">
                              {Math.round(category.confidence * 100)}%
                            </div>
                          </div>
                          
                          <div className="text-sm text-muted-foreground">
                            <strong>Reasoning:</strong> {category.reasoning}
                          </div>
                          

                        </div>
                      ))}
                  </div>
                )}

                {/* Error Display */}
                {docResult.error_message && (
                  <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="font-medium">Processing Error:</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                      {docResult.error_message}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>


    </div>
  );
}
