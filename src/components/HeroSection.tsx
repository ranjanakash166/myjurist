import React from 'react';
import { Scale, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const HeroSection: React.FC = () => {
  const heroRef = useScrollAnimation();

  const handleRequestDemo = () => {
    window.location.href = '/contact';
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-2xl animate-pulse"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>
      
      <div ref={heroRef} className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-on-scroll">
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <Scale className="h-24 w-24 text-primary group-hover:text-accent transition-colors duration-500 animate-bounce relative z-10" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 text-foreground animate-fade-in">
          My Jurist
        </h1>
        
        <p className="text-2xl md:text-3xl text-muted-foreground mb-8 font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Next Gen AI Law Firm
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleRequestDemo}
            size="lg"
            className="group px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto min-w-[200px]"
          >
            <span>Request a Demo</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="group px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto min-w-[200px]"
          >
            <span>Learn More</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Card className="document-card hover-scale">
            <CardContent className="p-4">
              <div className="text-primary font-semibold">🔒 Local Security</div>
              <div className="text-muted-foreground text-sm">Your data stays within your jurisdiction</div>
            </CardContent>
          </Card>
          <Card className="document-card hover-scale">
            <CardContent className="p-4">
              <div className="text-accent font-semibold">⚡ 70% Faster</div>
              <div className="text-muted-foreground text-sm">Automated due diligence processes</div>
            </CardContent>
          </Card>
          <Card className="document-card hover-scale">
            <CardContent className="p-4">
              <div className="text-primary font-semibold">🌍 Global Intelligence</div>
              <div className="text-muted-foreground text-sm">Comprehensive patent database</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 