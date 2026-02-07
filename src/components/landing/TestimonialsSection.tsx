"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const CARDS_PER_VIEW = 3;
const CARD_GAP = 24;

const testimonials = [
  {
    quote:
      "MyJurist cut my research time from 8 hours to 20 minutes. I found a 2018 Bombay HC judgment that completely turned my client's case. This is a game-changer.",
    name: "Adv. Rahul Mehta",
    title: "Senior Advocate, Mumbai HC",
    avatar: "/images/gaurav.jpeg",
    initials: "RM",
  },
  {
    quote:
      "The document analysis feature is incredible. I analyzed a 150-page joint venture agreement in 3 minutes and identified 7 critical risks my team had missed.",
    name: "Anjali Sharma",
    title: "Partner, Corporate Law Firm",
    avatar: "/images/shashank.jpeg",
    initials: "AS",
  },
  {
    quote:
      "As a solo practitioner, MyJurist gives me the research capabilities of a 10-lawyer firm. The ROI paid for itself in the first week.",
    name: "Adv. Priya Kulkarni",
    title: "Solo Practitioner, Delhi",
    avatar: "/images/akash-ranjan.jpeg",
    initials: "PK",
  },
  {
    quote:
      "We use MyJurist for due diligence on every M&A. The speed and accuracy have become a standard in our practice.",
    name: "Vikram Singh",
    title: "Partner, Mergers & Acquisitions",
    avatar: "/images/gaurav.jpeg",
    initials: "VS",
  },
  {
    quote:
      "From contract review to compliance checks, MyJurist has streamlined our entire workflow. Highly recommend.",
    name: "Dr. Meera Krishnan",
    title: "Legal Counsel, Healthcare",
    avatar: "/images/shashank.jpeg",
    initials: "MK",
  },
];

const TestimonialsSection: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalPages = Math.max(
    1,
    Math.ceil(testimonials.length / CARDS_PER_VIEW)
  );
  const canPrev = currentPage > 0;
  const canNext = currentPage < totalPages - 1;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused && totalPages > 1) {
      intervalRef.current = setInterval(
        () => setCurrentPage((p) => (p + 1) % totalPages),
        6000
      );
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused, totalPages]);

  const goToPage = (page: number) =>
    setCurrentPage(Math.max(0, Math.min(page, totalPages - 1)));

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 md:py-24 px-4 overflow-hidden relative z-0"
      style={{ background: "#F8FAFC" }}
    >
      <div className="max-w-6xl mx-auto w-full flex flex-col items-center">
        {/* 1. Testimonials badge - center-aligned */}
        <div className="flex justify-center w-full mb-6">
          <span
            className="inline-flex items-center justify-center rounded-full border px-5 py-2.5 font-semibold uppercase tracking-wider text-sm"
            style={{
              borderRadius: 100,
              border: "1px solid var(--blue-400, #60A5FA)",
              background: "var(--blue-50, #EFF6FF)",
              color: "var(--blue-600, #2563EB)",
              fontFamily: "var(--Label-Label-2-fontFamily, Inter)",
              fontSize: "var(--Label-Label-2-fontSize, 14px)",
              fontWeight: 600,
              lineHeight: "var(--Label-Label-2-lineHeight, 20px)",
              letterSpacing: "-0.16px",
            }}
          >
            Testimonials
          </span>
        </div>

        {/* 2. Header - exactly two lines, center-aligned; second line must not wrap */}
        <h2
          className="max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-14 px-2 w-full text-center"
          style={{
            color: "var(--text-primary, #0F172A)",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(2rem, 5vw, var(--Title-Title-1-fontSize, 72px))",
            fontStyle: "normal",
            fontWeight: "var(--Weights-Bold, 700)",
            lineHeight: "clamp(2.5rem, 5.5vw, var(--Title-Title-1-lineHeight, 88px))",
            letterSpacing: "var(--Title-Title-1-letterSpacing, -0.8px)",
          }}
        >
          <span className="block">Trusted by India&apos;s</span>
          <span className="block whitespace-nowrap">Leading Legal Professionals</span>
        </h2>

        {/* 3. Sliding carousel - 3 cards visible, same view */}
        <div
          className="relative w-full max-w-6xl"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden w-full">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                gap: CARD_GAP,
                transform: `translateX(-${currentPage * (300 / testimonials.length)}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={`${t.name}-${t.quote.slice(0, 20)}`}
                  className="flex-shrink-0 rounded-[24px] bg-white p-6 md:p-8 shadow-lg border border-slate-200/60 flex flex-col text-left"
                  style={{
                    width: `calc((100% - ${(CARDS_PER_VIEW - 1) * CARD_GAP}px) / ${CARDS_PER_VIEW})`,
                    minWidth: 280,
                    boxShadow:
                      "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="flex gap-0.5 mb-4 justify-start">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-[#FFC107] text-[#FFC107] shrink-0"
                        strokeWidth={0}
                        aria-hidden
                      />
                    ))}
                  </div>
                  <p
                    className="mb-6 leading-relaxed flex-1 text-left"
                    style={{
                      color: "var(--text-primary, #0F172A)",
                      fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                      fontSize: "var(--Heading-H6-fontSize, 20px)",
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-4 mt-auto justify-start">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[var(--blue-50)] border border-slate-200/80 shrink-0 flex items-center justify-center">
                      <Image
                        src={t.avatar}
                        alt=""
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent) {
                            const fallback = document.createElement("span");
                            fallback.className =
                              "text-sm font-semibold text-[var(--blue-600)]";
                            fallback.textContent = t.initials;
                            parent.appendChild(fallback);
                          }
                        }}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className="font-semibold truncate"
                        style={{
                          color: "var(--text-primary, #0F172A)",
                          fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                          fontSize: "var(--Heading-H6-fontSize, 20px)",
                          fontWeight: 600,
                        }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="text-sm truncate"
                        style={{
                          color: "var(--text-secondary, #475569)",
                          fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                          fontSize: 14,
                          fontWeight: 400,
                        }}
                      >
                        {t.title}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <>
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={!canPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:-translate-x-4 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors z-10 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Previous testimonials"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={!canNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:translate-x-4 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors z-10 disabled:opacity-40 disabled:pointer-events-none"
                aria-label="Next testimonials"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === currentPage ? 24 : 8,
                  backgroundColor:
                    i === currentPage
                      ? "var(--blue-600)"
                      : "var(--text-secondary)",
                  opacity: i === currentPage ? 1 : 0.4,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default TestimonialsSection;
