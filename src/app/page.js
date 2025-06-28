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
import TeamSection from '../components/TeamSection';
import Footer from '../components/Footer';

const MyJuristApp = () => {
  const navigation = [
    { id: 'home', label: 'Home' },
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'market', label: 'Market' },
    { id: 'advantage', label: 'Advantage' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'strategy', label: 'Strategy' },
    { id: 'team', label: 'Team' }
  ];

  const sectionIds = navigation.map(item => item.id);
  const activeSection = useScrollSpy(sectionIds);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
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
      <TeamSection />
      <Footer />
    </div>
  );
};

export default MyJuristApp; 