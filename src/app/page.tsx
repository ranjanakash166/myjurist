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
import StructuredData from '../components/StructuredData';

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://myjurist.com';

  // Structured Data for SEO (JSON-LD)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'My Jurist',
    url: siteUrl,
    logo: `${siteUrl}/images/myjurist-logo.png`,
    description: 'AI-Powered Legal Intelligence Platform for Indian Litigation',
    sameAs: [
      // Add social media links when available
      // 'https://twitter.com/myjurist',
      // 'https://linkedin.com/company/myjurist',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      // Add contact email when available
    },
  };

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'My Jurist',
    applicationCategory: 'Legal Software',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description: 'AI-powered legal research, document analysis, regulatory compliance, and smart document drafting platform for Indian litigation.',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'My Jurist',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/app/legal-research?query={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <StructuredData data={organizationSchema} />
      <StructuredData data={softwareApplicationSchema} />
      <StructuredData data={websiteSchema} />
      
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
    </>
  );
};

export default MyJuristApp;
