import React from 'react';
import { Award, Database, TrendingUp, Shield, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Advantage {
  icon: LucideIcon;
  title: string;
  description: string;
}

const AdvantageSection: React.FC = () => {
  const advantages: Advantage[] = [
    {
      icon: Award,
      title: "First Locally-Hosted AI for Due Diligence",
      description: "Exclusively tailored solution to address data privacy and security requirements in legal workflows."
    },
    {
      icon: Database,
      title: "Comprehensive Global Patent Database",
      description: "Exclusive LLM trained specifically to handle extensive global patent insights."
    },
    {
      icon: TrendingUp,
      title: "Significant Cost Reduction",
      description: "My Jurist reduces due diligence costs by approximately 70% compared to traditional methods."
    },
    {
      icon: Shield,
      title: "Enhanced Data Privacy",
      description: "Robust data security measures ensure compliance with even the strictest regulatory frameworks."
    }
  ];

  return (
    <section id="advantage" className="section-legal bg-background">
      <div className="container-legal">
        <div className="text-center mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            Why My Jurist Stands Apart
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-12">
          {[0, 2].map((startIndex) => (
            <div key={startIndex} className="grid md:grid-cols-2 gap-8">
              {advantages.slice(startIndex, startIndex + 2).map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <Card key={startIndex + index} className="document-card hover-scale">
                    <CardHeader>
                      <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                        <IconComponent className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-legal-heading text-foreground">
                        {advantage.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-legal-body text-muted-foreground leading-relaxed">
                        {advantage.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Competitive edge highlight */}
        <Card className="mt-16 document-card">
          <CardHeader>
            <CardTitle className="text-legal-heading text-foreground text-center">
              Unmatched Competitive Edge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-legal-body text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto">
              My Jurist combines cutting-edge AI technology with unparalleled data privacy, 
              creating a solution that no competitor can match. Our locally-hosted approach 
              and comprehensive patent intelligence give us a decisive advantage in the market.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default AdvantageSection; 