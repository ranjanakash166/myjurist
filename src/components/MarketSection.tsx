import React from 'react';
import { TrendingUp, Shield, DollarSign, LucideIcon } from 'lucide-react';

interface MarketStat {
  icon: LucideIcon;
  value: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const MarketSection: React.FC = () => {
  const marketStats: MarketStat[] = [
    {
      icon: DollarSign,
      value: "$1T",
      description: "Global legal services industry",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      icon: TrendingUp,
      value: "Surging",
      description: "Demand in patent and IP protection",
      bgColor: "bg-purple-500",
      textColor: "text-purple-400"
    },
    {
      icon: Shield,
      value: "Increased",
      description: "Regulatory pressure for local, secure AI",
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-400"
    }
  ];

  return (
    <section id="market" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            A Rapidly Expanding Legal Tech Market
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {marketStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-gray-800 p-8 rounded-2xl border border-gray-700"
              >
                <div className={`h-16 w-16 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <div className={`text-4xl font-bold ${stat.textColor} mb-4`}>
                  {stat.value}
                </div>
                <p className="text-xl text-gray-300 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Market opportunity highlight */}
        <div className="mt-16 bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-white">
            Seizing the Opportunity
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
            With the legal tech market expanding rapidly and increasing demand for secure, 
            locally-hosted AI solutions, My Jurist is positioned to capture a significant 
            share of this trillion-dollar industry.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketSection; 