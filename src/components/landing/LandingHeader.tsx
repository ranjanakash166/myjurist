"use client";

import React, { useState, useEffect } from "react";
import { Menu, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import MyJuristLogo from "./MyJuristLogo";
import CtaArrowIcon from "./CtaArrowIcon";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Solutions", href: "#solutions", hasDropdown: true },
  { label: "Company", href: "/about", hasDropdown: true },
  { label: "Problems", href: "#problems" },
  { label: "Platform", href: "#platform" },
  { label: "Why Us", href: "#why" },
  { label: "Contact Us", href: "/contact" },
  { label: "Request Demo", href: "/request-demo" },
];

const LandingHeader: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col justify-center items-stretch px-4 sm:px-6 md:px-8 lg:px-12 xl:px-[250px] min-h-[72px] md:min-h-[90px] lg:min-h-[114px]"
      style={{
        background: "transparent",
      }}
    >
      {/* Inner panel: transparent at top, glass effect when scrolled */}
      <div
        className={`w-full max-w-full flex items-center justify-between gap-3 sm:gap-6 lg:gap-8 px-3 sm:px-6 py-2 sm:py-3 rounded-2xl md:rounded-3xl transition-all duration-300 ${
          isScrolled
            ? "bg-white/20 backdrop-blur-md border border-white/20 shadow-sm"
            : ""
        }`}
        style={{
          backgroundColor: isScrolled ? undefined : "transparent",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
          style={{ color: "#0f172a" }}
        >
          <MyJuristLogo size={41} />
          <span className="font-semibold text-xl text-[#0f172a] whitespace-nowrap">
            My Jurist
          </span>
        </Link>

        {/* Desktop nav – H6/Medium: Inter 20px, weight 500, line-height 24px */}
        <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
          <Link
            href="#home"
            className="font-medium transition-opacity hover:opacity-80"
            style={{
              color: "var(--text-secondary)",
              fontFamily: "var(--Heading-H6-fontFamily, Inter)",
              fontSize: "var(--Heading-H6-fontSize, 20px)",
              fontWeight: 500,
              lineHeight: "24px",
              letterSpacing: 0,
            }}
          >
            Home
          </Link>
          <div className="flex items-center gap-1 cursor-pointer group">
            <Link
              href="#solutions"
              className="font-medium transition-opacity hover:opacity-80"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                fontSize: "var(--Heading-H6-fontSize, 20px)",
                fontWeight: 500,
                lineHeight: "24px",
                letterSpacing: 0,
              }}
            >
              Solutions
            </Link>
            <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] group-hover:opacity-80" />
          </div>
          <div className="flex items-center gap-1 cursor-pointer group">
            <Link
              href="/about"
              className="font-medium transition-opacity hover:opacity-80"
              style={{
                color: "var(--text-secondary)",
                fontFamily: "var(--Heading-H6-fontFamily, Inter)",
                fontSize: "var(--Heading-H6-fontSize, 20px)",
                fontWeight: 500,
                lineHeight: "24px",
                letterSpacing: 0,
              }}
            >
              Company
            </Link>
            <ChevronDown className="w-5 h-5 text-[var(--text-secondary)] group-hover:opacity-80" />
          </div>
        </nav>

        {/* Right: Login + Contact Us */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Login – rounded pill */}
          <Button
            asChild
            variant="outline"
            className="rounded-full font-medium text-lg border-[var(--text-secondary)]/20 text-[#0f172a] hover:text-[#0f172a] transition-all duration-200 ease-out hover:scale-105 hover:shadow-md hover:bg-black/5 hover:border-[var(--text-secondary)]/30 active:scale-100"
            style={{
              padding: "16px",
              borderRadius: 100,
              background: "var(--bg-primary)",
            }}
          >
            <Link href="/login">Login</Link>
          </Button>
          {/* Contact Us – primary CTA in header */}
          <Button
            asChild
            className="landing-cta-button landing-cta-text font-medium gap-2 transition-all duration-200 ease-out hover:scale-105 hover:shadow-lg hover:brightness-110 active:scale-100"
          >
            <Link href="/contact" className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#22c55e]"
                style={{ backgroundColor: "#22c55e" }}
                aria-hidden
              />
              Contact Us
              <CtaArrowIcon size={28} className="shrink-0" />
            </Link>
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[var(--text-secondary)] p-4"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[280px] p-0 bg-[var(--bg-primary)]"
            style={{ borderLeftColor: "var(--text-secondary)" }}
          >
            <div className="flex flex-col pt-8 pb-6 px-4">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="py-3 text-base font-medium border-b border-black/10 last:border-0"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-6 flex flex-col gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="rounded-full w-full text-base text-[#0f172a] hover:text-[#0f172a] transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-md hover:bg-black/5 active:scale-100"
                  style={{
                    padding: "16px",
                    borderRadius: 100,
                    background: "var(--bg-primary)",
                    color: "#0f172a",
                  }}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="landing-cta-button landing-cta-text rounded-full w-full gap-2 transition-all duration-200 ease-out hover:scale-[1.02] hover:shadow-lg hover:brightness-110 active:scale-100"
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0 bg-[#22c55e]"
                      style={{ backgroundColor: "#22c55e" }}
                    />
                    Contact Us
                    <CtaArrowIcon size={28} className="shrink-0" />
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default LandingHeader;
