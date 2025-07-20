import React from 'react';
import { TrendingUp, Lock, Database, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Problem {
  icon: LucideIcon;
  title: string;
  description: string;
}

const ProblemSection: React.FC = () => {
  const problems: Problem[] = [
    {
      icon: TrendingUp,
      title: "High Costs, Slow Results",
      description: "Traditional due diligence processes drain resources and time, hindering responsiveness and competitiveness."
    },
    {
      icon: Lock,
      title: "Data Privacy Concerns",
      description: "Clients are wary of cloud-hosted AI services, fearing sensitive information breaches and compliance violations."
    },
    {
      icon: Database,
      title: "Incomplete Patent Intelligence",
      description: "Current tools lack comprehensive global patent data, limiting strategic decision-making."
    }
  ];

  return (
    <section id="problem" className="section-legal bg-muted/30">
      <div className="container-legal">
        <div className="text-center mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            The Challenge with Traditional Legal Due Diligence
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const IconComponent = problem.icon;
            return (
              <Card key={index} className="document-card hover-scale">
                <CardHeader>
                  <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center mb-4">
                    <IconComponent className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-legal-heading text-foreground">
                    {problem.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-legal-body text-muted-foreground leading-relaxed">
                    {problem.description}
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

export default ProblemSection; 