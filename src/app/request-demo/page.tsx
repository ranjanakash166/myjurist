"use client";

import React from "react";
import { ArrowLeft, Scale, Sparkles } from "lucide-react";
import Link from "next/link";
import ContactFormSection from "@/components/ContactFormSection";
import MyJuristLogoWithWordmark from "@/components/landing/MyJuristLogoWithWordmark";

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
        className="hidden lg:flex lg:w-1/2 flex-col justify-center pt-24 pb-12 px-8 md:px-12 min-h-screen"
        style={{ background: "var(--bg-black-solid, #0f172a)" }}
      >
        <div className="max-w-md mx-auto space-y-8">
          <div>
            <div className="mb-8">
              <MyJuristLogoWithWordmark variant="dark" size={41} href="/" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 leading-tight"
              style={{ color: "var(--text-on-dark-color, #fff)" }}
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

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Scale
                  className="w-6 h-6"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                />
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

            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Sparkles
                  className="w-6 h-6"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
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

            <div className="flex items-start gap-4">
              <div
                className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <Scale
                  className="w-6 h-6"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                />
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

          <div
            className="pt-8 border-t"
            style={{ borderColor: "rgba(255,255,255,0.2)" }}
          >
            <p
              className="text-sm opacity-90"
              style={{ color: "var(--text-on-dark-color, #fff)" }}
            >
              Join thousands of legal professionals who trust My Jurist for
              their AI-powered legal research needs.
            </p>
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
          />
        </div>
      </div>
    </div>
  );
};

export default RequestDemoPage;
