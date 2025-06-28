import React from 'react';
import { Users, Mail, Linkedin, Twitter } from 'lucide-react';

const TeamSection = () => {
  return (
    <section id="team" className="py-20 bg-gray-900">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4 text-white">
            Meet Our Expert Team
          </h2>
          <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gray-800 p-12 rounded-3xl border border-gray-700">
            {/* Profile image */}
            <div className="mb-8">
              <div className="w-32 h-32 bg-blue-500 rounded-full mx-auto flex items-center justify-center">
                <Users className="h-16 w-16 text-white" />
              </div>
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-white">Shashank</h3>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Shashank holds degrees in Law and Business Administration and is dedicated to developing 
              innovative legal AI solutions that enable teams to perform at their highest potential.
            </p>
            
            <p className="text-lg text-blue-400 font-semibold mb-8">
              Reach out to him for partnership and business inquiries.
            </p>
            
            {/* Social links */}
            <div className="flex justify-center space-x-6">
              <a href="#" className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300">
                <Mail className="h-5 w-5 text-blue-400" />
              </a>
              <a href="#" className="p-3 bg-purple-500/20 rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                <Linkedin className="h-5 w-5 text-purple-400" />
              </a>
              <a href="#" className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300">
                <Twitter className="h-5 w-5 text-cyan-400" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Team values */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-blue-400 mb-2">Expertise</h4>
            <p className="text-gray-300">Deep knowledge in law and AI technology</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-purple-400 mb-2">Innovation</h4>
            <p className="text-gray-300">Pioneering AI solutions for legal industry</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-xl font-bold text-cyan-400 mb-2">Vision</h4>
            <p className="text-gray-300">Transforming legal due diligence globally</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 