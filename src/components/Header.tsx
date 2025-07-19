import React, { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
}

interface HeaderProps {
  navigation: NavigationItem[];
  activeSection: string;
  scrollToSection: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ navigation, activeSection, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: NavigationItem) => {
    if (item.href) {
      // External link - navigate to the page
      window.location.href = item.href;
    } else {
      // Internal section - scroll to section
      scrollToSection(item.id);
    }
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
              <Image 
                src="/images/myjurist-logo.png" 
                alt="My Jurist Logo" 
                width={50} 
                height={50} 
                className="group-hover:scale-110 transition-transform duration-300 animate-pulse-slow"
              />
              <div className="absolute inset-0 bg-ai-blue-400/20 rounded-full blur-lg group-hover:bg-ai-cyan-400/20 transition-all duration-300"></div>
            </div>
            <span className="text-2xl font-bold gradient-text-animate">
              My Jurist
            </span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <div className="ml-10 flex items-baseline space-x-1">
              {navigation.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
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
            {/* Auth Buttons */}
            <div className="ml-4 flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-ai-blue-400 hover:bg-ai-blue-500/10 rounded-lg transition-all duration-300"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white rounded-lg hover:scale-105 transition-all duration-300 ai-shadow"
              >
                Register
              </Link>
            </div>
            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-4 p-2 rounded-lg border border-ai-blue-500/20 bg-slate-800/60 hover:bg-slate-700/80 transition-colors text-ai-blue-400 hover:text-ai-blue-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          {/* Mobile menu button + Theme Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg border border-ai-blue-500/20 bg-slate-800/60 hover:bg-slate-700/80 transition-colors text-ai-blue-400 hover:text-ai-blue-200"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
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
                onClick={() => handleNavClick(item)}
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-ai-blue-400 hover:bg-ai-blue-500/10 rounded-lg transition-all duration-300 w-full text-left transform hover:translate-x-2"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {item.label}
              </button>
            ))}
            {/* Mobile Auth Buttons */}
            <div className="pt-2 border-t border-ai-blue-500/20 mt-2">
              <Link
                href="/login"
                className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-ai-blue-400 hover:bg-ai-blue-500/10 rounded-lg transition-all duration-300 w-full text-left transform hover:translate-x-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-ai-blue-500 to-ai-purple-500 text-white rounded-lg hover:scale-105 transition-all duration-300 ai-shadow mt-2"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header; 