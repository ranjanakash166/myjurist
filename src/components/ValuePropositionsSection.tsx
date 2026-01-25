import React from 'react';
import { Shield, Sparkles, Layers, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ValuePropositionsSection: React.FC = () => {
  const valueProps = [
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Robust, industry-standard protection with zero training on your data. Your sensitive legal information stays secure and private.'
    },
    {
      icon: Sparkles,
      title: 'Domain-Specific AI',
      description: 'High-performing custom models built specifically for complex legal work. AI that understands the nuances of Indian litigation and legal practice.'
    },
    {
      icon: Layers,
      title: 'Comprehensive Features',
      description: 'All-in-one platform for research, analysis, compliance, and drafting. Everything you need to practice law efficiently in one integrated solution.'
    },
    {
      icon: MessageCircle,
      title: '24/7 Customer Support',
      description: 'White-glove support to resolve issues and maximize your My Jurist experience. We\'re here to help you succeed.'
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Unlock Professional Class AI
          </h2>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            For Your Legal Practice
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card key={index} className="border-border hover:shadow-lg transition-shadow text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="w-8 h-8 text-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {prop.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {prop.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionsSection;
