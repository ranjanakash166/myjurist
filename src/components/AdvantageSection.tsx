import React from 'react';
import { Award, Database, TrendingUp, Shield, LucideIcon } from 'lucide-react';

interface Advantage {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const AdvantageSection: React.FC = () => {
  const advantages: Advantage[] = [
    {
      icon: Award,
      title: "First Locally-Hosted AI for Due Diligence",
      description: "Exclusively tailored solution to address data privacy and security requirements in legal workflows.",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      icon: Database,
      title: "Comprehensive Global Patent Database",
      description: "Exclusive LLM trained specifically to handle extensive global patent insights.",
      bgColor: "bg-purple-500",
      textColor: "text-purple-400"
    },
    {
      icon: TrendingUp,
      title: "Significant Cost Reduction",
      description: "My Jurist reduces due diligence costs by approximately 70% compared to traditional methods.",
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-400"
    },
    {
      icon: Shield,
      title: "Enhanced Data Privacy",
      description: "Robust data security measures ensure compliance with even the strictest regulatory frameworks.",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    }
  ];

  return (
    <section id="advantage" className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Why My Jurist Stands Apart
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="space-y-12">
          {[0, 2].map((startIndex) => (
            <div key={startIndex} className="grid md:grid-cols-2 gap-8">
              {advantages.slice(startIndex, startIndex + 2).map((advantage, index) => {
                const IconComponent = advantage.icon;
                return (
                  <div
                    key={startIndex + index}
                    className="bg-gray-900 p-8 rounded-2xl border border-gray-700"
                  >
                    <div className={`h-12 w-12 ${advantage.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <h3 className={`text-2xl font-bold mb-4 ${advantage.textColor}`}>
                      {advantage.title}
                    </h3>
                    <p className="text-gray-300 leading-relaxed">
                      {advantage.description}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        
        {/* Competitive edge highlight */}
        <div className="mt-16 bg-gray-900 p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-white text-center">
            Unmatched Competitive Edge
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-center max-w-4xl mx-auto">
            My Jurist combines cutting-edge AI technology with unparalleled data privacy, 
            creating a solution that no competitor can match. Our locally-hosted approach 
            and comprehensive patent intelligence give us a decisive advantage in the market.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AdvantageSection; 