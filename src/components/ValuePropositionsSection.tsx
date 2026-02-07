"use client";
import React from 'react';
import { Shield, Sparkles, Layers, MessageCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ValuePropositionsSection: React.FC = () => {
  const valueProps = [
    {
      icon: Shield,
      title: 'Enterprise-Grade Security',
      description: 'Robust, industry-standard protection with zero training on your data. Your sensitive legal information stays secure and private.',
      gradient: 'from-primary to-blue-600',
      cardGradient: 'from-primary/10 to-blue-50 dark:from-primary/20 dark:to-blue-950/20'
    },
    {
      icon: Sparkles,
      title: 'Domain-Specific AI',
      description: 'High-performing custom models built specifically for complex legal work. AI that understands the nuances of Indian litigation and legal practice.',
      gradient: 'from-blue-500 to-indigo-600',
      cardGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20'
    },
    {
      icon: Layers,
      title: 'Comprehensive Features',
      description: 'All-in-one platform for research, analysis, compliance, and drafting. Everything you need to practice law efficiently in one integrated solution.',
      gradient: 'from-purple-500 to-pink-600',
      cardGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
    },
    {
      icon: MessageCircle,
      title: '24/7 Customer Support',
      description: 'White-glove support to resolve issues and maximize your My Jurist experience. We\'re here to help you succeed.',
      gradient: 'from-orange-500 to-amber-600',
      cardGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4">
            Unlock Professional Class AI
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-6">
            For Your Legal Practice
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the key differentiators that make My Jurist the trusted choice for legal professionals
          </p>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((prop, index) => {
            const Icon = prop.icon;
            return (
              <Card
                key={index}
                className={`border-0 bg-gradient-to-br ${prop.cardGradient} hover:shadow-2xl transition-all duration-500 group overflow-hidden transform hover:-translate-y-2`}
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 100}ms both, slideUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <CardContent className="p-6 md:p-8 relative">
                  {/* Icon with Gradient Background */}
                  <div className="mb-6 flex justify-center">
                    <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${prop.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4 text-center group-hover:text-foreground transition-colors duration-300">
                    {prop.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-center">
                    {prop.description}
                  </p>

                  {/* Decorative Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${prop.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
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
