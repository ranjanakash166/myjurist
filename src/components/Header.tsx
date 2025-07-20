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
        <div className="flex items-center justify-between h-16">
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
            <span className="font-bold text-foreground">
              My Jurist
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <NavigationMenu>
              <NavigationMenuList>
                {navigation.map((item) => (
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
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Navigate through the sections of My Jurist
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-4">
                  {navigation.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      onClick={() => handleNavClick(item)}
                      className="w-full justify-start"
                    >
                      {item.label}
                    </Button>
                  ))}
                  <div className="pt-4 border-t">
                    <Button variant="ghost" asChild className="w-full justify-start">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="w-full justify-start mt-2">
                      <Link href="/register">Register</Link>
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