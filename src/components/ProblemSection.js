import React from 'react';
import { TrendingUp, Lock, Database } from 'lucide-react';

const ProblemSection = () => {
  return (
    <section id="problem" className="py-20 bg-gradient-to-b from-black to-red-950/10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          The Challenge with Traditional Legal Due Diligence
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105">
            <TrendingUp className="h-12 w-12 text-red-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-red-400">High Costs, Slow Results</h3>
            <p className="text-gray-300 leading-relaxed">
              Traditional due diligence processes drain resources and time, hindering responsiveness and competitiveness.
            </p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105">
            <Lock className="h-12 w-12 text-red-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-red-400">Data Privacy Concerns</h3>
            <p className="text-gray-300 leading-relaxed">
              Clients are wary of cloud-hosted AI services, fearing sensitive information breaches and compliance violations.
            </p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105">
            <Database className="h-12 w-12 text-red-500 mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-red-400">Incomplete Patent Intelligence</h3>
            <p className="text-gray-300 leading-relaxed">
              Current tools lack comprehensive global patent data, limiting strategic decision-making.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection; 