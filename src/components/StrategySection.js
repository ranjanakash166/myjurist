import React from 'react';
import { Users, Globe, Award } from 'lucide-react';

const StrategySection = () => {
  return (
    <section id="strategy" className="py-20 bg-gradient-to-b from-red-950/10 to-black">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          Strategic Pathways to Market Leadership
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 text-center">
            <Users className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-red-400">Direct Outreach</h3>
            <p className="text-gray-300">Proactive engagement with leading law firms and corporate legal departments.</p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 text-center">
            <Globe className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-red-400">Partnership Network</h3>
            <p className="text-gray-300">Strategic alliances with regulatory bodies and global patent offices.</p>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 text-center">
            <Award className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4 text-red-400">Thought Leadership</h3>
            <p className="text-gray-300">Industry visibility via webinars, whitepapers, and AI law conferences.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection; 