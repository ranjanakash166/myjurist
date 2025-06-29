import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const Introduction: React.FC = () => {
  const introRef = useScrollAnimation();

  return (
    <section className="py-10 relative">
      <div ref={introRef} className="max-w-6xl mx-auto px-4 text-center animate-on-scroll">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 gradient-text-animate">
          Welcome to My Jurist
        </h2>
        <p className="text-xl md:text-2xl text-slate-300 leading-relaxed max-w-4xl mx-auto">
          The first locally-hosted AI designed exclusively for legal due diligence. 
          Gain efficiency, maintain absolute data privacy, and harness unparalleled global patent insights.
        </p>
        
        {/* Decorative elements */}
        <div className="mt-12 flex justify-center space-x-4">
          <div className="w-2 h-2 bg-ai-blue-400 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-ai-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-2 h-2 bg-ai-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
    </section>
  );
};

export default Introduction; 