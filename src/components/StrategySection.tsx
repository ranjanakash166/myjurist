import React from 'react';
import { Users, Globe, Award, Target, LucideIcon } from 'lucide-react';

interface Strategy {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const StrategySection: React.FC = () => {
  const strategies: Strategy[] = [
    {
      icon: Users,
      title: "Direct Outreach",
      description: "Proactive engagement with leading law firms and corporate legal departments.",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      icon: Globe,
      title: "Partnership Network",
      description: "Strategic alliances with regulatory bodies and global patent offices.",
      bgColor: "bg-purple-500",
      textColor: "text-purple-400"
    },
    {
      icon: Award,
      title: "Thought Leadership",
      description: "Industry visibility via webinars, whitepapers, and AI law conferences.",
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-400"
    }
  ];

  return (
    <section id="strategy" className="py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Strategic Pathways to Market Leadership
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => {
            const IconComponent = strategy.icon;
            return (
              <div
                key={index}
                className="bg-gray-900 p-8 rounded-2xl border border-gray-700 text-center"
              >
                <div className={`h-16 w-16 ${strategy.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  <IconComponent className="h-8 w-8 text-white" />
                </div>
                <h3 className={`text-2xl font-bold mb-4 ${strategy.textColor}`}>
                  {strategy.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {strategy.description}
                </p>
              </div>
            );
          })}
        </div>
        
        {/* Strategy roadmap */}
        <div className="mt-16 bg-gray-900 p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-white text-center">
            Comprehensive Go-to-Market Strategy
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-center max-w-4xl mx-auto mb-8">
            Our multi-faceted approach combines direct market penetration with strategic partnerships 
            and thought leadership to establish My Jurist as the definitive AI solution for legal due diligence.
          </p>
          
          {/* Strategy timeline */}
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <Target className="h-6 w-6 text-blue-400 mr-2" />
              <span className="text-gray-300">Q1: Market Entry</span>
            </div>
            <div className="hidden md:block w-8 h-0.5 bg-blue-500"></div>
            <div className="md:hidden w-0.5 h-8 bg-blue-500"></div>
            <div className="flex items-center">
              <Target className="h-6 w-6 text-purple-400 mr-2" />
              <span className="text-gray-300">Q2: Partnership Growth</span>
            </div>
            <div className="hidden md:block w-8 h-0.5 bg-purple-500"></div>
            <div className="md:hidden w-0.5 h-8 bg-purple-500"></div>
            <div className="flex items-center">
              <Target className="h-6 w-6 text-cyan-400 mr-2" />
              <span className="text-gray-300">Q3: Market Leadership</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StrategySection; 