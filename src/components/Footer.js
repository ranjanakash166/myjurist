import React from 'react';
import { Scale } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-red-950/20 to-black py-12 border-t border-red-500/20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-2 mb-6">
          <Scale className="h-8 w-8 text-red-500" />
          <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent">
            My Jurist
          </span>
        </div>
        <p className="text-gray-400 mb-6">Precision Legal AI: Local Data Privacy</p>
        <div className="flex justify-center space-x-8">
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            Request Demo
          </button>
          <button className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
            Contact Us
          </button>
        </div>
        <div className="mt-8 pt-8 border-t border-red-500/20">
          <p className="text-gray-500">&copy; 2025 My Jurist. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 