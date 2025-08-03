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
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0">
        {/* Primary gradient blob */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl opacity-40 animate-float"></div>
        
        {/* Secondary gradient blob */}
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-tl from-accent/30 via-accent/15 to-transparent rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        
        {/* Center morphing blob */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-primary/15 via-accent/10 to-primary/5 rounded-full blur-2xl morphing-blob"></div>
        
        {/* Additional floating elements */}
        <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-gradient-to-br from-accent/15 to-primary/10 rounded-full blur-lg animate-float" style={{ animationDelay: '3s' }}></div>
      </div>
      
      {/* Enhanced floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-primary to-accent rounded-full animate-float opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>
      
      <div ref={heroRef} className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-on-scroll">
        <div className="mb-8 flex justify-center">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-slow"></div>
            <Scale className="h-24 w-24 text-primary group-hover:text-accent transition-colors duration-500 animate-bounce relative z-10" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-accent animate-sparkle" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in hero-title-gradient">
          My Jurist
        </h1>
        
        <p className="text-2xl md:text-3xl mb-8 font-light animate-slide-up hero-subtitle-gradient" style={{ animationDelay: '0.2s' }}>
          Next Gen AI Law Firm
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Button 
            onClick={handleRequestDemo}
            size="lg"
            className="group px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto min-w-[200px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl"
          >
            <span>Request a Demo</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            className="group px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto min-w-[200px] border-2 hover:border-primary/50 hover:bg-primary/5"
          >
            <span>Learn More</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
        
        {/* Enhanced feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <Card className="document-card hover-scale glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-primary font-semibold text-lg mb-2">🔒 Local Security</div>
              <div className="text-muted-foreground text-sm">Your data stays within your jurisdiction</div>
            </CardContent>
          </Card>
          <Card className="document-card hover-scale glass-effect border-accent/20 hover:border-accent/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-foreground font-semibold text-lg mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">⚡ 70% Faster</div>
              <div className="text-muted-foreground text-sm">Automated due diligence processes</div>
            </CardContent>
          </Card>
          <Card className="document-card hover-scale glass-effect border-primary/20 hover:border-primary/40 transition-all duration-300">
            <CardContent className="p-6">
              <div className="text-primary font-semibold text-lg mb-2">🌍 Global Intelligence</div>
              <div className="text-muted-foreground text-sm">Comprehensive patent database</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 