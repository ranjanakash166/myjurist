'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  MessageSquare,
  RefreshCw,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useDocumentEditorStore } from '@/lib/stores/documentEditorStore';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: number;
  status?: 'sending' | 'success' | 'error';
  suggestions?: string[];
}

interface DocumentChatInterfaceProps {
  onApplySuggestion?: (suggestion: string, description: string) => void;
  className?: string;
}

export function DocumentChatInterface({ 
  onApplySuggestion,
  className = ''
}: DocumentChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { content, applyAISuggestion, setLoading, setError } = useDocumentEditorStore();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      type: 'user',
      content: input.trim(),
      timestamp: Date.now(),
      status: 'sending'
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLoading(true);

    try {
      // Simulate AI processing (replace with actual API call)
      const aiResponse = await processAIMessage(input.trim(), content);
      
      const aiMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: 'ai',
        content: aiResponse.content,
        timestamp: Date.now(),
        status: 'success',
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg_${Date.now() + 1}`,
        type: 'ai',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: Date.now(),
        status: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
      setError(error instanceof Error ? error.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
      setLoading(false);
    }
  };

  // Simulate AI processing (replace with actual API integration)
  const processAIMessage = async (userInput: string, documentContent: string): Promise<{
    content: string;
    suggestions: string[];
  }> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock AI responses based on common prompts
    const responses = {
      'make it more formal': {
        content: 'I\'ll help you make the document more formal. Here are some suggestions:',
        suggestions: [
          'Replace casual language with formal terminology',
          'Add proper legal language and clauses',
          'Include standard legal disclaimers',
          'Use passive voice for more formal tone'
        ]
      },
      'add a confidentiality clause': {
        content: 'I\'ll add a comprehensive confidentiality clause to your document:',
        suggestions: [
          'Add standard confidentiality language',
          'Include non-disclosure provisions',
          'Specify confidential information scope',
          'Add breach consequences and remedies'
        ]
      },
      'shorten this': {
        content: 'I\'ll help you make the document more concise while maintaining legal accuracy:',
        suggestions: [
          'Remove redundant phrases and clauses',
          'Combine similar provisions',
          'Use bullet points for better readability',
          'Eliminate unnecessary legal jargon'
        ]
      },
      'add termination clause': {
        content: 'I\'ll add a comprehensive termination clause to your agreement:',
        suggestions: [
          'Add standard termination conditions',
          'Include notice requirements',
          'Specify consequences of termination',
          'Add dispute resolution procedures'
        ]
      }
    };

    // Find matching response or provide generic one
    const lowerInput = userInput.toLowerCase();
    const matchedResponse = Object.entries(responses).find(([key]) => 
      lowerInput.includes(key)
    );

    if (matchedResponse) {
      return matchedResponse[1];
    }

    // Generic response
    return {
      content: `I understand you want to modify the document. Based on your request "${userInput}", here are some suggestions:`,
      suggestions: [
        'Review and update the language for clarity',
        'Add specific terms and conditions',
        'Include relevant legal provisions',
        'Ensure compliance with applicable laws'
      ]
    };
  };

  // Handle applying suggestion
  const handleApplySuggestion = (suggestion: string) => {
    applyAISuggestion(suggestion, `Applied suggestion: ${suggestion.substring(0, 50)}...`);
    onApplySuggestion?.(suggestion, `Applied suggestion: ${suggestion.substring(0, 50)}...`);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Clear chat
  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <Card className={`h-full flex flex-col relative z-10 ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>AI Document Assistant</span>
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearChat}
            disabled={messages.length === 0}
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 min-h-0" style={{ minHeight: '400px' }}>
        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1 px-6 min-h-0">
          <div className="space-y-4 py-4">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">AI Document Assistant</p>
                <p className="text-sm">Ask me to help modify your document</p>
                <div className="mt-4 space-y-2 text-sm">
                  <p className="font-medium">Try asking:</p>
                  <div className="space-y-1">
                    <Badge variant="outline" className="mr-2">"Make it more formal"</Badge>
                    <Badge variant="outline" className="mr-2">"Add a confidentiality clause"</Badge>
                    <Badge variant="outline" className="mr-2">"Shorten this section"</Badge>
                    <Badge variant="outline" className="mr-2">"Add termination clause"</Badge>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'ai' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      {message.type === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.content}</p>
                        
                        {/* Suggestions */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium opacity-75">Suggestions:</p>
                            {message.suggestions.map((suggestion, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-white/10 rounded p-2"
                              >
                                <span className="text-xs flex-1">{suggestion}</span>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleApplySuggestion(suggestion)}
                                  className="ml-2 h-6 px-2 text-xs"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Status indicator */}
                    <div className="flex items-center justify-between mt-2 text-xs opacity-75">
                      <span>
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </span>
                      {message.status === 'sending' && (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {message.status === 'success' && (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      )}
                      {message.status === 'error' && (
                        <XCircle className="w-3 h-3 text-red-500" />
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator />

        {/* Input Area */}
        <div className="p-4 border-t bg-white dark:bg-gray-900 flex-shrink-0">
          <div className="flex space-x-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me to help modify your document... (Press Enter to send, Shift+Enter for new line)"
              className="flex-1 min-h-[60px] resize-none"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="self-end"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Make this more formal')}
              disabled={isLoading}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Make Formal
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Add confidentiality clause')}
              disabled={isLoading}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Add Clause
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setInput('Shorten this section')}
              disabled={isLoading}
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Shorten
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
