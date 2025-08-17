"use client";
import React, { useState } from "react";
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
  Settings, 
  Save, 
  RotateCcw, 
  Info,
  FileText,
  Tag,
  BarChart3,
  Zap,
  Shield,
  Clock
} from "lucide-react";
import { toast } from '@/hooks/use-toast';

interface CategorizationSettingsProps {
  onSettingsChange?: (settings: any) => void;
}

export default function CategorizationSettings({ onSettingsChange }: CategorizationSettingsProps) {
  const [settings, setSettings] = useState({
    // Processing settings
    enableChunking: true,
    maxChunkSize: 1000,
    overlapSize: 200,
    
    // AI settings
    modelPreference: 'auto',
    enableConfidenceScoring: true,
    enableReasoning: true,
    
    // Output settings
    includeRawText: false,
    includeMetadata: true,
    exportFormat: 'json',
    
    // Performance settings
    maxConcurrentDocuments: 5,
    enableCaching: true,
    cacheExpiryHours: 24,
    
    // Quality settings
    enableValidation: true,
    enableReview: false,
    autoApproveThreshold: 0.9
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save settings to localStorage or API
    localStorage.setItem('categorizationSettings', JSON.stringify(settings));
    setHasChanges(false);
    
    if (onSettingsChange) {
      onSettingsChange(settings);
    }
    
    toast({
      title: "Settings Saved",
      description: "Your categorization settings have been saved successfully.",
    });
  };

  const handleReset = () => {
    const defaultSettings = {
      enableChunking: true,
      maxChunkSize: 1000,
      overlapSize: 200,
      modelPreference: 'auto',
      enableConfidenceScoring: true,
      enableReasoning: true,
      includeRawText: false,
      includeMetadata: true,
      exportFormat: 'json',
      maxConcurrentDocuments: 5,
      enableCaching: true,
      cacheExpiryHours: 24,
      enableValidation: true,
      enableReview: false,
      autoApproveThreshold: 0.9
    };
    
    setSettings(defaultSettings);
    setHasChanges(true);
    
    toast({
      title: "Settings Reset",
      description: "Settings have been reset to default values.",
    });
  };

  const loadSettings = () => {
    const saved = localStorage.getItem('categorizationSettings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        setHasChanges(false);
      } catch (error) {
        console.error('Failed to load saved settings:', error);
      }
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  return (
    <div className="space-y-6">
      {/* Processing Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Document Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Document Chunking</Label>
              <p className="text-sm text-muted-foreground">
                Split large documents into smaller chunks for better AI processing
              </p>
            </div>
            <Switch
              checked={settings.enableChunking}
              onCheckedChange={(checked) => updateSetting('enableChunking', checked)}
            />
          </div>

          {settings.enableChunking && (
            <>
              <Separator />
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-medium">Maximum Chunk Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[settings.maxChunkSize]}
                      onValueChange={(value) => updateSetting('maxChunkSize', value[0])}
                      max={2000}
                      min={500}
                      step={100}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{settings.maxChunkSize} tokens</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Maximum number of tokens per chunk
                  </p>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-medium">Overlap Size</Label>
                  <div className="flex items-center gap-2">
                    <Slider
                      value={[settings.overlapSize]}
                      onValueChange={(value) => updateSetting('overlapSize', value[0])}
                      max={500}
                      min={0}
                      step={50}
                      className="flex-1"
                    />
                    <Badge variant="secondary">{settings.overlapSize} tokens</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Overlap between consecutive chunks for context preservation
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* AI Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            AI Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Model Preference</Label>
            <div className="grid grid-cols-3 gap-2">
              {['auto', 'fast', 'accurate'].map((option) => (
                <Button
                  key={option}
                  variant={settings.modelPreference === option ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('modelPreference', option)}
                  className="capitalize"
                >
                  {option}
                </Button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              Choose between speed and accuracy for AI processing
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Confidence Scoring</Label>
              <p className="text-sm text-muted-foreground">
                Include confidence scores for each category assignment
              </p>
            </div>
            <Switch
              checked={settings.enableConfidenceScoring}
              onCheckedChange={(checked) => updateSetting('enableConfidenceScoring', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable AI Reasoning</Label>
              <p className="text-sm text-muted-foreground">
                Include detailed reasoning for category assignments
              </p>
            </div>
            <Switch
              checked={settings.enableReasoning}
              onCheckedChange={(checked) => updateSetting('enableReasoning', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Output Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Output Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Include Raw Text</Label>
              <p className="text-sm text-muted-foreground">
                Include original document text in results (increases file size)
              </p>
            </div>
            <Switch
              checked={settings.includeRawText}
              onCheckedChange={(checked) => updateSetting('includeRawText', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Include Metadata</Label>
              <p className="text-sm text-muted-foreground">
                Include document metadata and processing information
              </p>
            </div>
            <Switch
              checked={settings.includeMetadata}
              onCheckedChange={(checked) => updateSetting('includeMetadata', checked)}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Export Format</Label>
            <div className="grid grid-cols-3 gap-2">
              {['json', 'csv', 'xml'].map((format) => (
                <Button
                  key={format}
                  variant={settings.exportFormat === format ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSetting('exportFormat', format)}
                  className="uppercase"
                >
                  {format}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Performance & Caching
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Max Concurrent Documents</Label>
            <div className="flex items-center gap-2">
              <Slider
                value={[settings.maxConcurrentDocuments]}
                onValueChange={(value) => updateSetting('maxConcurrentDocuments', value[0])}
                max={10}
                min={1}
                step={1}
                className="flex-1"
              />
              <Badge variant="secondary">{settings.maxConcurrentDocuments}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Maximum number of documents processed simultaneously
            </p>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Result Caching</Label>
              <p className="text-sm text-muted-foreground">
                Cache results to avoid reprocessing identical documents
              </p>
            </div>
            <Switch
              checked={settings.enableCaching}
              onCheckedChange={(checked) => updateSetting('enableCaching', checked)}
            />
          </div>

          {settings.enableCaching && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base font-medium">Cache Expiry Time</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[settings.cacheExpiryHours]}
                    onValueChange={(value) => updateSetting('cacheExpiryHours', value[0])}
                    max={168}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <Badge variant="secondary">{settings.cacheExpiryHours} hours</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  How long to keep cached results (1 hour to 1 week)
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Quality Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Quality Assurance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Result Validation</Label>
              <p className="text-sm text-muted-foreground">
                Validate categorization results against document content
              </p>
            </div>
            <Switch
              checked={settings.enableValidation}
              onCheckedChange={(checked) => updateSetting('enableValidation', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Enable Manual Review</Label>
              <p className="text-sm text-muted-foreground">
                Require manual review for low-confidence categorizations
              </p>
            </div>
            <Switch
              checked={settings.enableReview}
              onCheckedChange={(checked) => updateSetting('enableReview', checked)}
            />
          </div>

          {settings.enableReview && (
            <>
              <Separator />
              <div className="space-y-3">
                <Label className="text-base font-medium">Auto-approve Threshold</Label>
                <div className="flex items-center gap-2">
                  <Slider
                    value={[settings.autoApproveThreshold]}
                    onValueChange={(value) => updateSetting('autoApproveThreshold', value[0])}
                    max={1}
                    min={0.5}
                    step={0.05}
                    className="flex-1"
                  />
                  <Badge variant="secondary">{Math.round(settings.autoApproveThreshold * 100)}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Minimum confidence for automatic approval
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> These settings affect the categorization process and may impact processing time, 
          accuracy, and resource usage. Changes are saved locally and will be applied to future categorization requests.
        </AlertDescription>
      </Alert>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
        <Button onClick={handleSave} disabled={!hasChanges}>
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
