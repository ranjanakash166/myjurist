import React from 'react';
import { CheckCircle, Star, Crown, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PricingPlan {
  title: string;
  description: string;
  features: string[];
  popular: boolean;
}

const PricingSection: React.FC = () => {
  const pricingPlans: PricingPlan[] = [
    {
      title: "Subscription-based SaaS",
      description: "Ideal for law firms and corporate legal teams seeking ongoing support.",
      features: ["Monthly billing", "24/7 support", "Regular updates"],
      popular: false
    },
    {
      title: "Pay-per-use Options",
      description: "Practical, scalable pricing designed for startups and smaller businesses.",
      features: ["Usage-based billing", "No commitments", "Flexible scaling"],
      popular: true
    },
    {
      title: "Enterprise Solutions",
      description: "Customized integrations for larger organizations with unique requirements.",
      features: ["Custom integration", "Dedicated support", "SLA guarantees"],
      popular: false
    }
  ];

  const handleGetStarted = () => {
    window.location.href = '/contact';
  };

  return (
    <section id="pricing" className="section-legal bg-muted/30">
      <div className="container-legal">
        <div className="text-center mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            Flexible Plans Tailored to Your Needs
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`document-card hover-scale relative flex flex-col ${
                plan.popular ? 'border-accent' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-accent text-accent-foreground px-4 py-2 text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <CardTitle className="text-legal-heading text-foreground flex items-center">
                  {plan.popular && <Crown className="h-6 w-6 mr-2 text-accent" />}
                  {plan.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="flex-grow">
                <p className="text-legal-body text-muted-foreground mb-6 leading-relaxed">
                  {plan.description}
                </p>
                
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-primary mr-3" />
                      <span className="text-legal-body text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Get Started Button */}
                <Button
                  onClick={handleGetStarted}
                  className={`group w-full ${
                    plan.popular ? 'bg-accent text-accent-foreground hover:bg-accent/90' : ''
                  }`}
                >
                  <span>Get Started</span>
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Pricing highlight */}
        <Card className="mt-16 document-card">
          <CardHeader>
            <CardTitle className="text-legal-heading text-foreground text-center">
              Transparent, Value-Driven Pricing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-legal-body text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              Our flexible pricing model ensures that organizations of all sizes can access 
              the power of My Jurist's AI platform. From startups to enterprise corporations, 
              we have a solution that fits your needs and budget.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default PricingSection; 