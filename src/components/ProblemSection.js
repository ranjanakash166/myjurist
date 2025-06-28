import React from 'react';
import { TrendingUp, Lock, Database } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: TrendingUp,
      title: "High Costs, Slow Results",
      description: "Traditional due diligence processes drain resources and time, hindering responsiveness and competitiveness.",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      icon: Lock,
      title: "Data Privacy Concerns",
      description: "Clients are wary of cloud-hosted AI services, fearing sensitive information breaches and compliance violations.",
      bgColor: "bg-purple-500",
      textColor: "text-purple-400"
    },
    {
      icon: Database,
      title: "Incomplete Patent Intelligence",
      description: "Current tools lack comprehensive global patent data, limiting strategic decision-making.",
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-400"
    }
  ];

  return (
    <section id="problem" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            The Challenge with Traditional Legal Due Diligence
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-gray-800 p-8 rounded-2xl border border-gray-700"
            >
              <div className={`h-12 w-12 ${problem.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <problem.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className={`text-2xl font-bold mb-4 ${problem.textColor}`}>
                {problem.title}
              </h3>
              <p className="text-gray-300 leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection; 