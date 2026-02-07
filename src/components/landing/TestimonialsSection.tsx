"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

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
];

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!isPaused) {
      intervalRef.current = setInterval(
        () =>
          setCurrentIndex((i) => (i + 1) % testimonials.length),
        5000
      );
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  const goTo = (index: number) =>
    setCurrentIndex((index + testimonials.length) % testimonials.length);
  const prev = () => goTo(currentIndex - 1);
  const next = () => goTo(currentIndex + 1);

  return (
    <section
      id="testimonials"
      className="py-12 sm:py-16 md:py-24 px-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, var(--blue-50, #EFF6FF) 0%, rgba(255,255,255,0.9) 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* 1. Testimonials pill */}
        <div className="flex justify-center mb-6">
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

        {/* 2. Header */}
        <h2
          className="text-center max-w-4xl mx-auto mb-8 sm:mb-10 md:mb-14 px-2"
          style={{
            color: "var(--text-primary, #0F172A)",
            fontFamily: "var(--Title-Title-1-fontFamily, Inter)",
            fontSize: "clamp(1.5rem, 5vw, 72px)",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "clamp(2.5rem, 5.5vw, 88px)",
            letterSpacing: "-0.8px",
          }}
        >
          Trusted by India&apos;s Leading Legal Professionals
        </h2>

        {/* 3. Slider of testimonial cards */}
        <div
          className="relative max-w-2xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="w-full flex-shrink-0 px-2 md:px-4"
                >
                  <div
                    className="w-full max-w-md mx-auto rounded-[24px] bg-white p-6 md:p-8 shadow-lg border border-slate-200/60"
                    style={{
                      boxShadow:
                        "0 4px 6px -1px rgba(0,0,0,0.08), 0 2px 4px -2px rgba(0,0,0,0.05)",
                    }}
                  >
                    <div className="flex gap-0.5 mb-4">
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
                      className="mb-6 leading-relaxed"
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
                    <div className="flex items-center gap-4">
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
                              const fallback =
                                document.createElement("span");
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
                </div>
              ))}
            </div>
          </div>

          {/* Prev / Next */}
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 md:left-4 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors z-10"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 md:right-4 w-10 h-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors z-10"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              className="h-2 rounded-full transition-all duration-300"
              style={{
                width: index === currentIndex ? 24 : 8,
                backgroundColor:
                  index === currentIndex
                    ? "var(--blue-600)"
                    : "var(--text-secondary)",
                opacity: index === currentIndex ? 1 : 0.4,
              }}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
