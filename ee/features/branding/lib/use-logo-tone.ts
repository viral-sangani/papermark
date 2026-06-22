// Stub for open-source build: enterprise branding feature not included.
//
// React hook that estimates whether a logo image reads as "light" or "dark"
// based on its averaged pixel luminance, so callers can pick a contrasting
// background chip. Defaults to "dark" (i.e. a white chip) before analysis
// completes or when the image host doesn't allow CORS pixel reads.

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithRef,
  type SyntheticEvent,
} from "react";

export type LogoTone = "light" | "dark";

export type UseLogoToneResult = {
  /** "light" when the logo is predominantly light/white, else "dark". */
  tone: LogoTone;
  /** Props to spread onto the display <img> that doubles as the analysis source. */
  imgProps: Pick<
    ComponentPropsWithRef<"img">,
    "ref" | "onLoad" | "crossOrigin"
  >;
};

const LUMINANCE_LIGHT_THRESHOLD = 0.7;

function analyzeLuminance(img: HTMLImageElement): LogoTone | null {
  try {
    const sampleSize = 32;
    const canvas = document.createElement("canvas");
    canvas.width = sampleSize;
    canvas.height = sampleSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, sampleSize, sampleSize);
    const { data } = ctx.getImageData(0, 0, sampleSize, sampleSize);

    let total = 0;
    let weight = 0;
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3] / 255;
      if (alpha === 0) continue;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Relative luminance (sRGB approximation), weighted by opacity.
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      total += luminance * alpha;
      weight += alpha;
    }
    if (weight === 0) return null;
    const avg = total / weight;
    return avg >= LUMINANCE_LIGHT_THRESHOLD ? "light" : "dark";
  } catch {
    // Canvas reads throw (SecurityError) when the image taints the canvas
    // because the host doesn't allow CORS. Fall back to the default.
    return null;
  }
}

export function useLogoTone(src: string | null | undefined): UseLogoToneResult {
  const [tone, setTone] = useState<LogoTone>("dark");
  const imgRef = useRef<HTMLImageElement | null>(null);

  const evaluate = useCallback((img: HTMLImageElement | null) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const result = analyzeLuminance(img);
    if (result) setTone(result);
  }, []);

  // Reset to the default whenever the source changes; re-evaluate if the image
  // is already cached/decoded.
  useEffect(() => {
    setTone("dark");
    if (imgRef.current) evaluate(imgRef.current);
  }, [src, evaluate]);

  const onLoad = useCallback(
    (event: SyntheticEvent<HTMLImageElement>) => {
      evaluate(event.currentTarget);
    },
    [evaluate],
  );

  return {
    tone,
    imgProps: {
      ref: imgRef,
      onLoad,
      crossOrigin: "anonymous",
    },
  };
}
