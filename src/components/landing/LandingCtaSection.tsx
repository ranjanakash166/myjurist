"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CtaArrowIcon from "./CtaArrowIcon";

const LandingCtaSection: React.FC = () => {
  return (
    <section
      id="cta"
      className="w-full flex flex-col items-center justify-center px-6 py-14 sm:py-16 md:py-20 min-h-[380px] sm:min-h-[420px] md:min-h-[460px] overflow-x-hidden"
      style={{
        alignSelf: "stretch",
        background: "var(--blue-100, #DBEAFE)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6 sm:gap-6 md:gap-8 w-full">
        {/* Header – two lines on mobile to match design: "Ready to Transform" / "Your Legal Practice?" */}
        <h2
          className="max-w-4xl mx-auto w-full px-2 text-center min-w-0 overflow-visible"
          style={{
            color: "var(--text-primary, #0F172A)",
            textAlign: "center",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(1.5rem, 5vw, 48px)",
            fontStyle: "normal",
            fontWeight: "var(--Weights-Bold, 700)",
            lineHeight: "1.2",
            letterSpacing: "var(--Title-Title-1-letterSpacing, -0.8px)",
          }}
        >
          Ready to Transform
          <br className="sm:hidden" />
          <span className="hidden sm:inline"> </span>
          Your Legal Practice?
        </h2>

        {/* Sub-header – centered, medium grey */}
        <p
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl px-2 leading-relaxed"
          style={{
            color: "var(--text-secondary, #475569)",
            textAlign: "center",
            fontFamily: "var(--Heading-H5-fontFamily, Inter)",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "1.5",
            letterSpacing: "-0.15px",
          }}
        >
          Join 50+ advocates who are winning more cases with AI-powered legal
          intelligence. Start your AI legal research today—We are just a click
          away.
        </p>

        {/* Request a Demo – pill button, dark background, white text, arrow in circle */}
        <Button
          asChild
          className="landing-cta-button landing-cta-text font-medium transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-100 mt-1"
        >
          <Link href="/request-demo" className="inline-flex items-center justify-center gap-2">
            Request a Demo
            <CtaArrowIcon size={28} className="shrink-0" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LandingCtaSection;
