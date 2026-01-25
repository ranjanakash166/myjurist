import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Search, FileText, Shield, FileEdit } from 'lucide-react';

const UseCasesSection: React.FC = () => {
  const useCases = [
    {
      icon: Search,
      title: 'Legal Research',
      description: 'Accelerate case law research and precedent discovery. Find relevant cases, statutes, and legal precedents in seconds. Leverage AI-powered search to uncover critical legal insights that strengthen your arguments and support your case strategy.',
      image: 'legal-research',
      gradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Transform document review workflows with intelligent analysis. Upload contracts, agreements, and legal documents for instant AI-powered insights. Extract key information, identify risks, and get comprehensive summaries to make informed decisions faster.',
      image: 'document-analysis',
      gradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Stay ahead of regulatory changes and ensure compliance effortlessly. Get automated compliance checking, regulatory guidance, and real-time updates on legal requirements. Navigate complex regulations with confidence and reduce compliance risks.',
      image: 'compliance',
      gradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20'
    },
    {
      icon: FileEdit,
      title: 'Smart Document Drafting',
      description: 'Create professional legal documents with AI assistance. Generate contracts, agreements, and legal briefs with precision and speed. Leverage AI to draft documents that match your firm\'s standards while saving hours of manual work.',
      image: 'drafting',
      gradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            How Legal Professionals Use My Jurist
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card key={index} className={`border-0 bg-gradient-to-br ${useCase.gradient} hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-background flex items-center justify-center flex-shrink-0 shadow-md">
                      <Icon className="w-6 h-6 text-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-foreground mb-3">
                        {useCase.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6">
                        {useCase.description}
                      </p>
                      <Button variant="ghost" className="p-0 h-auto font-semibold text-foreground hover:text-foreground/80">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;
