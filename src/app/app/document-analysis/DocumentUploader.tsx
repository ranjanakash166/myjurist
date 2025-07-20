import React, { useRef } from "react";
import { Paperclip, Upload, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

interface DocumentUploaderProps {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onProcess: () => void;
  processing: boolean;
  error?: string | null;
}

export default function DocumentUploader({ file, onFileChange, onProcess, processing, error }: DocumentUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Upload className="w-5 h-5" />
          Upload Document
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Selection Area */}
        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-muted/30 border border-border rounded-lg px-4 py-3 min-h-[56px]">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground">
                {file ? file.name : "No file selected"}
              </div>
              {file && (
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </div>
              )}
            </div>
            {file && (
              <Badge variant="secondary" className="flex-shrink-0">
                Ready
              </Badge>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex-1"
            >
              <Paperclip className="w-4 h-4 mr-2" />
              {file ? "Change File" : "Choose File"}
            </Button>
            <Button
              onClick={onProcess}
              disabled={!file || processing}
              className="flex-1"
            >
              {processing ? (
                <>
                  <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Process
                </>
              )}
            </Button>
          </div>
        </div>
        
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleChange}
          accept=".pdf,.doc,.docx,.txt"
        />
        
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
} 