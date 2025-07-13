import React from 'react';
import { Scale, ArrowRight, ChevronRight, Sparkles } from 'lucide-react';

import { useScrollAnimation } from '../hooks/useScrollAnimation';
import Image from 'next/image';

const HeroSection: React.FC = () => {
  const heroRef = useScrollAnimation();

  const handleRequestDemo = () => {
    window.location.href = '/contact';
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden floating-elements bg-white dark:bg-black">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 morphing-blob rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-ai-purple-500/20 to-ai-cyan-500/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-ai-blue-500/10 to-ai-purple-500/10 rounded-full blur-2xl animate-pulse-slow"></div>
      </div>
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-ai-blue-400 rounded-full animate-float"
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
            <div className="absolute inset-0 bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            <Scale className="h-24 w-24 text-ai-blue-400 group-hover:text-ai-cyan-400 transition-colors duration-500 animate-bounce-slow relative z-10" />
            <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-ai-purple-400 animate-pulse" />
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text-animate animate-fade-in">
          My Jurist
        </h1>
        
        <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-300 mb-8 font-light animate-slide-up" style={{ animationDelay: '0.2s' }}>
          Next Gen AI Law Firm
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex justify-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <button 
            onClick={handleRequestDemo}
            className="group bg-gradient-to-r from-ai-blue-600 to-ai-purple-600 hover:from-ai-blue-700 hover:to-ai-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-ai-blue-500/25 flex items-center justify-center w-full md:w-auto min-w-[200px] ai-shadow"
          >
            <span>Request a Demo</span>
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          <button className="group border-2 border-ai-blue-500 text-ai-blue-400 hover:bg-ai-blue-500 hover:text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto min-w-[200px] hover:shadow-lg hover:shadow-ai-blue-500/25">
            <span>Learn More</span>
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Feature highlights */}
        <div className="mt-16 grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="glass-effect p-4 rounded-xl border-ai-glow hover-scale">
            <div className="text-ai-blue-400 font-semibold">🔒 Local Security</div>
            <div className="text-slate-400 text-sm">Your data stays within your jurisdiction</div>
          </div>
          <div className="glass-effect p-4 rounded-xl border-ai-glow-purple hover-scale">
            <div className="text-ai-purple-400 font-semibold">⚡ 70% Faster</div>
            <div className="text-slate-400 text-sm">Automated due diligence processes</div>
          </div>
          <div className="glass-effect p-4 rounded-xl border-ai-glow hover-scale">
            <div className="text-ai-cyan-400 font-semibold">🌍 Global Intelligence</div>
            <div className="text-slate-400 text-sm">Comprehensive patent database</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 