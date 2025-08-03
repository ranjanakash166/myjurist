"use client"

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm' 
        : 'bg-transparent'
    }`}>
      <div className="container-legal">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Image 
                src="/images/myjurist-logo.png" 
                alt="My Jurist Logo" 
                width={50} 
                height={50} 
                className="group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:bg-accent/20 transition-all duration-300"></div>
            </div>
            <span className="font-bold text-foreground text-lg md:text-xl">
              My Jurist
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.filter(item => !item.href || item.href === '/contact').map((item) => (
                  <NavigationMenuItem key={item.id}>
                    <Button
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => handleNavClick(item)}
                      className="transition-all duration-300"
                    >
                      {item.label}
                    </Button>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </div>

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
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg overflow-hidden">
                        <Image 
                          src="/images/myjurist-logo.png" 
                          alt="My Jurist" 
                          width={32} 
                          height={32}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-lg font-bold text-foreground">My Jurist</span>
                    </div>
                  </div>
                  
                  {/* Navigation Items */}
                  <nav className="flex-1 p-4 space-y-2">
                    {navigation.filter(item => !item.href || item.href === '/contact').map((item) => (
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
                  </nav>
                  
                  {/* Auth Section */}
                  <div className="p-4 border-t border-border space-y-3">
                    <div className="text-sm font-medium text-muted-foreground mb-3 px-2">
                      Get Started
                    </div>
                    {navigation.filter(item => item.href === '/login' || item.href === '/register').map((item) => (
                      <Button 
                        key={item.id}
                        asChild 
                        variant={item.href === '/register' ? 'outline' : 'default'}
                        className="w-full h-12 text-base font-medium"
                      >
                        <Link href={item.href!}>
                          {item.href === '/login' ? 'Sign In' : 'Create Account'}
                        </Link>
                      </Button>
                    ))}
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