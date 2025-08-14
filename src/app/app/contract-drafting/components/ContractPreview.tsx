import React, { useState } from "react";
import { ContractDraftResponse } from "../../../../lib/contractApi";
import { createPDFGenerator } from "../../../../lib/pdfGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  Download, 
  Copy, 
  CheckCircle, 
  Edit3,
  ArrowLeft,
  Eye,
  Clock,
  Check,
  FileDown,
  Loader2,
  Trash2
} from "lucide-react";

interface ContractPreviewProps {
  contract: ContractDraftResponse;
  onBack: () => void;
  onDownload: () => void;
  onCopy: () => void;
  onDelete?: () => void;
  showDeleteButton?: boolean;
}

export default function ContractPreview({
  contract,
  onBack,
  onDownload,
  onCopy,
  onDelete,
  showDeleteButton = false
}: ContractPreviewProps) {
  const [copied, setCopied] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleCopy = async () => {
    await onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    setGeneratingPDF(true);
    try {
      const pdfGenerator = createPDFGenerator({
        title: contract.title,
        author: 'My Jurist',
        subject: `${contract.template_type.replace('_', ' ')} Contract`,
        keywords: ['legal', 'contract', contract.template_type, 'myjurist']
      });
      
      pdfGenerator.downloadPDF(contract);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteDialog(false);
    onDelete?.();
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
  };

  const formatContent = (content: string) => {
    // Split content into sections and format for better readability
    const sections = content.split(/\n\s*\n/);
    return sections.map((section, index) => (
      <div key={index} className="mb-4">
        {section.split('\n').map((line, lineIndex) => (
          <p key={lineIndex} className="mb-2 leading-relaxed">
            {line}
          </p>
        ))}
      </div>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Contract Preview</h2>
          <p className="text-muted-foreground">
            Review your generated {contract.template_type.replace('_', ' ')} contract
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Form
          </Button>
          
          {showDeleteButton && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Contract
            </Button>
          )}
        </div>
      </div>

      {/* Contract Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{contract.title}</CardTitle>
                <p className="text-sm text-muted-foreground">{contract.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Badge variant="secondary">{contract.template_type}</Badge>
              <Badge variant="outline">{contract.status}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Generated</p>
              <p className="font-medium">
                {new Date(contract.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Contract ID</p>
              <p className="font-medium font-mono text-xs">
                {contract.contract_id.slice(0, 8)}...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          onClick={handleDownloadPDF}
          disabled={generatingPDF}
          className="flex items-center gap-2"
        >
          {generatingPDF ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              Download PDF
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onDownload}
          className="flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Download Text
        </Button>
        
        <Button
          variant="outline"
          onClick={handleCopy}
          className="flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </div>

      {/* Contract Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Contract Content
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              Generated {new Date(contract.created_at).toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 rounded-lg p-6 border">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {formatContent(contract.generated_content)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input Data Summary */}
      {Object.keys(contract.input_data).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Input Data Summary
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              The data you provided to generate this contract
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(contract.input_data).map(([key, value]) => (
                <div key={key} className="space-y-1">
                  <p className="text-sm font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </p>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                    {typeof value === 'string' ? value : JSON.stringify(value)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What's Next?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">1</span>
              </div>
              <div>
                <p className="font-medium">Review the contract</p>
                <p className="text-sm text-muted-foreground">
                  Carefully review all terms and conditions before using this contract
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">2</span>
              </div>
              <div>
                <p className="font-medium">Download or copy</p>
                <p className="text-sm text-muted-foreground">
                  Save the contract to your device or copy it to your clipboard
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-medium text-primary">3</span>
              </div>
              <div>
                <p className="font-medium">Legal review (recommended)</p>
                <p className="text-sm text-muted-foreground">
                  Consider having a legal professional review the contract before signing
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contract</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{contract.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete Contract
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 