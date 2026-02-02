"use client";

import React from "react";

interface CtaArrowIconProps {
  size?: number;
  className?: string;
}

/** CTA arrow: white circle with dark arrow. Use in Request a Demo and Contact Us. */
const CtaArrowIcon: React.FC<CtaArrowIconProps> = ({
  size = 32,
  className = "",
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
    aria-hidden
  >
    <rect
      width="32"
      height="32"
      rx="16"
      fill="var(--b-w-white, #FFF)"
    />
    <path
      d="M12.5 20L20.5 12M20.5 12V19.68M20.5 12H12.82"
      stroke="#0F172A"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CtaArrowIcon;
