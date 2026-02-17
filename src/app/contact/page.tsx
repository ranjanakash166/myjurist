"use client";

import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import ContactFormSection from "@/components/ContactFormSection";

const ContactPage: React.FC = () => {
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
              Contact Us
            </span>
          </div>
        </div>
      </div>

      {/* Left Side - About Us (landing dark panel) */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-center pt-24 pb-12 px-8 md:px-12 min-h-screen"
        style={{ background: "var(--bg-black-solid, #0f172a)" }}
      >
        <div className="max-w-md mx-auto space-y-6">
          <h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight bg-gradient-to-r from-[#2563EB] to-[#C026D3] bg-clip-text text-transparent"
          >
            Legal Due Diligence Needs A New AI Partner
          </h1>
          <div
            className="space-y-4 md:space-y-6 text-base md:text-lg leading-relaxed opacity-90"
            style={{ color: "var(--text-on-dark-color, #fff)" }}
          >
            <p>
              My Jurist was built for legal professionals who are tired of AI
              vendors overpromising and underdelivering. Too many solutions
              sound impressive in theory but fail to handle the real-world
              complexity of legal document analysis and contract drafting.
            </p>
            <p>
              At My Jurist, we combine deep legal expertise with purpose-built
              AI agents that seamlessly fit your workflows. Our technology goes
              beyond simple document summarization - it automates complex legal
              research, ensures full auditability, and delivers real
              operational impact. No black boxes. No shortcuts.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 font-semibold transition-colors group text-white hover:opacity-90"
            >
              Learn more about our team
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Right Side - Get In Touch Form (landing gradient + card) */}
      <div
        className="flex-1 lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-screen pt-24"
        style={{
          background:
            "linear-gradient(90deg, #eff6ff 0%, #f5f3ff 50%, #fce7f3 100%)",
        }}
      >
        <div className="w-full max-w-lg">
          <ContactFormSection
            title="Get In Touch"
            subtitle="Ready to transform your legal due diligence process? Let's discuss how My Jurist can help."
            inlineMode={true}
            useLandingStyle={true}
            disableButtonAnimation={true}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
