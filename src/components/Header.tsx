"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X, MessageCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import MyJuristLogoWithWordmark from '@/components/landing/MyJuristLogoWithWordmark';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

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
  };

  // Separate navigation items
  const internalNavItems = navigation.filter(item => !item.href);
  const contactItem = navigation.find(item => item.href === '/contact');
  const requestDemoItem = navigation.find(item => item.href === '/request-demo');
  const loginItem = navigation.find(item => item.href === '/login');

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container-legal">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Left Section - Logo */}
          <div className="flex items-center pr-8">
            <MyJuristLogoWithWordmark variant="light" size={41} href="/" className="hover:opacity-90 transition-opacity" />
          </div>

          {/* Center Section - Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {internalNavItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                onClick={() => handleNavClick(item)}
                className="transition-all duration-300 whitespace-nowrap"
              >
                {item.label}
              </Button>
            ))}
          </div>

          {/* Right Section - Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Contact Us Button */}
            {contactItem && (
              <Button
                variant="outline"
                onClick={() => handleNavClick(contactItem)}
                className="group relative overflow-hidden border-primary hover:border-primary/80 transition-all duration-300 bg-primary/5 hover:bg-primary/10 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <span className="text-primary font-semibold group-hover:text-primary/90 transition-colors duration-300">
                  Contact Us
                </span>
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md"></div>
              </Button>
            )}

            {/* Login Button */}
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-lg hover:bg-accent/50 transition-colors">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] p-0">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-6 border-b border-border">
                    <MyJuristLogoWithWordmark variant="light" size={32} href="/" />
                  </div>
                  
                  {/* Navigation Items */}
                  <nav className="flex-1 p-4 space-y-2">
                    {internalNavItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "default" : "ghost"}
                        onClick={() => handleNavClick(item)}
                        className={`w-full justify-start h-12 text-base font-medium transition-all duration-200 ${
                          activeSection === item.id 
                            ? 'bg-primary text-primary-foreground shadow-md' 
                            : 'hover:bg-accent hover:text-foreground'
                        }`}
                      >
                        {item.label}
                      </Button>
                    ))}
                    
                    {/* Contact Us Mobile */}
                    {contactItem && (
                      <Button
                        variant="outline"
                        onClick={() => handleNavClick(contactItem)}
                        className="w-full justify-start h-12 text-base font-medium border-primary bg-primary/5 hover:bg-primary/10 shadow-md"
                      >
                        <span className="text-primary font-semibold">
                          Contact Us
                        </span>
                      </Button>
                    )}
                  </nav>
                  
                  {/* Auth Section */}
                  <div className="p-4 border-t border-border space-y-3">
                    <div className="text-sm font-medium text-muted-foreground mb-3 px-2">
                      Get Started
                    </div>
                    <Button 
                      asChild 
                      className="w-full h-12 text-base font-medium"
                    >
                      <Link href="/login">
                        Sign In
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header; 