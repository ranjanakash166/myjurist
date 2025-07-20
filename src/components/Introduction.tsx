import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Introduction: React.FC = () => {
  const introRef = useScrollAnimation();

  return (
    <section className="section-legal relative">
      <div ref={introRef} className="container-legal text-center animate-on-scroll">
        <h2 className="text-legal-title text-foreground mb-8">
          Welcome to My Jurist
        </h2>
        <p className="text-legal-body text-muted-foreground leading-relaxed max-w-4xl mx-auto">
          The first locally-hosted AI designed exclusively for legal due diligence. 
          Gain efficiency, maintain absolute data privacy, and harness unparalleled global patent insights.
        </p>
        
        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Introduction; 