// Stub for open-source build: enterprise branding feature not included.
//
// Classifies a dataroom banner URL into the media kind the viewer should
// render (image, video, YouTube embed, or none). The enterprise edition may
// support additional sources; this stub covers the common cases.

/** The media kind a banner URL resolves to. */
export type DataroomBannerKind = "none" | "image" | "video" | "youtube";

export type ClassifiedDataroomBanner = {
  kind: DataroomBannerKind;
  /** Normalized media src (null when there is nothing to render). */
  src: string | null;
  /** Extracted YouTube video id when `kind === "youtube"`. */
  youtubeId: string | null;
};

const VIDEO_EXTENSIONS = [".mp4", ".webm", ".ogg", ".mov", ".m4v"];

/** Extract a YouTube video id from common URL shapes, or null. */
function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*\bv=)([\w-]{11})/i,
    /(?:youtu\.be\/)([\w-]{11})/i,
    /(?:youtube\.com\/embed\/)([\w-]{11})/i,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/i,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1];
  }
  return null;
}

/**
 * Classify a banner URL into a renderable media kind. Returns a neutral
 * `"none"` kind for empty values or the sentinel `"no-banner"`.
 */
export function classifyDataroomBanner(
  src: string | null | undefined,
): ClassifiedDataroomBanner {
  if (!src || src === "no-banner") {
    return { kind: "none", src: null, youtubeId: null };
  }

  const youtubeId = extractYoutubeId(src);
  if (youtubeId) {
    return { kind: "youtube", src, youtubeId };
  }

  const lower = src.split("?")[0].toLowerCase();
  if (VIDEO_EXTENSIONS.some((ext) => lower.endsWith(ext))) {
    return { kind: "video", src, youtubeId: null };
  }

  return { kind: "image", src, youtubeId: null };
}
