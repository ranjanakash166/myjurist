"use client";

import React from "react";

/**
 * My Jurist logo – "M" mark with blue-to-fuchsia gradient.
 * Design: 100×100 viewBox; use size prop to scale (e.g. header uses 41).
 * Uses unique gradient IDs per instance so multiple logos on the page all render correctly.
 */
const MyJuristLogo: React.FC<{ className?: string; size?: number }> = ({
  className = "",
  size = 100,
}) => {
  const id = React.useId().replace(/:/g, "");
  const gradientId0 = `myjurist-m-grad-0-${id}`;
  const gradientId1 = `myjurist-m-grad-1-${id}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      aria-hidden
    >
      <path
        d="M58 50C58 54.4183 54.4183 58 50 58C45.5817 58 42 54.4183 42 50V34C42 29.5817 38.4183 26 34 26C29.5817 26 26 29.5817 26 34V50C26 54.4183 22.4183 58 18 58C13.5817 58 10 54.4183 10 50V34C10 20.7452 20.7452 10 34 10C47.2548 10 58 20.7452 58 34V50Z"
        fill={`url(#${gradientId0})`}
      />
      <path
        d="M66 10C79.2548 10 90 20.7452 90 34V66C90 79.2548 79.2548 90 66 90C52.9522 90 42.3362 79.5878 42.0078 66.6191L42 66H58C58 70.4183 61.5817 74 66 74C70.4183 74 74 70.4183 74 66V34C74 29.5817 70.4183 26 66 26C61.5817 26 58 29.5817 58 34V50C58 45.5817 54.4183 42 50 42C45.5817 42 42 45.5817 42 50V34C42 20.7452 52.7452 10 66 10Z"
        fill={`url(#${gradientId1})`}
      />
      <defs>
        <linearGradient
          id={gradientId0}
          x1="20"
          y1="15.5"
          x2="126.5"
          y2="126"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
        <linearGradient
          id={gradientId1}
          x1="20"
          y1="15.5"
          x2="126.5"
          y2="126"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#C026D3" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default MyJuristLogo;
