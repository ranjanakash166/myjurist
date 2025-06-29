import React from 'react';
import { Scale, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  const handleRequestDemo = () => {
    window.location.href = '/contact';
  };

  const handleContactUs = () => {
    window.location.href = '/contact';
  };

  return (
    <footer className="bg-gradient-to-t from-slate-900/80 to-slate-800/40 py-12 border-t border-ai-blue-500/20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center space-x-3 mb-6 group">
          <div className="relative">
            <Scale className="h-8 w-8 text-ai-blue-400 group-hover:text-ai-cyan-400 transition-colors duration-300" />
            <div className="absolute inset-0 bg-ai-blue-400/20 rounded-full blur-lg group-hover:bg-ai-cyan-400/20 transition-all duration-300"></div>
          </div>
          <span className="text-2xl font-bold gradient-text-animate">
            My Jurist
          </span>
        </div>
        
        <p className="text-slate-400 mb-8 text-lg">Next Gen AI Law Firm</p>
        
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-8">
          <button 
            onClick={handleRequestDemo}
            className="group bg-gradient-to-r from-ai-blue-600 to-ai-purple-600 hover:from-ai-blue-700 hover:to-ai-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-ai-blue-500/25 flex items-center ai-shadow"
          >
            <Mail className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Request Demo
          </button>
          <button 
            onClick={handleContactUs}
            className="group border-2 border-ai-blue-500 text-ai-blue-400 hover:bg-ai-blue-500 hover:text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center hover:shadow-lg hover:shadow-ai-blue-500/25"
          >
            <Phone className="mr-2 h-4 w-4 group-hover:animate-bounce" />
            Contact Us
          </button>
        </div>
        
        <div className="mt-8 pt-8 border-t border-ai-blue-500/20">
          <p className="text-slate-500">&copy; 2025 My Jurist. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-slate-500">
            <span className="hover:text-ai-blue-400 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-ai-blue-400 transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-ai-blue-400 transition-colors cursor-pointer">Cookie Policy</span>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="mt-8 flex justify-center space-x-2">
          <div className="w-1 h-1 bg-ai-blue-400 rounded-full animate-pulse"></div>
          <div className="w-1 h-1 bg-ai-purple-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
          <div className="w-1 h-1 bg-ai-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 