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
  { label: "The Challenge", href: "#challenge" },
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
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 flex flex-col justify-center items-stretch px-6 md:px-8 lg:px-12 xl:px-[250px]"
      style={{
        background: "var(--header-gradient)",
        minHeight: 114,
      }}
    >
      {/* Inner panel: white rounded bar (Figma: padding 0 250px constrains this) */}
      <div
        className="w-full flex items-center justify-between gap-6 lg:gap-8 px-6 py-3 rounded-3xl"
        style={{
          backgroundColor: "var(--bg-primary)",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          border: "1px solid rgba(0,0,0,0.04)",
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
          {/* Login – rounded pill, comfortable padding */}
          <Button
            asChild
            variant="outline"
            className="rounded-full font-medium px-5 py-2.5 border-[var(--text-secondary)]/20 text-[#0f172a] hover:bg-black/5"
            style={{
              padding: "10px 20px",
              borderRadius: 100,
              background: "var(--bg-primary)",
            }}
          >
            <Link href="/login">Login</Link>
          </Button>
          {/* Contact Us – primary CTA in header */}
          <Button
            asChild
            className="rounded-full font-medium gap-2 px-6 py-3 text-white hover:opacity-90"
            style={{
              padding: "12px 24px",
              borderRadius: 100,
              background: "var(--bg-black-solid)",
            }}
          >
            <Link href="/contact" className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: "var(--green-500)" }}
                aria-hidden
              />
              Contact Us
              <CtaArrowIcon size={24} className="shrink-0" />
            </Link>
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-[var(--text-secondary)]"
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
                  className="rounded-full w-full py-3"
                  style={{
                    padding: "12px 20px",
                    borderRadius: 100,
                    background: "var(--bg-primary)",
                    color: "#0f172a",
                  }}
                >
                  <Link href="/login">Login</Link>
                </Button>
                <Button
                  asChild
                  className="rounded-full w-full gap-2 py-3 text-white"
                  style={{
                    padding: "14px 24px",
                    borderRadius: 100,
                    background: "var(--bg-black-solid)",
                  }}
                >
                  <Link href="/contact" className="flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--green-500)" }}
                    />
                    Contact Us
                    <CtaArrowIcon size={24} className="shrink-0" />
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
