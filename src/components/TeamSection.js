import React from 'react';
import { Users } from 'lucide-react';

const TeamSection = () => {
  return (
    <section id="team" className="py-20 bg-gradient-to-b from-black to-red-950/20">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          Meet Our Expert Team
        </h2>
        
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-b from-red-900/20 to-black p-12 rounded-3xl border border-red-500/30">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-red-600 rounded-full mx-auto mb-8 flex items-center justify-center">
              <Users className="h-16 w-16 text-white" />
            </div>
            
            <h3 className="text-3xl font-bold mb-4 text-red-400">Shashank</h3>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              Shashank holds degrees in Law and Business Administration and is dedicated to developing innovative legal AI solutions that enable teams to perform at their highest potential.
            </p>
            <p className="text-lg text-red-400 font-semibold">
              Reach out to him for partnership and business inquiries.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 