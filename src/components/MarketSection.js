import React from 'react';
import { TrendingUp, Shield } from 'lucide-react';

const MarketSection = () => {
  return (
    <section id="market" className="py-20 bg-gradient-to-b from-black to-red-950/10">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-5xl font-bold mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          A Rapidly Expanding Legal Tech Market
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-red-900/20 to-black p-8 rounded-2xl border border-red-500/30">
            <div className="text-4xl font-bold text-red-400 mb-4">$1T</div>
            <p className="text-xl text-gray-300">Global legal services industry</p>
          </div>
          
          <div className="bg-gradient-to-b from-red-900/20 to-black p-8 rounded-2xl border border-red-500/30">
            <TrendingUp className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-300">Surging demand in patent and IP protection</p>
          </div>
          
          <div className="bg-gradient-to-b from-red-900/20 to-black p-8 rounded-2xl border border-red-500/30">
            <Shield className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <p className="text-xl text-gray-300">Increased regulatory pressure for local, secure AI</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketSection; 