import React from 'react';
import { Award, Database, TrendingUp, Shield } from 'lucide-react';

const AdvantageSection = () => {
  return (
    <section id="advantage" className="py-20 bg-gradient-to-b from-red-950/10 to-black">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          Why My Jurist Stands Apart
        </h2>
        
        <div className="space-y-12">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-red-500/20">
              <Award className="h-12 w-12 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-red-400">First Locally-Hosted AI for Due Diligence</h3>
              <p className="text-gray-300">Exclusively tailored solution to address data privacy and security requirements in legal workflows.</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-red-500/20">
              <Database className="h-12 w-12 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-red-400">Comprehensive Global Patent Database</h3>
              <p className="text-gray-300">Exclusive LLM trained specifically to handle extensive global patent insights.</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-red-500/20">
              <TrendingUp className="h-12 w-12 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-red-400">Significant Cost Reduction</h3>
              <p className="text-gray-300">My Jurist reduces due diligence costs by approximately 70% compared to traditional methods.</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-black p-8 rounded-2xl border border-red-500/20">
              <Shield className="h-12 w-12 text-red-500 mb-6" />
              <h3 className="text-2xl font-bold mb-4 text-red-400">Enhanced Data Privacy</h3>
              <p className="text-gray-300">Robust data security measures ensure compliance with even the strictest regulatory frameworks.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdvantageSection; 