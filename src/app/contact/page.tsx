'use client';

import React, { useState } from 'react';
import { Users, Mail, Linkedin, Twitter, ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all fields are filled
    const isFormValid = Object.values(formData).every(value => value.trim() !== '');
    
    if (!isFormValid) {
      alert('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual API call later)
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        message: ''
      });
    }, 1500);
  };

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
        {/* Team Section */}
        <section id="team" className="section-legal bg-muted/30">
          <div className="container-legal">
            <div className="text-center mb-16">
              <h2 className="text-legal-title text-foreground mb-4">
                Meet Our Expert Team
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Shashank */}
              <Card className="document-card text-center">
                <CardContent className="p-8">
                  {/* Profile image */}
                  <div className="mb-6">
                    <div className="w-32 h-32 bg-primary rounded-full mx-auto flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/images/shashank.jpeg" 
                        alt="Shashank" 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Users className="h-16 w-16 text-primary-foreground hidden" />
                    </div>
                  </div>
                  
                  <h3 className="text-legal-heading text-foreground mb-2">Shashank</h3>
                  <p className="text-lg text-primary font-semibold mb-4">Co-Founder & CEO</p>
                  <p className="text-legal-body text-muted-foreground mb-6 leading-relaxed">
                    Shashank holds degrees in Law and Business Administration and is dedicated to developing 
                    innovative legal AI solutions that enable teams to perform at their highest potential.
                  </p>
                  
                  <p className="text-sm text-primary font-semibold mb-6">
                    Reach out to him for partnership and business inquiries.
                  </p>
                  
                  {/* Social links */}
                  <div className="flex justify-center space-x-4">
                    <a href="mailto:support@myjurist.io" className="p-3 bg-primary/20 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300">
                      <Mail className="h-5 w-5 text-primary" />
                    </a>
                    <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-accent/20 rounded-xl border border-accent/30 hover:border-accent/50 transition-all duration-300">
                      <Linkedin className="h-5 w-5 text-accent" />
                    </a>
                    <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/20 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300">
                      <Twitter className="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Gaurav */}
              <Card className="document-card text-center">
                <CardContent className="p-8">
                  {/* Profile image */}
                  <div className="mb-6">
                    <div className="w-32 h-32 bg-accent rounded-full mx-auto flex items-center justify-center overflow-hidden">
                      <Image 
                        src="/images/gaurav.jpeg" 
                        alt="Gaurav Suman" 
                        width={128} 
                        height={128} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <Users className="h-16 w-16 text-accent-foreground hidden" />
                    </div>
                  </div>
                  
                  <h3 className="text-legal-heading text-foreground mb-2">Gaurav Suman</h3>
                  <p className="text-lg text-accent font-semibold mb-4">Co-Founder & CTO</p>
                  <p className="text-legal-body text-muted-foreground mb-6 leading-relaxed">
                    Gaurav leads our technology and product development. Contact him for technical questions, integrations, or support.
                  </p>
                  
                  <p className="text-sm text-accent font-semibold mb-6">
                    Reach out to him for technical inquiries and support.
                  </p>
                  
                  {/* Social links */}
                  <div className="flex justify-center space-x-4">
                    <a href="mailto:support@myjurist.io" className="p-3 bg-accent/20 rounded-xl border border-accent/30 hover:border-accent/50 transition-all duration-300">
                      <Mail className="h-5 w-5 text-accent" />
                    </a>
                    <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/20 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300">
                      <Linkedin className="h-5 w-5 text-primary" />
                    </a>
                    <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-3 bg-primary/20 rounded-xl border border-primary/30 hover:border-primary/50 transition-all duration-300">
                      <Twitter className="h-5 w-5 text-primary" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Team values */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary-foreground" />
                </div>
                <h4 className="text-xl font-bold text-primary mb-2">Expertise</h4>
                <p className="text-muted-foreground">Deep knowledge in law and AI technology</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-accent-foreground" />
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
        </section>

        {/* Contact Form Section */}
        <section className="section-legal bg-background">
          <div className="container-legal max-w-4xl">
            <div className="text-center mb-16">
              <h2 className="text-legal-title text-foreground mb-4">
                Get In Touch
              </h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
              <p className="text-legal-body text-muted-foreground mt-6">
                Ready to transform your legal due diligence process? Let's discuss how My Jurist can help.
              </p>
            </div>
            
            <Card className="document-card">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-foreground">
                      Thank You!
                    </h3>
                    <p className="text-xl text-muted-foreground mb-6">
                      Your query has been submitted successfully.
                    </p>
                    <p className="text-lg text-primary">
                      Our team will get back to you soon.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      className="mt-8"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        placeholder="Enter your company name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your needs..."
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage; 