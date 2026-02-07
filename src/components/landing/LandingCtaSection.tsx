"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CtaArrowIcon from "./CtaArrowIcon";

const LandingCtaSection: React.FC = () => {
  return (
    <section
      id="cta"
      className="w-full flex flex-col items-center justify-center px-4 py-12 sm:py-16 md:py-20 min-h-[380px] sm:min-h-[420px] md:min-h-[460px] overflow-hidden"
      style={{
        alignSelf: "stretch",
        background: "var(--blue-100, #DBEAFE)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-4 sm:gap-6 w-full">
        {/* Header */}
        <h2
          className="max-w-4xl mx-auto w-full px-2"
          style={{
            color: "var(--text-primary, #0F172A)",
            textAlign: "center",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(1.5rem, 5vw, 72px)",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "clamp(2.5rem, 5.5vw, 88px)",
            letterSpacing: "-0.8px",
          }}
        >
          Ready to Transform Your Legal Practice?
        </h2>

        {/* Sub-header */}
        <p
          className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg lg:text-xl px-2"
          style={{
            color: "var(--text-secondary, #475569)",
            textAlign: "center",
            fontFamily: "var(--Heading-H5-fontFamily, Inter)",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "1.4",
            letterSpacing: "-0.15px",
          }}
        >
          Join 50+ advocates who are winning more cases with AI-powered legal
          intelligence. Start your AI legal research today—We are just a click
          away.
        </p>

        {/* Request a Demo button */}
        <Button
          asChild
          className="landing-cta-text inline-flex items-center justify-center gap-3 rounded-full font-medium transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-100"
          style={{
            padding: "16px",
            borderRadius: 100,
            background: "var(--bg-black-solid, #0F172A)",
          }}
        >
          <Link href="/request-demo" className="inline-flex items-center gap-3">
            Request a Demo
            <CtaArrowIcon size={36} className="shrink-0" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default LandingCtaSection;
