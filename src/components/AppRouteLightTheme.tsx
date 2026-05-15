"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

/**
 * While the user is on selected tool or org-management routes, force the global theme to `light`
 * so semantic tokens (bg-background, etc.) match the light dashboard experience.
 * On leaving those routes, restores the theme preference saved when entering.
 * The mobile theme toggle may appear ineffective on these routes until navigation away.
 */
const LIGHT_ROUTE_PREFIXES = [
  "/app/document-analysis",
  "/app/legal-research",
  "/app/timeline-extractor",
  "/app/smart-drafting",
  "/app/my-jurist-chat",
  "/app/document-categorization",
  "/app/organization-management",
] as const;

function matchesLightRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  return LIGHT_ROUTE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export function AppRouteLightTheme() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const prevWasLightRef = useRef(false);
  const savedThemeRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const isLight = matchesLightRoute(pathname);
    const wasLight = prevWasLightRef.current;

    if (isLight && !wasLight) {
      savedThemeRef.current = theme ?? "system";
      setTheme("light");
    } else if (!isLight && wasLight) {
      setTheme(savedThemeRef.current ?? "system");
    } else if (isLight && theme && theme !== "light") {
      // Keep tool routes light if the user toggles theme while staying on the route
      setTheme("light");
    }

    prevWasLightRef.current = isLight;
  }, [pathname, theme, setTheme]);

  return null;
}
