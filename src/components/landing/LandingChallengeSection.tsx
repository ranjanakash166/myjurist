"use client";

import React from "react";

const blue600 = "var(--blue-600, #2563EB)";

const IconClock: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M24 12V24H36"
      stroke={blue600}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M24 44C35.0456 44 44 35.0456 44 24C44 12.9543 35.0456 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0456 12.9543 44 24 44Z"
      stroke={blue600}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconPaperPlane: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={54}
    viewBox="0 0 16 18"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.6638 8.23032C14.6514 8.83772 14.5906 10.3163 13.5734 10.4317L8.44015 11.0135L6.13775 15.6381C5.68155 16.5545 4.27135 16.1059 4.03815 14.9701L1.52755 2.73812C1.33055 1.77812 2.19336 1.17392 3.02796 1.68752L13.6638 8.23032Z"
      stroke={blue600}
      strokeWidth={3}
    />
  </svg>
);

const IconWarning: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={48}
    height={48}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
    aria-hidden
  >
    <path
      d="M40.0858 41.9999H7.91414C4.83808 41.9999 2.9132 38.6727 4.44652 36.0061L20.5324 8.03054C22.0704 5.35572 25.9296 5.3557 27.4676 8.03052L43.5536 36.0061C45.0868 38.6727 43.162 41.9999 40.0858 41.9999Z"
      stroke={blue600}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <path
      d="M24 18V26"
      stroke={blue600}
      strokeWidth={3}
      strokeLinecap="round"
    />
    <path
      d="M24 34.02L24.02 33.9978"
      stroke={blue600}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const cards = [
  {
    icon: IconClock,
    header: "Hours Lost to Research",
    description:
      "Sifting through dozens of legal files to find key facts and inconsistencies can take an entire day—time better spent advising clients and building strategy.",
  },
  {
    icon: IconPaperPlane,
    header: "Scattered Information",
    description:
      "Asking questions across disconnected tools leads to fragmented answers and missed connections.",
  },
  {
    icon: IconWarning,
    header: "Missing Critical Precedents",
    description:
      "Manual case law research takes hours, slows down your billable workflow, and risks missing key precedents.",
  },
];

const LandingChallengeSection: React.FC = () => {
  return (
    <section
      id="problems"
      className="py-12 sm:py-16 md:py-24 px-4 overflow-hidden"
      style={{ background: "var(--blue-50, #EFF6FF)" }}
    >
      <div className="max-w-6xl mx-auto flex flex-col items-center w-full">
        {/* 1. Problems pill */}
        <div
          className="inline-flex items-center gap-4 rounded-full border px-2 py-2 pr-4 mb-8"
          style={{
            padding: "8px 16px 8px 8px",
            gap: 16,
            borderRadius: 100,
            border: "1px solid var(--blue-400, #60A5FA)",
            background: "var(--blue-50, #EFF6FF)",
          }}
        >
          <span
            className="font-semibold uppercase tracking-wider text-sm"
            style={{ color: "var(--blue-600, #2563EB)" }}
          >
            Problems
          </span>
        </div>

        {/* 2. Main heading */}
        <h2
          className="text-center max-w-4xl mx-auto mb-6"
          style={{
            color: "var(--text-primary, #0F172A)",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(2rem, 5vw, 72px)",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "clamp(2.5rem, 5.5vw, 88px)",
            letterSpacing: "-0.8px",
          }}
        >
          Legal Research Shouldn&apos;t Take All Day
        </h2>

        {/* 3. Subheading */}
        <p
          className="text-center max-w-3xl mx-auto mb-14"
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
          Traditional research methods are slowing you down when clients need
          answers now
        </p>

        {/* 4. Three cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 w-full min-w-0">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.header}
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 bg-white border border-slate-200/60 shadow-sm min-w-0"
              >
                <div className="mb-4 sm:mb-5 flex items-center justify-start">
                  <Icon />
                </div>
                <h3
                  className="font-bold mb-2 sm:mb-3 text-lg sm:text-xl md:text-2xl"
                  style={{
                    color: "var(--text-primary, #0F172A)",
                    fontFamily: "var(--Heading-H5-fontFamily, Inter)",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "1.3",
                    letterSpacing: "-0.15px",
                  }}
                >
                  {card.header}
                </h3>
                <p
                  className="leading-relaxed text-sm sm:text-base md:text-lg"
                  style={{
                    color: "var(--text-secondary, #475569)",
                    fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                    fontStyle: "normal",
                    fontWeight: 500,
                    lineHeight: "1.4",
                    letterSpacing: 0,
                  }}
                >
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LandingChallengeSection;
