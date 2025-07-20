'use client';

import React, { useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import Introduction from '../components/Introduction';
import ProblemSection from '../components/ProblemSection';
import SolutionSection from '../components/SolutionSection';
import MarketSection from '../components/MarketSection';
import AdvantageSection from '../components/AdvantageSection';
import PricingSection from '../components/PricingSection';
import StrategySection from '../components/StrategySection';
import Footer from '../components/Footer';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
}

const MyJuristApp = () => {
  const navigation: NavigationItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'market', label: 'Market' },
    { id: 'advantage', label: 'Advantage' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'contact', label: 'Contact', href: '/contact' }
  ];

  const sectionIds = navigation.filter(item => !item.href).map(item => item.id);
  const activeSection = useScrollSpy(sectionIds);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Header 
        navigation={navigation} 
        activeSection={activeSection} 
        scrollToSection={scrollToSection} 
      />
      
      <HeroSection />
      <Introduction />
      <ProblemSection />
      <SolutionSection />
      <MarketSection />
      <AdvantageSection />
      <PricingSection />
      <StrategySection />
      <Footer />
    </div>
  );
};

export default MyJuristApp; 