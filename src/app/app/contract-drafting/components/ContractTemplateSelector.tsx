import React from "react";
import { ContractTemplate } from "../../../../lib/contractApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  FileText, 
  FileCheck, 
  Calendar, 
  Users, 
  Building2,
  Loader2,
  ArrowRight
} from "lucide-react";

interface ContractTemplateSelectorProps {
  templates: ContractTemplate[];
  loading: boolean;
  onTemplateSelect: (template: ContractTemplate) => void;
}

const getTemplateIcon = (type: string) => {
  switch (type) {
    case 'nda':
      return <FileCheck className="w-6 h-6" />;
    case 'service_agreement':
      return <FileText className="w-6 h-6" />;
    case 'employment_contract':
      return <Users className="w-6 h-6" />;
    case 'partnership_agreement':
      return <Building2 className="w-6 h-6" />;
    default:
      return <FileText className="w-6 h-6" />;
  }
};

const getTemplateColor = (type: string) => {
  switch (type) {
    case 'nda':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'service_agreement':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'employment_contract':
      return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'partnership_agreement':
      return 'bg-orange-500/10 text-orange-600 border-orange-200';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
  }
};

export default function ContractTemplateSelector({
  templates,
  loading,
  onTemplateSelect
}: ContractTemplateSelectorProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Select a Contract Template</h2>
          <p className="text-muted-foreground">Choose from our professional contract templates</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select a Contract Template</h2>
        <p className="text-muted-foreground">Choose from our professional contract templates</p>
      </div>
      
      {templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No templates available</h3>
            <p className="text-muted-foreground text-center">
              Contract templates are not currently available. Please try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {templates.map((template) => (
            <Card 
              key={template.id} 
              className="hover:shadow-md transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
              onClick={() => onTemplateSelect(template)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border ${getTemplateColor(template.type)}`}>
                      {getTemplateIcon(template.type)}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground capitalize">
                        {template.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {template.description}
                </p>
                
                <div className="flex gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {template.jurisdiction}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {template.governing_law}
                  </Badge>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Required: {template.required_fields.length}</span>
                  <span>Optional: {template.optional_fields.length}</span>
                </div>
                
                <Button 
                  className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                >
                  Use Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 