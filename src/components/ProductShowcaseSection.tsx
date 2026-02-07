"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, Shield, FileEdit, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const ProductShowcaseSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const products = [
    {
      icon: Search,
      title: 'Legal Research',
      description: 'AI-powered case law and precedent search. Leverage powerful search tools to find relevant legal documents and insights.',
      href: '/app/legal-research',
      gradient: 'from-blue-500 to-indigo-600',
      cardGradient: 'from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20'
    },
    {
      icon: FileText,
      title: 'Document Analysis',
      description: 'Upload and analyze legal documents with AI. Search, analyze, and understand legal documents with intelligent AI assistance.',
      href: '/app/document-analysis',
      gradient: 'from-purple-500 to-pink-600',
      cardGradient: 'from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20'
    },
    {
      icon: Shield,
      title: 'Regulatory Compliance',
      description: 'Automated compliance checking and guidance. Stay compliant with AI-powered regulatory analysis and monitoring.',
      href: '/app/regulatory-compliance',
      gradient: 'from-emerald-500 to-teal-600',
      cardGradient: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20'
    },
    {
      icon: FileEdit,
      title: 'Smart Document Drafting',
      description: 'AI-powered document creation and generation. Create professional legal documents with intelligent assistance.',
      href: '/app/smart-document-studio',
      gradient: 'from-orange-500 to-amber-600',
      cardGradient: 'from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20'
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start auto-rotation if not paused
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
      }, 4000); // Change slide every 4 seconds
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused, products.length]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  return (
    <section className="pt-6 sm:pt-8 pb-12 sm:pb-20 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-2 sm:mb-4">
            Augment All of Your Work on
          </h2>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-foreground">
            One Integrated, Secure Platform
          </h2>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Carousel Wrapper */}
          <div className="relative overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {products.map((product, index) => {
                const Icon = product.icon;
                return (
                  <div key={index} className="min-w-full px-2 md:px-4">
                    <Card className={`border-0 bg-gradient-to-br ${product.cardGradient} hover:shadow-2xl transition-all duration-500 h-full`}>
                      <CardContent className="p-8 md:p-12">
                        <div className="max-w-3xl mx-auto text-center">
                          {/* Small Icon Badge */}
                          <div className="inline-flex items-center justify-center mb-6">
                            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-md`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          
                          {/* Title */}
                          <CardTitle className="text-3xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 md:mb-8">
                            {product.title}
                          </CardTitle>
                          
                          {/* Description */}
                          <p className="text-lg md:text-xl text-muted-foreground mb-10 md:mb-12 leading-relaxed max-w-2xl mx-auto">
                            {product.description}
                          </p>
                          
                          {/* CTA Button */}
                          <Link href={product.href}>
                            <Button 
                              size="lg"
                              className="landing-cta-text bg-foreground text-background hover:bg-foreground/90 font-semibold p-4 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                              Explore {product.title}
                              <ArrowRight className="ml-2 h-5 w-5 md:h-6 md:w-6" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:border-foreground/50 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Previous product"
          >
            <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full bg-background/90 backdrop-blur-sm border-2 border-border hover:border-foreground/50 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            aria-label="Next product"
          >
            <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-foreground" />
          </button>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? 'w-10 h-2 bg-foreground'
                    : 'w-2 h-2 bg-muted-foreground/30 hover:bg-muted-foreground/60'
                }`}
                aria-label={`Go to ${products[index].title}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
