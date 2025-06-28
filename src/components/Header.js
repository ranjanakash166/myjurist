import React, { useState, useEffect } from 'react';
import { Scale, Menu, X } from 'lucide-react';

const Header = ({ navigation, activeSection, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'glass-effect border-b border-ai-blue-500/20 shadow-lg' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Scale className="h-8 w-8 text-ai-blue-400 group-hover:text-ai-cyan-400 transition-colors duration-300 animate-pulse-slow" />
              <div className="absolute inset-0 bg-ai-blue-400/20 rounded-full blur-lg group-hover:bg-ai-cyan-400/20 transition-all duration-300"></div>
            </div>
            <span className="text-2xl font-bold gradient-text-animate">
              My Jurist
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                    activeSection === item.id
                      ? 'bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white shadow-lg ai-shadow'
                      : 'text-slate-300 hover:text-ai-blue-400 hover:bg-ai-blue-500/10'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-slate-300 hover:text-ai-blue-400 transition-colors duration-300 p-2 rounded-lg hover:bg-ai-blue-500/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden glass-effect border-b border-ai-blue-500/20 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item, index) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-ai-blue-400 hover:bg-ai-blue-500/10 rounded-lg transition-all duration-300 w-full text-left transform hover:translate-x-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header; 