'use client';

import React from 'react';
import { ArrowLeft, Scale, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ContactFormSection from '@/components/ContactFormSection';

const RequestDemoPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background">
      {/* Left Side - Information and Branding */}
      <div className="hidden lg:block lg:w-1/2 bg-primary p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto text-center md:text-left">
          <div className="mb-8">
            {/* Logo and Icon */}
            <div className="mb-8 flex items-center space-x-3 justify-center md:justify-start">
              <div className="relative">
                <div className="w-16 h-16 bg-primary-foreground/20 rounded-2xl flex items-center justify-center shadow-lg">
                  <Scale className="h-8 w-8 text-primary-foreground" />
                </div>
                <Sparkles className="absolute -top-2 -right-2 h-5 w-5 text-accent" />
              </div>
              <span className="text-2xl font-bold text-primary-foreground">My Jurist</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Book a demo to see My Jurist in action
            </h1>
            <p className="text-xl text-primary-foreground/90 mb-6">
              Schedule a demo to see how My Jurist can transform your legal due diligence process with AI-powered document analysis and contract drafting.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                  AI-powered document analysis
                </h3>
                <p className="text-primary-foreground/90">
                  Advanced AI technology for comprehensive legal document review and analysis.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                  Automated contract drafting
                </h3>
                <p className="text-primary-foreground/90">
                  Streamline your contract creation process with intelligent automation.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary-foreground/20 rounded-lg flex items-center justify-center">
                <Scale className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-primary-foreground mb-2">
                  Legal research automation
                </h3>
                <p className="text-primary-foreground/90">
                  Accelerate your legal research with AI-powered intelligence and insights.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-primary-foreground/20">
            <p className="text-primary-foreground/90 text-sm">
              Join thousands of legal professionals who trust My Jurist for their AI-powered legal research needs.
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Demo Request Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-background">
        <div className="w-full">
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                <img 
                  src="/images/myjurist-logo.png" 
                  alt="My Jurist" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-bold text-foreground">My Jurist</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Next Generation AI-Powered Legal Intelligence
            </p>
          </div>

          {/* Back Button for Mobile */}
          <div className="lg:hidden mb-6">
            <Link href="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>

          <ContactFormSection 
            title="Request a Demo"
            subtitle="Ready to see My Jurist in action? Fill out the form below and our team will schedule a personalized demo for you."
            buttonText="Request a Demo"
          />
        </div>
      </div>
    </div>
  );
};

export default RequestDemoPage;
