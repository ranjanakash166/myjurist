import React from 'react';

const Introduction = () => {
  return (
    <section className="py-20 relative">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-red-400 to-white bg-clip-text text-transparent">
          Welcome to My Jurist
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto">
          The first locally-hosted AI designed exclusively for legal due diligence. 
          Gain efficiency, maintain absolute data privacy, and harness unparalleled global patent insights.
        </p>
      </div>
    </section>
  );
};

export default Introduction; 