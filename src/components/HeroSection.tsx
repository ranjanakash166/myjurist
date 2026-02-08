import React from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const handleRequestDemo = () => {
    window.location.href = '/request-demo';
  };

  const handleWatchVideo = () => {
    // Add video modal or link here
    console.log('Watch video');
  };

  return (
    <section id="home" className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-muted/30"></div>
      
      <div className="relative z-10 text-center max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 sm:pb-12 w-full min-w-0">
        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 text-foreground leading-tight">
          Legal Intelligence, Evolved.
        </h1>
        
        {/* Subheading */}
        <p className="text-xl md:text-2xl mb-10 text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          The first AI partner built for Indian Litigation. Draft, research, and structure your case files with the precision of a senior counsel.
        </p>
        
        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-0">
          <Button 
            onClick={handleRequestDemo}
            size="lg"
            className="landing-cta-button landing-cta-text font-semibold transition-all duration-200 ease-out hover:brightness-110 hover:shadow-xl"
          >
            Request a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            variant="outline"
            size="lg"
            onClick={handleWatchVideo}
            className="p-4 text-base font-semibold border-2 hover:bg-muted transition-all duration-200"
          >
            <Play className="mr-2 h-5 w-5" />
            Watch Video
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
