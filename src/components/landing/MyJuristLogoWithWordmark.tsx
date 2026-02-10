"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import MyJuristLogo from "./MyJuristLogo";

export interface MyJuristLogoWithWordmarkProps {
  /** "light" = wordmark for light backgrounds, "dark" = inverted for dark backgrounds */
  variant?: "light" | "dark";
  /** Icon size in pixels (wordmark scales). Default 41. */
  size?: number;
  /** Wrap in Link to this href. Set to false to render without link. */
  href?: string | false;
  /** Additional class for the wrapper. */
  className?: string;
  /** If true, show only the icon (no wordmark). Useful for very compact spots. */
  iconOnly?: boolean;
}

const MyJuristLogoWithWordmark: React.FC<MyJuristLogoWithWordmarkProps> = ({
  variant = "light",
  size = 41,
  href = "/",
  className = "",
  iconOnly = false,
}) => {
  const wordmarkHeight = size <= 28 ? "h-6" : size <= 32 ? "h-7" : "h-8";
  const content = (
    <>
      <span className="shrink-0" style={{ width: size, height: size, minWidth: size, minHeight: size }}>
        <MyJuristLogo size={size} className="block" />
      </span>
      {!iconOnly && (
        <Image
          src="/images/myjurist-wordmark.png"
          alt="My Jurist"
          width={120}
          height={32}
          className={`w-auto object-contain ${wordmarkHeight} ${
            variant === "dark" ? "brightness-0 invert" : ""
          }`}
        />
      )}
    </>
  );

  const wrapperClassName = `flex items-center gap-2 sm:gap-3 shrink-0 ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={wrapperClassName} aria-label="My Jurist home">
        {content}
      </Link>
    );
  }
  return <div className={wrapperClassName}>{content}</div>;
};

export default MyJuristLogoWithWordmark;
