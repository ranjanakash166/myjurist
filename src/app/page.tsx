'use client';

import React, { useState } from 'react';
import { useScrollSpy } from '../hooks/useScrollSpy';
import Header from '../components/Header';
import HeroSection from '../components/HeroSection';
import SocialProofSection from '../components/SocialProofSection';
import ProductShowcaseSection from '../components/ProductShowcaseSection';
import LegalDataSourcesSection from '../components/LegalDataSourcesSection';
import UseCasesSection from '../components/UseCasesSection';
import ValuePropositionsSection from '../components/ValuePropositionsSection';
import Footer from '../components/Footer';

interface NavigationItem {
  id: string;
  label: string;
  href?: string;
}

const MyJuristApp = () => {
  const navigation: NavigationItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Platform' },
    { id: 'use-cases', label: 'Solutions' },
    { id: 'contact', label: 'Contact Us', href: '/contact' },
    { id: 'request-demo', label: 'Request Demo', href: '/request-demo' },
    { id: 'login', label: 'Login', href: '/login' }
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
      <SocialProofSection />
      <div id="products">
        <ProductShowcaseSection />
      </div>
      <LegalDataSourcesSection />
      <div id="use-cases">
        <UseCasesSection />
      </div>
      <ValuePropositionsSection />
      <Footer />
    </div>
  );
};

export default MyJuristApp;
