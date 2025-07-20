import React from 'react';
import { TrendingUp, Shield, DollarSign, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarketStat {
  icon: LucideIcon;
  value: string;
  description: string;
}

const MarketSection: React.FC = () => {
  const marketStats: MarketStat[] = [
    {
      icon: DollarSign,
      value: "$1T",
      description: "Global legal services industry"
    },
    {
      icon: TrendingUp,
      value: "Surging",
      description: "Demand in patent and IP protection"
    },
    {
      icon: Shield,
      value: "Increased",
      description: "Regulatory pressure for local, secure AI"
    }
  ];

  return (
    <section id="market" className="section-legal bg-muted/30">
      <div className="container-legal text-center">
        <div className="mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            A Rapidly Expanding Legal Tech Market
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {marketStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="document-card hover-scale">
                <CardHeader>
                  <div className="h-16 w-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-4xl font-bold text-foreground mb-4">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-legal-body text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {/* Market opportunity highlight */}
        <Card className="mt-16 document-card">
          <CardHeader>
            <CardTitle className="text-legal-heading text-foreground">
              Seizing the Opportunity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-legal-body text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              With the legal tech market expanding rapidly and increasing demand for secure, 
              locally-hosted AI solutions, My Jurist is positioned to capture a significant 
              share of this trillion-dollar industry.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketSection; 