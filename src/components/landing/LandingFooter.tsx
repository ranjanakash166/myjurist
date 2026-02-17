"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import MyJuristLogoWithWordmark from "./MyJuristLogoWithWordmark";

const solutionsLinks = [
  { label: "Legal Search", href: "#" },
  { label: "Document Analysis", href: "#" },
  { label: "Smart Drafting", href: "#" },
  { label: "Compliance", href: "#" },
];

const companyLinks = [
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];

const followLinks = [
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "Facebook", href: "#", icon: "f" },
  { label: "Instagram", href: "#", icon: "camera" },
  { label: "Twitter", href: "#", icon: "x" },
];

const complianceBadges = [
  { src: "/images/footer/iso27001.png", alt: "ISO 27001 standards", label: "ISO 27001 standards" },
];

const LandingFooter: React.FC = () => {
  return (
    <footer
      className="w-full overflow-hidden"
      style={{ background: "var(--bg-black-solid, #0F172A)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 md:py-16 lg:px-8">
        <div className="flex flex-col gap-8 sm:gap-10 lg:flex-row lg:justify-between lg:gap-16">
          {/* Left: logo, tagline, compliance badges */}
          <div className="max-w-md space-y-4 sm:space-y-6 min-w-0">
            <MyJuristLogoWithWordmark variant="dark" size={41} href="/" />
            <p
              className="max-w-sm font-normal leading-[137.5%]"
              style={{
                color: "var(--text-on-dark-color, #FFF)",
                fontFamily: "var(--Label-Label-1-fontFamily, Inter)",
                fontSize: "var(--Label-Label-1-fontSize, 16px)",
                fontWeight: "var(--Weights-Regular, 400)",
                lineHeight: "var(--Label-Label-1-lineHeight, 22px)",
                letterSpacing: "var(--Label-Label-1-letterSpacing, -0.18px)",
              }}
            >
              AI-powered legal intelligence platform built specifically for
              Indian litigation. Research smarter, draft faster, win more.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              {complianceBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative h-20 w-20">
                    <Image
                      src={badge.src}
                      alt={badge.alt}
                      width={80}
                      height={80}
                      className="object-contain brightness-0 invert"
                      style={{ aspectRatio: "1 / 1" }}
                    />
                  </div>
                  <span
                    className="text-sm font-normal text-white"
                    style={{
                      fontFamily: "var(--Label-Label-1-fontFamily, Inter)",
                    }}
                  >
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Solutions, Company, Follow columns */}
          <div className="flex flex-wrap gap-10 sm:gap-12 md:gap-16">
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
                Solutions
              </h3>
              <ul className="space-y-3">
                {solutionsLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white transition hover:text-slate-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
                Company
              </h3>
              <ul className="space-y-3">
                {companyLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-white transition hover:text-slate-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wide text-slate-400">
                Follow
              </h3>
              <ul className="space-y-3">
                {followLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-white transition hover:text-slate-300"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm font-medium text-white">
                        {link.icon === "in" && "in"}
                        {link.icon === "f" && "f"}
                        {link.icon === "camera" && (
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7"
                            />
                          </svg>
                        )}
                        {link.icon === "x" && (
                          <svg
                            className="h-4 w-4"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        )}
                      </span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t border-white/10 pt-8 text-center">
          <p
            className="text-sm text-white"
            style={{
              fontFamily: "var(--Label-Label-1-fontFamily, Inter)",
            }}
          >
            © 2026 MyJurist Technologies Pvt. Ltd. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
