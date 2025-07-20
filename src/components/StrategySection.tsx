import React from 'react';
import { Users, Globe, Award, Target, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface Strategy {
  icon: LucideIcon;
  title: string;
  description: string;
}

const StrategySection: React.FC = () => {
  const strategies: Strategy[] = [
    {
      icon: Users,
      title: "Direct Outreach",
      description: "Proactive engagement with leading law firms and corporate legal departments."
    },
    {
      icon: Globe,
      title: "Partnership Network",
      description: "Strategic alliances with regulatory bodies and global patent offices."
    },
    {
      icon: Award,
      title: "Thought Leadership",
      description: "Industry visibility via webinars, whitepapers, and AI law conferences."
    }
  ];

  return (
    <section id="strategy" className="section-legal bg-background">
      <div className="container-legal">
        <div className="text-center mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            Strategic Pathways to Market Leadership
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => {
            const IconComponent = strategy.icon;
            return (
              <Card key={index} className="document-card hover-scale text-center">
                <CardHeader>
                  <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-legal-heading text-foreground">
                    {strategy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-legal-body text-muted-foreground leading-relaxed">
                    {strategy.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Strategy roadmap */}
        <Card className="mt-16 document-card">
          <CardHeader>
            <CardTitle className="text-legal-heading text-foreground text-center">
              Comprehensive Go-to-Market Strategy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-legal-body text-muted-foreground leading-relaxed text-center max-w-4xl mx-auto mb-8">
              Our multi-faceted approach combines direct market penetration with strategic partnerships 
              and thought leadership to establish My Jurist as the definitive AI solution for legal due diligence.
            </p>
            
            {/* Strategy timeline */}
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
              <div className="flex items-center">
                <Target className="h-6 w-6 text-primary mr-2" />
                <span className="text-muted-foreground">Q1: Market Entry</span>
              </div>
              <Separator orientation="horizontal" className="hidden md:block w-8" />
              <Separator orientation="vertical" className="md:hidden h-8" />
              <div className="flex items-center">
                <Target className="h-6 w-6 text-accent mr-2" />
                <span className="text-muted-foreground">Q2: Partnership Growth</span>
              </div>
              <Separator orientation="horizontal" className="hidden md:block w-8" />
              <Separator orientation="vertical" className="md:hidden h-8" />
              <div className="flex items-center">
                <Target className="h-6 w-6 text-primary mr-2" />
                <span className="text-muted-foreground">Q3: Market Leadership</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default StrategySection; 