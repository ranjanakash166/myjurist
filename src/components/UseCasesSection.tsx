"use client";
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Search, FileText, Shield, FileEdit, Briefcase, Scale, Building2, Users } from 'lucide-react';

const UseCasesSection: React.FC = () => {
  const [activeRole, setActiveRole] = useState('all');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const roles = [
    { id: 'all', label: 'All Professionals', icon: Users, disabled: false },
    { id: 'litigation', label: 'Litigation Lawyers', icon: Scale, disabled: true },
    { id: 'transactional', label: 'Transactional Teams', icon: Briefcase, disabled: true },
    { id: 'in-house', label: 'In-House Counsel', icon: Building2, disabled: true }
  ];

  const useCases = [
    {
      icon: Search,
      title: 'Legal Research',
      description: 'Accelerate case law research and precedent discovery. Find relevant cases, statutes, and legal precedents in seconds.',
      benefits: [
        'Find relevant cases in seconds',
        'Uncover critical legal insights',
        'Strengthen your arguments with precedents'
      ],
      roles: ['all', 'litigation', 'transactional', 'in-house'],
      image: 'legal-research',
      gradient: 'from-blue-500 to-indigo-600',
      cardGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Transform document review workflows with intelligent analysis. Upload contracts, agreements, and legal documents for instant AI-powered insights.',
      benefits: [
        'Extract key information instantly',
        'Identify risks automatically',
        'Get comprehensive summaries'
      ],
      roles: ['all', 'transactional', 'in-house'],
      image: 'document-analysis',
      gradient: 'from-purple-500 to-pink-600',
      cardGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Stay ahead of regulatory changes and ensure compliance effortlessly. Get automated compliance checking and real-time updates on legal requirements.',
      benefits: [
        'Automated compliance checking',
        'Real-time regulatory updates',
        'Reduce compliance risks'
      ],
      roles: ['all', 'in-house', 'transactional'],
      image: 'compliance',
      gradient: 'from-emerald-500 to-teal-600',
      cardGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20'
    },
    {
      icon: FileEdit,
      title: 'Smart Document Drafting',
      description: 'Create professional legal documents with AI assistance. Generate contracts, agreements, and legal briefs with precision and speed.',
      benefits: [
        'Generate documents in minutes',
        'Match your firm\'s standards',
        'Save hours of manual work'
      ],
      roles: ['all', 'litigation', 'transactional', 'in-house'],
      image: 'drafting',
      gradient: 'from-orange-500 to-amber-600',
      cardGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
    }
  ];

  // Only show use cases for 'all' role, filter others for now
  const filteredUseCases = activeRole === 'all' 
    ? useCases 
    : []; // Empty array for other roles until we have specific data

  const handleRoleChange = (newRole: string) => {
    // Prevent switching to disabled tabs
    const selectedRole = roles.find(r => r.id === newRole);
    if (selectedRole?.disabled) {
      return;
    }
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveRole(newRole);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-muted/30 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-4">
            How Legal Professionals Use My Jurist
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover how different legal professionals leverage AI to transform their workflows
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex justify-center mb-12">
          <Tabs value={activeRole} onValueChange={handleRoleChange} className="w-full max-w-4xl">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto p-1 bg-muted/50">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <TabsTrigger
                    key={role.id}
                    value={role.id}
                    disabled={role.disabled}
                    className="flex flex-col md:flex-row items-center gap-2 px-4 py-3 data-[state=active]:bg-background data-[state=active]:shadow-md transition-all duration-300 data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    <span className="text-xs md:text-sm font-medium">{role.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </div>

        {/* Use Cases Grid with Smooth Transitions */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 transition-opacity duration-300 ${
            isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {filteredUseCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card
                key={`${useCase.title}-${activeRole}-${index}`}
                className={`border-0 bg-gradient-to-br ${useCase.cardGradient} hover:shadow-2xl transition-all duration-500 group overflow-hidden transform transition-all`}
                style={{
                  animation: `fadeIn 0.6s ease-out ${index * 100}ms both, slideUp 0.6s ease-out ${index * 100}ms both`
                }}
              >
                <CardContent className="p-6 md:p-8 relative">
                  {/* Icon with Gradient Background */}
                  <div className="mb-6">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${useCase.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-muted-foreground leading-relaxed mb-6 text-base md:text-lg">
                    {useCase.description}
                  </p>

                  {/* Key Benefits */}
                  <div className="mb-6 space-y-2">
                    {useCase.benefits.map((benefit, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm md:text-base text-foreground/80 group-hover:text-foreground transition-colors duration-300"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${useCase.gradient} flex-shrink-0`} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    variant="ghost"
                    className="p-4 h-auto font-semibold text-foreground hover:text-foreground/80 group/btn transition-all duration-300"
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300 inline-block">
                      Learn More
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300 inline-block" />
                  </Button>

                  {/* Decorative Gradient Overlay on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${useCase.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredUseCases.length === 0 && (
          <div 
            className={`text-center py-12 transition-opacity duration-300 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ animation: 'fadeIn 0.5s ease-out' }}
          >
            <p className="text-muted-foreground text-lg">
              No use cases available for this role. Please select another role.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UseCasesSection;
