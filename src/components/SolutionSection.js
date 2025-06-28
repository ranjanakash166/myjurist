import React from 'react';
import { Shield, Globe, Zap, CheckCircle } from 'lucide-react';

const SolutionSection = () => {
  return (
    <section id="solution" className="py-20 bg-gradient-to-b from-red-950/10 to-black">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          Introducing My Jurist's Proprietary AI Platform
        </h2>
        
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-red-500/20">
              <Shield className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-red-400">Locally-Hosted Security</h3>
              <p className="text-gray-300">Your data stays securely within your jurisdiction, eliminating cloud-based risks.</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-red-500/20">
              <Globe className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-red-400">Exclusive Global Patent LLM</h3>
              <p className="text-gray-300">Our uniquely trained AI is built upon the world's most comprehensive patent data repository, offering unmatched insights.</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-red-500/20">
              <Zap className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-red-400">Efficient Automation</h3>
              <p className="text-gray-300">My Jurist automates up to 70% of due diligence tasks, dramatically reducing costs and timelines.</p>
            </div>
            
            <div className="bg-gradient-to-r from-gray-900 to-black p-6 rounded-xl border border-red-500/20">
              <CheckCircle className="h-10 w-10 text-red-500 mb-4" />
              <h3 className="text-xl font-bold mb-3 text-red-400">Guaranteed Compliance</h3>
              <p className="text-gray-300">Fully aligned with global data privacy and regulatory requirements, ensuring peace of mind.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection; 