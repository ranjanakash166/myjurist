'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ArrowLeft, FileText, Clock, CheckCircle } from 'lucide-react';
import { ContractCategory, ContractTemplate } from '@/lib/enhancedContractApi';

interface TemplateSelectorProps {
  category: ContractCategory;
  templates: ContractTemplate[];
  searchQuery: string;
  onSearch: (query: string) => void;
  onTemplateSelect: (template: ContractTemplate) => void;
  onBack: () => void;
}

export function TemplateSelector({
  category,
  templates,
  searchQuery,
  onSearch,
  onTemplateSelect,
  onBack
}: TemplateSelectorProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);

  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(localSearchQuery);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    if (value.trim() === '') {
      onSearch('');
    }
  };

  return (
    <div className="space-y-6">
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
              {category.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {category.description}
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-sm">
          {templates.length} templates
        </Badge>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={localSearchQuery}
            onChange={handleSearchChange}
            className="pl-10 pr-4"
          />
        </form>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(templates || []).map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-blue-500 group"
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <FileText className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                      {template.name}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {template.type || category.id}
                      </Badge>
                      {template.required_fields && (
                        <Badge variant="secondary" className="text-xs">
                          {template.required_fields.length} required fields
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 dark:text-gray-300 line-clamp-3">
                {template.description}
              </CardDescription>
              {template.created_at && (
                <div className="flex items-center space-x-1 mt-3 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>
                    Created {new Date(template.created_at).toLocaleDateString()}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {(!templates || templates.length === 0) && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {localSearchQuery ? 'No templates found' : 'No templates available'}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {localSearchQuery 
              ? `No templates match "${localSearchQuery}". Try a different search term.`
              : 'This category doesn\'t have any templates yet.'
            }
          </p>
          {localSearchQuery && (
            <Button
              variant="outline"
              onClick={() => {
                setLocalSearchQuery('');
                onSearch('');
              }}
              className="mt-4"
            >
              Clear search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
