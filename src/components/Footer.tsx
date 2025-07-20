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
    <footer className="bg-gradient-to-t from-muted/80 to-background/40 py-12 border-t border-border">
      <div className="container-legal text-center">
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
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
          <Button 
            onClick={handleRequestDemo}
            className="group flex items-center"
          >
            <Mail className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Request Demo
          </Button>
          <Button 
            variant="outline"
            onClick={handleContactUs}
            className="group flex items-center"
          >
            <Phone className="mr-2 h-4 w-4 group-hover:animate-bounce" />
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