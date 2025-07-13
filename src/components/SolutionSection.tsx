import React from 'react';
import { Shield, Globe, Zap, CheckCircle, LucideIcon } from 'lucide-react';

interface Solution {
  icon: LucideIcon;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
}

const SolutionSection: React.FC = () => {
  const solutions: Solution[] = [
    {
      icon: Shield,
      title: "Locally-Hosted Security",
      description: "Your data stays securely within your jurisdiction, eliminating cloud-based risks.",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      icon: Globe,
      title: "Exclusive Global Patent LLM",
      description: "Our uniquely trained AI is built upon the world's most comprehensive patent data repository, offering unmatched insights.",
      bgColor: "bg-purple-500",
      textColor: "text-purple-400"
    },
    {
      icon: Zap,
      title: "Efficient Automation",
      description: "My Jurist automates up to 70% of due diligence tasks, dramatically reducing costs and timelines.",
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-400"
    },
    {
      icon: CheckCircle,
      title: "Guaranteed Compliance",
      description: "Fully aligned with global data privacy and regulatory requirements, ensuring peace of mind.",
      bgColor: "bg-blue-500",
      textColor: "text-blue-400"
    }
  ];

  return (
    <section id="solution" className="py-20 bg-slate-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-slate-900 dark:text-white">
            Introducing My Jurist's Proprietary AI Platform
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <div
                key={index}
                className="bg-white border border-slate-300 shadow-lg rounded-xl p-6 text-slate-700 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
              >
                <div className={`h-10 w-10 ${solution.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${solution.textColor} text-slate-900 dark:text-white`}>
                  {solution.title}
                </h3>
                <p className="text-slate-800 dark:text-gray-300 leading-relaxed">
                  {solution.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection; 