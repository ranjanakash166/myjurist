"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import CtaArrowIcon from "./CtaArrowIcon";

const metrics = [
  { value: "50M+", label: "Indian Judgments & Precedents Indexed" },
  { value: "8hrs → 15min", label: "Reduce Research Time from Hours to Minutes" },
  { value: "25+", label: "Coverage Across 25+ Indian Courts" },
];

const LandingHeroSection: React.FC = () => {
  return (
    <section
      id="home"
      className="relative min-h-[65vh] flex flex-col items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-10 md:pb-12 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #eff6ff 0%, #f5f3ff 50%, #fce7f3 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-6 sm:gap-8 md:gap-10 w-full max-w-[974px] mx-auto">
        {/* 1. Trust badge */}
        <div
          className="inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full border px-3 py-2 sm:px-4 sm:py-2 flex-wrap sm:flex-nowrap max-w-full"
          style={{
            borderRadius: 100,
            border: "1px solid var(--blue-400, #60A5FA)",
            background: "var(--blue-50, #EFF6FF)",
          }}
        >
          <span
            className="font-medium text-[var(--text-primary)] text-center sm:text-left text-sm sm:text-base md:text-lg"
            style={{
              fontFamily: "var(--Heading-H6-fontFamily, Inter)",
              fontWeight: 500,
              lineHeight: "24px",
              letterSpacing: 0,
            }}
          >
            Trusted by 50+ Legal Professionals
          </span>
        </div>

        {/* 2. Headline – Title/Title-1/Bold (responsive) */}
        <h1
          className="text-center max-w-[974px] w-full"
          style={{
            color: "var(--text-primary, #0F172A)",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(1.75rem, 5vw, 72px)",
            fontStyle: "normal",
            fontWeight: "var(--Weights-Bold, 700)",
            lineHeight: "clamp(2.25rem, 6vw, 88px)",
            letterSpacing: "var(--Title-Title-1-letterSpacing, -0.8px)",
          }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: "linear-gradient(90deg, var(--blue-600, #2563EB) 0%, var(--fuchsia-600, #C026D3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Built for Legal Thinking
          </span>
        </h1>

        {/* Sub-paragraph */}
        <p
          className="text-center max-w-[864px] w-full text-base sm:text-lg md:text-xl lg:text-2xl px-1"
          style={{
            color: "var(--text-secondary, #475569)",
            fontFamily: "var(--Heading-H5-fontFamily, Inter)",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "1.35",
            letterSpacing: "-0.15px",
          }}
        >
          A unified AI workspace that understands your documents, questions, and
          workflows—so legal work stays precise and connected.
        </p>

        {/* 3. CTA button */}
        <Button
          asChild
          className="landing-cta-button landing-cta-text font-medium transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl active:scale-100"
        >
          <Link href="/request-demo" className="inline-flex items-center justify-center gap-2">
            Request a Demo
            <CtaArrowIcon size={28} className="shrink-0" />
          </Link>
        </Button>

        {/* 4. Key metrics */}
        <div
          className="w-full flex flex-nowrap items-start justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-16 pt-6 sm:pt-8 pb-4 sm:pb-6"
          style={{ alignSelf: "stretch" }}
        >
          {metrics.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5 sm:gap-1 flex-1 min-w-0">
              <span
                className="text-center text-2xl sm:text-3xl md:text-4xl shrink-0"
                style={{
                  color: "var(--text-primary, #0F172A)",
                  fontFamily: "var(--Heading-H3-fontFamily, Inter)",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "1.2",
                  letterSpacing: "-0.3px",
                }}
              >
                {item.value}
              </span>
              <span
                className="text-center text-xs sm:text-sm md:text-base min-h-[2.5rem] sm:min-h-[3rem] flex items-start justify-center"
                style={{
                  color: "var(--text-secondary, #475569)",
                  fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                  fontWeight: 500,
                  lineHeight: "24px",
                  letterSpacing: 0,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingHeroSection;
