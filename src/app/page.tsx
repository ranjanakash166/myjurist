"use client";

import React from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingChallengeSection from "@/components/landing/LandingChallengeSection";
import OurSolutionSection from "@/components/landing/OurSolutionSection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import LandingCtaSection from "@/components/landing/LandingCtaSection";
import ProductPreviewSection from "@/components/landing/ProductPreviewSection";
import LandingFooter from "@/components/landing/LandingFooter";
import StructuredData from "@/components/StructuredData";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://myjurist.com";

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "My Jurist",
  url: siteUrl,
  logo: `${siteUrl}/images/myjurist-logo.png`,
  description:
    "AI-Powered Legal Intelligence Platform for Indian Litigation",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "My Jurist",
  url: siteUrl,
};

export default function HomePage() {
  return (
    <>
      <StructuredData data={organizationSchema} />
      <StructuredData data={websiteSchema} />
      <div className="landing-page min-h-screen overflow-x-hidden bg-background text-foreground">
        <LandingHeader />
        <main>
          <LandingHeroSection />
          <ProductPreviewSection />
          <LandingChallengeSection />
          <OurSolutionSection />
          <TestimonialsSection />
          <LandingCtaSection />
          <LandingFooter />
        </main>
      </div>
    </>
  );
}
