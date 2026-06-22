// Stub for open-source build: enterprise branding feature not included.
//
// React hook used by the branding preview iframes. It reads the branding
// parameters from the URL query string on first paint and then live-updates
// them when the editor posts new values over `postMessage`, so the iframe never
// has to reload. Values are returned as raw strings (the consumers compare them
// against "1" / "0" / "GRID" etc.).

import { useEffect, useState } from "react";

/** All branding preview params, as raw string values (or undefined). */
export type BrandingPreviewParams = {
  brandLogo?: string;
  brandColor?: string;
  brandBanner?: string;
  accentColor?: string;
  accentButtonColor?: string;
  applyAccentColorToDataroomView?: string;
  cardLayout?: string;
  showFolderTree?: string;
  hideFolderIconsInMain?: string;
  viewerHeaderStyle?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  welcomeMessage?: string;
};

const PARAM_KEYS: (keyof BrandingPreviewParams)[] = [
  "brandLogo",
  "brandColor",
  "brandBanner",
  "accentColor",
  "accentButtonColor",
  "applyAccentColorToDataroomView",
  "cardLayout",
  "showFolderTree",
  "hideFolderIconsInMain",
  "viewerHeaderStyle",
  "ctaLabel",
  "ctaUrl",
  "welcomeMessage",
];

function readFromSearch(): BrandingPreviewParams {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const result: BrandingPreviewParams = {};
  for (const key of PARAM_KEYS) {
    const value = params.get(key);
    if (value !== null) result[key] = value;
  }
  return result;
}

export function useBrandingPreviewParams(): BrandingPreviewParams {
  const [params, setParams] = useState<BrandingPreviewParams>({});

  // Seed from the URL after mount to avoid a server/client hydration mismatch.
  useEffect(() => {
    setParams(readFromSearch());
  }, []);

  // Live-update over postMessage from the editor.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const next: BrandingPreviewParams = {};
      let hasAny = false;
      for (const key of PARAM_KEYS) {
        const value = (data as Record<string, unknown>)[key];
        if (typeof value === "string") {
          next[key] = value;
          hasAny = true;
        }
      }
      if (hasAny) {
        setParams((prev) => ({ ...prev, ...next }));
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return params;
}
