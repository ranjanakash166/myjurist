import React from 'react';
import { Scale, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const handleRequestDemo = () => {
    window.location.href = '/contact';
  };

  const handleContactUs = () => {
    window.location.href = '/contact';
  };

  return (
    <footer className="bg-gradient-to-t from-muted/80 to-background/40 py-8 sm:py-12 border-t border-border overflow-hidden">
      <div className="container-legal text-center max-w-full px-4">
        <div className="flex items-center justify-center space-x-3 mb-6 group">
          <div className="relative">
            <Scale className="h-8 w-8 text-primary group-hover:text-accent transition-colors duration-300" />
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-accent/20 transition-all duration-300"></div>
          </div>
          <span className="text-2xl font-bold text-foreground">
            My Jurist
          </span>
        </div>
        
        <p className="text-muted-foreground mb-8 text-lg">Next Gen AI Law Firm</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mb-8">
          <Button 
            onClick={handleRequestDemo}
            size="lg"
            className="landing-cta-text group flex items-center justify-center w-full md:w-48 min-w-[200px] p-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Mail className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Request Demo
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={handleContactUs}
            className="group flex items-center justify-center w-full md:w-48 min-w-[200px] p-4 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 transform hover:scale-105"
          >
            <Phone className="mr-2 h-5 w-5 group-hover:animate-bounce" />
            Contact Us
          </Button>
        </div>
        
        <Separator className="my-8" />
        
        <div>
          <p className="text-muted-foreground">&copy; 2025 My Jurist. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-muted-foreground">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 