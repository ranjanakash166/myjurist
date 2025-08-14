import React from 'react';
import { Users, Mail, Linkedin, Twitter, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';

const TeamSection: React.FC = () => {
  return (
    <section id="team" className="section-legal bg-muted/30">
      <div className="container-legal">
        <div className="text-center mb-16">
          <h2 className="text-legal-title text-foreground mb-4">
            Meet Our Expert Team
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Shashank */}
          <Card className="document-card text-center">
            <CardContent className="p-6">
              {/* Profile image */}
              <div className="mb-4">
                <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/images/shashank.jpeg" 
                    alt="Shashank" 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Users className="h-12 w-12 text-primary-foreground hidden" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-1">Shashank</h3>
              <p className="text-sm text-primary font-semibold mb-3">Co-Founder & CEO</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Shashank holds degrees in Law and Business Administration and is dedicated to developing 
                innovative legal AI solutions that enable teams to perform at their highest potential.
              </p>
              
              <p className="text-xs text-primary font-semibold mb-4">
                Reach out to him for partnership and business inquiries.
              </p>
              
              {/* Social links */}
              <div className="flex justify-center space-x-3">
                <a href="mailto:support@myjurist.io" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </a>
                <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Linkedin className="h-4 w-4 text-primary" />
                </a>
                <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Twitter className="h-4 w-4 text-primary" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Gaurav */}
          <Card className="document-card text-center">
            <CardContent className="p-6">
              {/* Profile image */}
              <div className="mb-4">
                <div className="w-24 h-24 bg-accent rounded-full mx-auto flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/images/gaurav.jpeg" 
                    alt="Gaurav Suman" 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Users className="h-12 w-12 text-accent-foreground hidden" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-1">Gaurav Suman</h3>
              <p className="text-sm text-foreground font-semibold mb-3">Co-Founder & CTO</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Gaurav leads our technology and product development. Contact him for technical questions, integrations, or support.
              </p>
              
              <p className="text-xs text-foreground font-semibold mb-4">
                Reach out to him for technical inquiries and support.
              </p>
              
              {/* Social links */}
              <div className="flex justify-center space-x-3">
                <a href="mailto:support@myjurist.io" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </a>
                <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Linkedin className="h-4 w-4 text-primary" />
                </a>
                <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Twitter className="h-4 w-4 text-primary" />
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Akash Ranjan */}
          <Card className="document-card text-center">
            <CardContent className="p-6">
              {/* Profile image */}
              <div className="mb-4">
                <div className="w-24 h-24 bg-primary rounded-full mx-auto flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/images/akash-ranjan.jpeg" 
                    alt="Akash Ranjan" 
                    width={96} 
                    height={96} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to icon if image fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                  <Users className="h-12 w-12 text-primary-foreground hidden" />
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-foreground mb-1">Akash Ranjan</h3>
              <p className="text-sm text-primary font-semibold mb-3">Co-Founder & CPO</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Akash drives product strategy and user experience design. He focuses on creating intuitive 
                and powerful legal AI solutions that transform how legal professionals work.
              </p>
              
              <p className="text-xs text-primary font-semibold mb-4">
                Reach out to him for product feedback and feature requests.
              </p>
              
              {/* Social links */}
              <div className="flex justify-center space-x-3">
                <a href="mailto:support@myjurist.io" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Mail className="h-4 w-4 text-primary" />
                </a>
                <a href="https://linkedin.com/company/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Linkedin className="h-4 w-4 text-primary" />
                </a>
                <a href="https://twitter.com/myjurist" target="_blank" rel="noopener noreferrer" className="p-2 bg-primary/20 rounded-lg border border-primary/30 hover:border-primary/50 transition-all duration-300">
                  <Twitter className="h-4 w-4 text-primary" />
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
    </section>
  );
};

export default TeamSection; 