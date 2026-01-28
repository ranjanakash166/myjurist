'use client';

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ContactFormSection from '@/components/ContactFormSection';

const ContactPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header with back button */}
      <div className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container-legal">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-3 group cursor-pointer">
              <ArrowLeft className="h-6 w-6 text-primary group-hover:text-accent transition-colors duration-300" />
              <span className="text-lg font-semibold text-muted-foreground group-hover:text-primary transition-colors duration-300">
                Back to Home
              </span>
            </Link>
            <div className="text-2xl font-bold text-foreground">
              Contact Us
            </div>
          </div>
        </div>
      </div>

      {/* Main content with padding for fixed header */}
      <div className="pt-20">
        {/* Two Column Layout: About Us (Left) and Get In Touch (Right) */}
        <section className="py-12 md:py-20">
          <div className="container-legal max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
              {/* Left Side - About Us */}
              <div className="space-y-6 lg:sticky lg:top-24">
                <div>
                  <p className="text-base md:text-lg font-serif mb-3 md:mb-4 text-primary font-semibold">About Us</p>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 md:mb-8 leading-tight text-foreground">
                    Legal Due Diligence Needs A New AI Partner
                  </h1>
                </div>
                
                <div className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed text-muted-foreground">
                  <p>
                    My Jurist was built for legal professionals who are tired of AI vendors overpromising and underdelivering. Too many solutions sound impressive in theory but fail to handle the real-world complexity of legal document analysis and contract drafting.
                  </p>
                  <p>
                    At My Jurist, we combine deep legal expertise with purpose-built AI agents that seamlessly fit your workflows. Our technology goes beyond simple document summarization - it automates complex legal research, ensures full auditability, and delivers real operational impact. No black boxes. No shortcuts.
                  </p>
                </div>

                {/* Link to About Us Page */}
                <div className="pt-4 md:pt-6">
                  <Link 
                    href="/about" 
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold transition-colors group"
                  >
                    Learn more about our team
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* Right Side - Get In Touch Form */}
              <div className="w-full">
                <ContactFormSection 
                  title="Get In Touch"
                  subtitle="Ready to transform your legal due diligence process? Let's discuss how My Jurist can help."
                  inlineMode={true}
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage; 