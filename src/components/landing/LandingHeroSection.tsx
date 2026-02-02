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
      className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 px-4 overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #eff6ff 0%, #f5f3ff 50%, #fce7f3 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-10 w-full max-w-[974px] mx-auto">
        {/* 1. Trust badge */}
        <div
          className="inline-flex items-center gap-4 rounded-full border px-2 py-2 pr-4"
          style={{
            padding: "8px 16px 8px 8px",
            gap: 16,
            borderRadius: 100,
            border: "1px solid var(--blue-400, #60A5FA)",
            background: "var(--blue-50, #EFF6FF)",
          }}
        >
          <div className="flex items-center">
            {avatarSrcs.map((src, i) => (
              <div
                key={i}
                className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-200 border-2 border-[var(--blue-50)] shrink-0"
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
            className="font-medium text-[var(--text-primary)]"
            style={{
              fontFamily: "var(--Heading-H6-fontFamily, Inter)",
              fontSize: "var(--Heading-H6-fontSize, 20px)",
              fontWeight: 500,
              lineHeight: "24px",
              letterSpacing: 0,
            }}
          >
            Trusted by 50+ Legal Professionals
          </span>
        </div>

        {/* 2. Headline */}
        <h1
          className="text-center max-w-[974px]"
          style={{
            color: "var(--text-primary, #0F172A)",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(2.5rem, 5vw, 72px)",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "clamp(3rem, 6vw, 88px)",
            letterSpacing: "-0.8px",
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
          className="text-center max-w-[864px]"
          style={{
            color: "var(--text-secondary, #475569)",
            fontFamily: "var(--Heading-H5-fontFamily, Inter)",
            fontSize: "var(--Heading-H5-fontSize, 24px)",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "var(--Heading-H5-lineHeight, 30px)",
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
          className="rounded-full font-medium gap-3 text-white px-10 py-5 transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl active:scale-100"
          style={{
            padding: "20px 44px",
            borderRadius: 100,
            background: "var(--bg-black-solid, #0F172A)",
            color: "var(--text-white, #FFF)",
            fontFamily: "var(--Heading-H6-fontFamily, Inter)",
            fontSize: "22px",
            fontWeight: 500,
            lineHeight: "28px",
            letterSpacing: 0,
          }}
        >
          <Link href="/request-demo" className="inline-flex items-center gap-3">
            Request a Demo
            <CtaArrowIcon size={36} className="shrink-0" />
          </Link>
        </Button>

        {/* 4. Key metrics */}
        <div
          className="w-full flex flex-wrap items-center justify-center gap-12 md:gap-16 lg:gap-24 pt-8 pb-6"
          style={{ alignSelf: "stretch" }}
        >
          {metrics.map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-1">
              <span
                className="text-center"
                style={{
                  color: "var(--text-primary, #0F172A)",
                  fontFamily: "var(--Heading-H3-fontFamily, Inter)",
                  fontSize: "var(--Heading-H3-fontSize, 40px)",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "var(--Heading-H3-lineHeight, 48px)",
                  letterSpacing: "-0.3px",
                }}
              >
                {item.value}
              </span>
              <span
                className="text-center"
                style={{
                  color: "var(--text-secondary, #475569)",
                  fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                  fontSize: "var(--Heading-H6-fontSize, 20px)",
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
