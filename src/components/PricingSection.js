import React from 'react';
import { CheckCircle } from 'lucide-react';

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-black to-red-950/10">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          Flexible Plans Tailored to Your Needs
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-bold mb-6 text-red-400">Subscription-based SaaS</h3>
            <p className="text-gray-300 mb-6">Ideal for law firms and corporate legal teams seeking ongoing support.</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Monthly billing</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">24/7 support</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Regular updates</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-red-900/20 to-black p-8 rounded-2xl border border-red-500/40 transform scale-105">
            <h3 className="text-2xl font-bold mb-6 text-red-400">Pay-per-use Options</h3>
            <p className="text-gray-300 mb-6">Practical, scalable pricing designed for startups and smaller businesses.</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Usage-based billing</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">No commitments</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Flexible scaling</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-b from-gray-900 to-black p-8 rounded-2xl border border-red-500/20 hover:border-red-500/40 transition-all duration-300 transform hover:scale-105">
            <h3 className="text-2xl font-bold mb-6 text-red-400">Enterprise Solutions</h3>
            <p className="text-gray-300 mb-6">Customized integrations for larger organizations with unique requirements.</p>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Custom integration</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">Dedicated support</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-red-500 mr-3" />
                <span className="text-gray-300">SLA guarantees</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 