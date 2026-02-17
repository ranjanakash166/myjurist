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
  /** Optional explicit wordmark size (px). */
  wordmarkWidth?: number;
  wordmarkHeight?: number;
}

const MyJuristLogoWithWordmark: React.FC<MyJuristLogoWithWordmarkProps> = ({
  variant = "light",
  size = 41,
  href = "/",
  className = "",
  iconOnly = false,
  wordmarkWidth,
  wordmarkHeight,
}) => {
  const wordmarkClass = !wordmarkWidth && !wordmarkHeight
    ? size <= 28
      ? "h-6"
      : size <= 32
        ? "h-7"
        : "h-8"
    : "";
  const content = (
    <>
      <span className="shrink-0" style={{ width: size, height: size, minWidth: size, minHeight: size }}>
        <MyJuristLogo size={size} className="block" />
      </span>
      {!iconOnly && (
        <Image
          src="/images/myjurist-wordmark.png"
          alt="My Jurist"
          width={wordmarkWidth ?? 120}
          height={wordmarkHeight ?? 32}
          className={`object-contain ${wordmarkClass} ${
            variant === "dark" ? "brightness-0 invert" : ""
          }`}
          style={{
            width: wordmarkWidth ? `${wordmarkWidth}px` : undefined,
            height: wordmarkHeight ? `${wordmarkHeight}px` : undefined,
          }}
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
