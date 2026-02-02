"use client";

import React from "react";
import {
  ArrowLeft,
  Scale,
  Sparkles,
  Users,
  Mail,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import CtaArrowIcon from "@/components/landing/CtaArrowIcon";

const AboutPage: React.FC = () => {
  return (
    <div
      className="min-h-screen font-[var(--Label-Label-1-fontFamily,Inter)]"
      style={{ color: "var(--text-primary, #0f172a)" }}
    >
      {/* Header - Back to Contact aligned with main content */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center h-16 px-4 sm:px-6 lg:px-8 transition-all duration-300"
        style={{
          background: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(15, 23, 42, 0.08)",
        }}
      >
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/contact"
            className="flex items-center gap-2 text-[#0f172a] hover:text-[#020617] hover:underline underline-offset-2 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Contact</span>
          </Link>
          <span
            className="text-lg font-semibold hidden sm:block"
            style={{ color: "var(--text-primary, #0f172a)" }}
          >
            About Us
          </span>
        </div>
      </div>

      {/* Main content - landing gradient background */}
      <div
        className="min-h-screen pt-24 pb-20"
        style={{
          background:
            "linear-gradient(90deg, #eff6ff 0%, #f5f3ff 50%, #fce7f3 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <div className="text-center max-w-4xl mx-auto mb-12 md:mb-16">
            <h1
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ color: "var(--text-primary, #0f172a)" }}
            >
              Founded By Industry Veterans
            </h1>
            <p
              className="text-lg leading-relaxed"
              style={{ color: "var(--text-secondary, #475569)" }}
            >
              Our team has built at the frontier of legal technology and AI.
              Shashank brings experience from leading law firms and business
              administration, Gaurav has engineered AI systems for highly
              regulated industries, and Akash has driven product strategy for
              legal AI solutions that transform how legal professionals work.
            </p>
          </div>

          {/* Founder Cards - white cards on gradient */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            {/* Shashank */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden"
                style={{ background: "var(--bg-black-solid, #0f172a)" }}
              >
                <Image
                  src="/images/shashank.jpeg"
                  alt="Shashank"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    (target.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                  }}
                />
                <Users
                  className="h-16 w-16 text-white hidden"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Shashank
              </h3>
              <p
                className="font-semibold mb-2"
                style={{ color: "var(--blue-600, #2563eb)" }}
              >
                Co-Founder & CEO
              </p>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "var(--text-secondary, #475569)" }}
              >
                Holds degrees in Law and Business Administration. Dedicated to
                developing innovative legal AI solutions.
              </p>
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--blue-600, #2563eb)" }}
              >
                Reach out for partnership and business inquiries.
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="mailto:support@myjurist.io"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="Email"
                >
                  <Mail
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
                <a
                  href="https://linkedin.com/company/myjurist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="LinkedIn"
                >
                  <Linkedin
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
                <a
                  href="https://twitter.com/myjurist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="Twitter"
                >
                  <Twitter
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
              </div>
            </div>

            {/* Gaurav */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden"
                style={{ background: "var(--bg-black-solid, #0f172a)" }}
              >
                <Image
                  src="/images/gaurav.jpeg"
                  alt="Gaurav Suman"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    (target.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                  }}
                />
                <Users
                  className="h-16 w-16 text-white hidden"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Gaurav Suman
              </h3>
              <p
                className="font-semibold mb-2"
                style={{ color: "var(--blue-600, #2563eb)" }}
              >
                Co-Founder & CTO
              </p>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "var(--text-secondary, #475569)" }}
              >
                Leads technology and product development. Expert in AI systems for
                regulated industries.
              </p>
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--blue-600, #2563eb)" }}
              >
                Reach out for technical inquiries and support.
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="mailto:support@myjurist.io"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="Email"
                >
                  <Mail
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
                <a
                  href="https://linkedin.com/company/myjurist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="LinkedIn"
                >
                  <Linkedin
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
                <a
                  href="https://twitter.com/myjurist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="Twitter"
                >
                  <Twitter
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
              </div>
            </div>

            {/* Akash */}
            <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl p-6 text-center">
              <div
                className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden"
                style={{ background: "var(--bg-black-solid, #0f172a)" }}
              >
                <Image
                  src="/images/akash-ranjan.jpeg"
                  alt="Akash Ranjan"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    (target.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                  }}
                />
                <Users
                  className="h-16 w-16 text-white hidden"
                  style={{ color: "var(--text-on-dark-color, #fff)" }}
                />
              </div>
              <h3
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Akash Ranjan
              </h3>
              <p
                className="font-semibold mb-2"
                style={{ color: "var(--blue-600, #2563eb)" }}
              >
                Co-Founder & CPO
              </p>
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{ color: "var(--text-secondary, #475569)" }}
              >
                Drives product strategy and user experience design. Focuses on
                creating intuitive legal AI solutions.
              </p>
              <p
                className="text-sm font-semibold mb-4"
                style={{ color: "var(--blue-600, #2563eb)" }}
              >
                Reach out for product feedback and feature requests.
              </p>
              <div className="flex justify-center gap-3">
                <a
                  href="mailto:support@myjurist.io"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="Email"
                >
                  <Mail
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
                <a
                  href="https://linkedin.com/company/myjurist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="LinkedIn"
                >
                  <Linkedin
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
                <a
                  href="https://twitter.com/myjurist"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg transition-colors hover:opacity-80"
                  style={{ backgroundColor: "var(--blue-50, #eff6ff)" }}
                  aria-label="Twitter"
                >
                  <Twitter
                    className="h-4 w-4"
                    style={{ color: "var(--blue-600, #2563eb)" }}
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Company Values */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "var(--bg-black-solid, #0f172a)",
                  color: "var(--text-on-dark-color, #fff)",
                }}
              >
                <Scale className="h-8 w-8" />
              </div>
              <h4
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Expertise
              </h4>
              <p style={{ color: "var(--text-secondary, #475569)" }}>
                Deep knowledge in law and AI technology
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "var(--bg-black-solid, #0f172a)",
                  color: "var(--text-on-dark-color, #fff)",
                }}
              >
                <Sparkles className="h-8 w-8" />
              </div>
              <h4
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Innovation
              </h4>
              <p style={{ color: "var(--text-secondary, #475569)" }}>
                Pioneering AI solutions for legal industry
              </p>
            </div>

            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{
                  background: "var(--bg-black-solid, #0f172a)",
                  color: "var(--text-on-dark-color, #fff)",
                }}
              >
                <Users className="h-8 w-8" />
              </div>
              <h4
                className="text-xl font-bold mb-2"
                style={{ color: "var(--text-primary, #0f172a)" }}
              >
                Vision
              </h4>
              <p style={{ color: "var(--text-secondary, #475569)" }}>
                Transforming legal due diligence globally
              </p>
            </div>
          </div>

          {/* CTA - Contact Us */}
          <div className="text-center mt-16">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-3 rounded-full font-medium text-white px-10 py-5 transition-all duration-200 ease-out hover:scale-105 hover:shadow-xl hover:brightness-110 active:scale-100"
              style={{
                padding: "20px 44px",
                borderRadius: 100,
                background: "var(--bg-black-solid, #0f172a)",
                color: "var(--text-on-dark-color, #fff)",
                fontSize: "22px",
                lineHeight: "28px",
              }}
            >
              Get In Touch
              <CtaArrowIcon size={36} className="shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
