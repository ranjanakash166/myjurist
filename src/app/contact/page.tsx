'use client';

import React from 'react';
import { ArrowLeft, Scale, Sparkles, Users, Mail, Linkedin, Twitter } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
        {/* Top Section - Company Information (Dark Background) */}
        <section className="bg-primary text-primary-foreground py-20">
          <div className="container-legal">
            <div className="text-center max-w-4xl mx-auto">
              {/* Header */}
              <p className="text-lg font-serif mb-4 opacity-90">About Us</p>
              
              {/* Main Title */}
              <h1 className="text-5xl md:text-6xl font-serif font-bold mb-8 leading-tight">
                Legal Due Diligence Needs A New AI Partner
              </h1>
              
              {/* Body Text */}
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  My Jurist was built for legal professionals who are tired of AI vendors overpromising and underdelivering. Too many solutions sound impressive in theory but fail to handle the real-world complexity of legal document analysis and contract drafting.
                </p>
                <p>
                  At My Jurist, we combine deep legal expertise with purpose-built AI agents that seamlessly fit your workflows. Our technology goes beyond simple document summarization - it automates complex legal research, ensures full auditability, and delivers real operational impact. No black boxes. No shortcuts.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Section - Founder Information (White Background) */}
        <section className="bg-background py-20">
          <div className="container-legal">
            <div className="text-center max-w-6xl mx-auto">
              {/* Section Title */}
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
                Founded By Industry Veterans
              </h2>
              
              {/* Introductory Text */}
              <p className="text-lg text-muted-foreground mb-16 max-w-4xl mx-auto leading-relaxed">
                Our team has built at the frontier of legal technology and AI. Shashank brings experience from leading law firms and business administration, Gaurav has engineered AI systems for highly regulated industries, and Akash has driven product strategy for legal AI solutions that transform how legal professionals work.
              </p>
              
              {/* Founder Images */}
              <div className="mb-16">
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                  {/* Shashank */}
                  <div className="text-center">
                    <div className="w-32 h-32 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/images/shashank.jpeg" 
                        alt="Shashank" 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Users className="h-16 w-16 text-primary-foreground hidden" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Shashank</h3>
                    <p className="text-primary font-semibold mb-2">Co-Founder & CEO</p>
                    <p className="text-muted-foreground text-sm mb-4">
                      Holds degrees in Law and Business Administration. Dedicated to developing innovative legal AI solutions.
                    </p>
                    <p className="text-sm text-primary font-semibold mb-4">
                      Reach out for partnership and business inquiries.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <a href="mailto:support@myjurist.io" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Mail className="h-4 w-4 text-primary" />
                      </a>
                      <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Linkedin className="h-4 w-4 text-primary" />
                      </a>
                      <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Twitter className="h-4 w-4 text-primary" />
                      </a>
                    </div>
                  </div>

                  {/* Gaurav */}
                  <div className="text-center">
                    <div className="w-32 h-32 bg-accent rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/images/gaurav.jpeg" 
                        alt="Gaurav Suman" 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Users className="h-16 w-16 text-accent-foreground hidden" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Gaurav Suman</h3>
                    <p className="text-foreground font-semibold mb-2">Co-Founder & CTO</p>
                    <p className="text-muted-foreground text-sm mb-4">
                      Leads technology and product development. Expert in AI systems for regulated industries.
                    </p>
                    <p className="text-sm text-foreground font-semibold mb-4">
                      Reach out for technical inquiries and support.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <a href="mailto:support@myjurist.io" className="p-2 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                        <Mail className="h-4 w-4 text-accent" />
                      </a>
                      <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                        <Linkedin className="h-4 w-4 text-accent" />
                      </a>
                      <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-accent/10 rounded-lg hover:bg-accent/20 transition-colors">
                        <Twitter className="h-4 w-4 text-accent" />
                      </a>
                    </div>
                  </div>

                  {/* Akash */}
                  <div className="text-center">
                    <div className="w-32 h-32 bg-primary rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/images/akash-ranjan.jpeg" 
                        alt="Akash Ranjan" 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Users className="h-16 w-16 text-primary-foreground hidden" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-2">Akash Ranjan</h3>
                    <p className="text-primary font-semibold mb-2">Co-Founder & CPO</p>
                    <p className="text-muted-foreground text-sm mb-4">
                      Drives product strategy and user experience design. Focuses on creating intuitive legal AI solutions.
                    </p>
                    <p className="text-sm text-primary font-semibold mb-4">
                      Reach out for product feedback and feature requests.
                    </p>
                    <div className="flex justify-center space-x-3">
                      <a href="mailto:support@myjurist.io" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Mail className="h-4 w-4 text-primary" />
                      </a>
                      <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Linkedin className="h-4 w-4 text-primary" />
                      </a>
                      <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors">
                        <Twitter className="h-4 w-4 text-primary" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Values */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Scale className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-2">Expertise</h4>
                  <p className="text-muted-foreground">Deep knowledge in law and AI technology</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-accent mb-2">Innovation</h4>
                  <p className="text-muted-foreground">Pioneering AI solutions for legal industry</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="text-xl font-bold text-primary mb-2">Vision</h4>
                  <p className="text-muted-foreground">Transforming legal due diligence globally</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <ContactFormSection />
      </div>
    </div>
  );
};

export default ContactPage; 