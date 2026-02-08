"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CARDS_PER_VIEW = 3;
const CARD_GAP = 24;

const testimonials = [
  {
    quote:
      "MyJurist changed how we handle legal work day to day. Instead of juggling documents, notes, and research tools, everything now happens in one place. The clarity it brings to complex matters is a real advantage.",
    name: "Adv Mahesh Tewari",
    title: "",
  },
  {
    quote:
      "The universal chat is a game-changer. I can ask questions across multiple documents and keep refining my thoughts without losing context. What used to take hours of cross-checking now takes minutes.",
    name: "Adv Devesh Singh",
    title: "",
  },
  {
    quote:
      "From research to drafting to document analysis, MyJurist feels like a single, coherent system for legal work. It's not just faster, it's more structured, which makes a huge difference when deadlines are tight.",
    name: "Adv Ritesh Mahto",
    title: "",
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
                  <div className="min-w-0 mt-auto">
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
                    {t.title ? (
                      <p
                        className="text-sm truncate mt-0.5"
                        style={{
                          color: "var(--text-secondary, #475569)",
                          fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                          fontSize: 14,
                          fontWeight: 400,
                        }}
                      >
                        {t.title}
                      </p>
                    ) : null}
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
