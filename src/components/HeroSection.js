import React from 'react';
import { Scale, ArrowRight, ChevronRight } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/20 via-black to-red-950/30"></div>
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-400/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <Scale className="h-24 w-24 text-red-500 animate-pulse" />
            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-red-200 to-red-400 bg-clip-text text-transparent">
          My Jurist
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-light">
          Precision Legal AI: Local Data Privacy
        </p>
        
        <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex justify-center">
          <button className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/25 flex items-center mx-auto md:mx-0">
            Request a Demo
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <button className="border-2 border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto md:mx-0">
            Learn More
            <ChevronRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 