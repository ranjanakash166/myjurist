"use client";

import React from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHeroSection from "@/components/landing/LandingHeroSection";
import LandingChallengeSection from "@/components/landing/LandingChallengeSection";
import ProductPreviewSection from "@/components/landing/ProductPreviewSection";
import SocialProofSection from "@/components/SocialProofSection";
import ProductShowcaseSection from "@/components/ProductShowcaseSection";
import LegalDataSourcesSection from "@/components/LegalDataSourcesSection";
import UseCasesSection from "@/components/UseCasesSection";
import ValuePropositionsSection from "@/components/ValuePropositionsSection";
import Footer from "@/components/Footer";
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

export default function NewLandingPage() {
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
        </main>
      </div>
    </>
  );
}
