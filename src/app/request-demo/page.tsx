"use client";

import React from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ContactFormSection from "@/components/ContactFormSection";
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

const GradientSearchIcon: React.FC<{ className?: string }> = ({ className = "" }) => {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `rd-search-grad-${id}`;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <circle cx="11" cy="11" r="7" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
      <path d="m20 20-4-4" stroke={`url(#${gradientId})`} strokeWidth="2" strokeLinecap="round" />
      <rect x="6" y="6" width="6" height="8" rx="1" fill={`url(#${gradientId})`} opacity="0.3" />
      <line x1="7.5" y1="9" x2="10.5" y2="9" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <line x1="7.5" y1="11" x2="10.5" y2="11" stroke={`url(#${gradientId})`} strokeWidth="1" />
    </svg>
  );
};

const GradientShieldIcon: React.FC<{ className?: string }> = ({ className = "" }) => {
  const id = React.useId().replace(/:/g, "");
  const gradientId = `rd-shield-grad-${id}`;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" fill={`url(#${gradientId})`} opacity="0.2" />
      <path d="M12 2L4 5v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V5l-8-3z" stroke={`url(#${gradientId})`} strokeWidth="2" fill="none" />
      <rect x="8" y="8" width="8" height="10" rx="1" fill={`url(#${gradientId})`} opacity="0.4" />
      <line x1="9.5" y1="11" x2="14.5" y2="11" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <line x1="9.5" y1="13" x2="14.5" y2="13" stroke={`url(#${gradientId})`} strokeWidth="1" />
      <line x1="9.5" y1="15" x2="12.5" y2="15" stroke={`url(#${gradientId})`} strokeWidth="1" />
    </svg>
  );
};

const RequestDemoPage: React.FC = () => {
  return (
    <div
      className="min-h-screen flex flex-col lg:flex-row font-[var(--Label-Label-1-fontFamily,Inter)]"
      style={{ color: "var(--text-primary, #0f172a)" }}
    >
      {/* Header - Back to Home aligned with left panel content (same padding + max-w-md mx-auto) */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 sm:px-6 lg:px-0 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <div className="w-full flex items-center justify-between lg:grid lg:grid-cols-2 lg:min-h-16">
          <div className="hidden lg:block px-8 md:px-12">
            <div className="max-w-md mx-auto">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-[#0f172a] hover:text-[#020617] hover:underline underline-offset-2 transition-colors font-medium"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
          <div className="lg:hidden flex items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#0f172a] hover:text-[#020617] hover:underline underline-offset-2 transition-colors font-medium"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Home</span>
            </Link>
          </div>
          <div className="flex items-center justify-end lg:pr-12">
            <span
              className="text-lg font-semibold hidden sm:block"
              style={{ color: "var(--text-primary, #0f172a)" }}
            >
              Request a Demo
            </span>
          </div>
        </div>
      </div>

      {/* Left Side - Info panel (landing dark panel) */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center pt-24 pb-12 px-8 md:px-12 min-h-screen relative overflow-hidden"
        style={{ background: "var(--bg-black-solid, #0f172a)" }}
      >
        {/* Login-page style gavel image at left-bottom */}
        <div className="absolute bottom-0 left-0 opacity-30 z-0 mix-blend-luminosity">
          <Image
            src="/gavel.png"
            alt="Gavel"
            width={408}
            height={310}
            className="w-[408px] h-[310px] object-contain"
            priority
          />
        </div>

        <div className="max-w-md mx-auto space-y-8 relative z-10">
          <div>
            <div className="mb-8">
              <MyJuristLogoWithWordmark variant="dark" size={41} href="/" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight bg-gradient-to-r from-[#2563EB] to-[#C026D3] bg-clip-text text-transparent"
            >
              Book a demo to see My Jurist in action
            </h1>
            <p
              className="text-xl opacity-90 leading-relaxed"
              style={{ color: "var(--text-on-dark-color, #fff)" }}
            >
              Schedule a demo to see how My Jurist can transform your legal due
              diligence process with AI-powered document analysis and contract
              drafting.
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <GradientSearchIcon className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                >
                  AI-powered document analysis
                </h3>
                <p
                  className="opacity-90"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                >
                  Advanced AI technology for comprehensive legal document review
                  and analysis.
                </p>
              </div>
            </div>

            <div className="ml-6 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <Sparkles
                  className="w-6 h-6"
                  style={{
                    color: "#7C3AED",
                    filter: "drop-shadow(0 0 0.5px #2563EB)",
                  }}
                />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                >
                  Automated contract drafting
                </h3>
                <p
                  className="opacity-90"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                >
                  Streamline your contract creation process with intelligent
                  automation.
                </p>
              </div>
            </div>

            <div className="ml-12 flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                <GradientShieldIcon className="w-6 h-6" />
              </div>
              <div>
                <h3
                  className="text-lg font-semibold mb-2"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                >
                  Legal research automation
                </h3>
                <p
                  className="opacity-90"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                >
                  Accelerate your legal research with AI-powered intelligence and
                  insights.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side - Demo request form (landing gradient + card) */}
      <div
        className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen pt-24"
        style={{
          background:
            "linear-gradient(90deg, #eff6ff 0%, #f5f3ff 50%, #fce7f3 100%)",
        }}
      >
        <div className="w-full max-w-lg">
          {/* Mobile: logo and back link */}
          <div className="lg:hidden text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <MyJuristLogoWithWordmark variant="light" size={32} href="/" className="justify-center" />
            </div>
            <p
              className="text-sm"
              style={{ color: "var(--text-secondary, #475569)" }}
            >
              Next Generation AI-Powered Legal Intelligence
            </p>
          </div>

          <ContactFormSection
            title="Request a Demo"
            subtitle="Ready to see My Jurist in action? Fill out the form below and our team will schedule a personalized demo for you."
            buttonText="Request a Demo"
            inlineMode={true}
            useLandingStyle={true}
            disableButtonAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default RequestDemoPage;
