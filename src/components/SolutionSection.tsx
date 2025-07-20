import React from 'react';
import { Shield, Globe, Zap, CheckCircle, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Solution {
  icon: LucideIcon;
  title: string;
  description: string;
}

const SolutionSection: React.FC = () => {
  const solutions: Solution[] = [
    {
      icon: Shield,
      title: "Locally-Hosted Security",
      description: "Your data stays securely within your jurisdiction, eliminating cloud-based risks."
    },
    {
      icon: Globe,
      title: "Exclusive Global Patent LLM",
      description: "Our uniquely trained AI is built upon the world's most comprehensive patent data repository, offering unmatched insights."
    },
    {
      icon: Zap,
      title: "Efficient Automation",
      description: "My Jurist automates up to 70% of due diligence tasks, dramatically reducing costs and timelines."
    },
    {
      icon: CheckCircle,
      title: "Guaranteed Compliance",
      description: "Fully aligned with global data privacy and regulatory requirements, ensuring peace of mind."
    }
  ];

  return (
    <section id="solution" className="section-legal bg-background">
      <div className="container-legal">
        <div className="text-center mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            Introducing My Jurist's Proprietary AI Platform
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <Card key={index} className="document-card hover-scale">
                <CardHeader>
                  <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center mb-4">
                    <IconComponent className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-legal-subheading text-foreground">
                    {solution.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-legal-body text-muted-foreground leading-relaxed">
                    {solution.description}
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

export default SolutionSection; 