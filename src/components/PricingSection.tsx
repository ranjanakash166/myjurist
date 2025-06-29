import React from 'react';
import { CheckCircle, Star, Crown, ArrowRight } from 'lucide-react';

interface PricingPlan {
  title: string;
  description: string;
  features: string[];
  bgColor: string;
  textColor: string;
  popular: boolean;
}

const PricingSection: React.FC = () => {
  const pricingPlans: PricingPlan[] = [
    {
      title: "Subscription-based SaaS",
      description: "Ideal for law firms and corporate legal teams seeking ongoing support.",
      features: ["Monthly billing", "24/7 support", "Regular updates"],
      bgColor: "bg-blue-500",
      textColor: "text-blue-400",
      popular: false
    },
    {
      title: "Pay-per-use Options",
      description: "Practical, scalable pricing designed for startups and smaller businesses.",
      features: ["Usage-based billing", "No commitments", "Flexible scaling"],
      bgColor: "bg-purple-500",
      textColor: "text-purple-400",
      popular: true
    },
    {
      title: "Enterprise Solutions",
      description: "Customized integrations for larger organizations with unique requirements.",
      features: ["Custom integration", "Dedicated support", "SLA guarantees"],
      bgColor: "bg-cyan-500",
      textColor: "text-cyan-400",
      popular: false
    }
  ];

  const handleGetStarted = () => {
    window.location.href = '/contact';
  };

  return (
    <section id="pricing" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Flexible Plans Tailored to Your Needs
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`bg-gray-800 p-8 rounded-2xl border border-gray-700 relative flex flex-col ${
                plan.popular ? 'border-purple-500' : ''
              }`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-purple-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}
              
              <h3 className={`text-2xl font-bold mb-6 ${plan.textColor} flex items-center`}>
                {plan.popular && <Crown className="h-6 w-6 mr-2 text-purple-400" />}
                {plan.title}
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {plan.description}
              </p>
              
              <div className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center">
                    <CheckCircle className={`h-5 w-5 ${plan.textColor} mr-3`} />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Get Started Button */}
              <button
                onClick={handleGetStarted}
                className={`group w-full bg-gradient-to-r ${plan.bgColor} hover:opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg flex items-center justify-center ${
                  plan.popular ? 'shadow-lg shadow-purple-500/25' : ''
                }`}
              >
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          ))}
        </div>
        
        {/* Pricing highlight */}
        <div className="mt-16 bg-gray-800 p-8 rounded-2xl border border-gray-700">
          <h3 className="text-2xl font-bold mb-4 text-white text-center">
            Transparent, Value-Driven Pricing
          </h3>
          <p className="text-gray-300 text-lg leading-relaxed text-center max-w-3xl mx-auto">
            Our flexible pricing model ensures that organizations of all sizes can access 
            the power of My Jurist's AI platform. From startups to enterprise corporations, 
            we have a solution that fits your needs and budget.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection; 