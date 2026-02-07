"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import CtaArrowIcon from "./CtaArrowIcon";

const metrics = [
  { value: "50M+", label: "Case laws indexed" },
  { value: "8hrs → 15min", label: "Average research time" },
  { value: "25+", label: "Courts covered" },
];

const avatarSrcs = [
  "/images/gaurav.jpeg",
  "/images/shashank.jpeg",
  "/images/akash-ranjan.jpeg",
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
          className="inline-flex items-center justify-center gap-2 sm:gap-4 rounded-full border px-2 py-2 pr-3 sm:pr-4 flex-wrap sm:flex-nowrap max-w-full"
          style={{
            padding: "8px 12px 8px 8px",
            gap: 12,
            borderRadius: 100,
            border: "1px solid var(--blue-400, #60A5FA)",
            background: "var(--blue-50, #EFF6FF)",
          }}
        >
          <div className="flex items-center shrink-0">
            {avatarSrcs.map((src, i) => (
              <div
                key={i}
                className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-[var(--blue-50)] shrink-0"
                style={{ marginLeft: i === 0 ? 0 : -8 }}
              >
                <Image
                  src={src}
                  alt=""
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
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
          Win More Cases with{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              background: "linear-gradient(90deg, var(--blue-600, #2563EB) 0%, var(--fuchsia-600, #C026D3) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            AI-Powered Legal Research
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
          Your AI senior counsel. Research precedents, analyze documents, and
          draft pleadings in minutes—not hours. Built specifically for Indian
          litigation.
        </p>

        {/* 3. CTA button */}
        <Button
          asChild
          className="landing-cta-text font-medium transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl active:scale-100"
          style={{
            display: "flex",
            padding: "18px 28px",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            borderRadius: "100px",
            background: "var(--bg-black-solid, #0F172A)",
          }}
        >
          <Link href="/request-demo" className="inline-flex items-center justify-center text-base">
            Request a Demo
            <CtaArrowIcon size={28} className="shrink-0" />
          </Link>
        </Button>

        {/* 4. Key metrics */}
        <div
          className="w-full flex flex-wrap items-center justify-center gap-6 sm:gap-8 md:gap-12 lg:gap-16 xl:gap-24 pt-6 sm:pt-8 pb-4 sm:pb-6"
          style={{ alignSelf: "stretch" }}
        >
          {metrics.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-0.5 sm:gap-1">
              <span
                className="text-center text-2xl sm:text-3xl md:text-4xl"
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
                className="text-center text-xs sm:text-sm md:text-base"
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
