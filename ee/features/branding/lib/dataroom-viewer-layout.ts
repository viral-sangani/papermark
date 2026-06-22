// Stub for open-source build: enterprise branding feature not included.
//
// Provides the shared schemas, type-guards and preset helpers used by the
// dataroom branding / layout UI and APIs. The enterprise edition ships a
// richer version of this module; this stub keeps the open-source app compiling
// and behaving sanely with the same public surface.

import { z } from "zod";

// ---------------------------------------------------------------------------
// Card layout — how document/folder cards are rendered in the dataroom viewer.
// ---------------------------------------------------------------------------

export const DataroomCardLayoutSchema = z.enum(["LIST", "COMPACT", "GRID"]);
export type DataroomCardLayout = z.infer<typeof DataroomCardLayoutSchema>;

const DEFAULT_CARD_LAYOUT: DataroomCardLayout = "LIST";

/** Options consumed by the radio-group UI: `{ value, label }`. */
export const CARD_LAYOUT_OPTIONS: ReadonlyArray<{
  value: DataroomCardLayout;
  label: string;
}> = [
  { value: "LIST", label: "List" },
  { value: "COMPACT", label: "Compact" },
  { value: "GRID", label: "Grid" },
];

/**
 * Coerce an unknown value into a valid `DataroomCardLayout`, defaulting to the
 * fallback (or "LIST") when the value isn't a recognized layout.
 */
export function asDataroomCardLayout(
  value: unknown,
  fallback: DataroomCardLayout = DEFAULT_CARD_LAYOUT,
): DataroomCardLayout {
  const parsed = DataroomCardLayoutSchema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

// ---------------------------------------------------------------------------
// Viewer header style — the dataroom nav / hero treatment.
// ---------------------------------------------------------------------------

export const DataroomViewerHeaderStyleSchema = z.enum([
  "DEFAULT",
  "SPLIT",
  "NOTION",
]);
export type DataroomViewerHeaderStyle = z.infer<
  typeof DataroomViewerHeaderStyleSchema
>;

const DEFAULT_HEADER_STYLE: DataroomViewerHeaderStyle = "DEFAULT";

/**
 * Coerce an unknown value into a valid `DataroomViewerHeaderStyle`, defaulting
 * to the fallback (or "DEFAULT") when the value isn't recognized.
 */
export function asDataroomViewerHeaderStyle(
  value: unknown,
  fallback: DataroomViewerHeaderStyle = DEFAULT_HEADER_STYLE,
): DataroomViewerHeaderStyle {
  const parsed = DataroomViewerHeaderStyleSchema.safeParse(value);
  return parsed.success ? parsed.data : fallback;
}

// ---------------------------------------------------------------------------
// Layout presets — named bundles of layout settings, plus a "CUSTOM" sentinel
// for any combination that doesn't match a named preset.
// ---------------------------------------------------------------------------

/** The ids of the selectable preset cards (no "CUSTOM" — that's derived). */
export type DataroomLayoutCardId = "STANDARD" | "STRICT" | "MODERN" | "NOTION";

export const DataroomViewerLayoutPresetSchema = z.enum([
  "STANDARD",
  "STRICT",
  "MODERN",
  "NOTION",
  "CUSTOM",
]);
export type DataroomViewerLayoutPreset = z.infer<
  typeof DataroomViewerLayoutPresetSchema
>;

type LayoutSettings = {
  cardLayout: DataroomCardLayout;
  showFolderTree: boolean;
  hideFolderIconsInMain: boolean;
  viewerHeaderStyle: DataroomViewerHeaderStyle;
};

/**
 * The canonical settings for each named preset. Mirrors `applyLayoutPreset` in
 * the branding pages so `inferDataroomViewerLayoutPreset` round-trips.
 */
const PRESET_SETTINGS: Record<DataroomLayoutCardId, LayoutSettings> = {
  STANDARD: {
    cardLayout: "LIST",
    showFolderTree: true,
    hideFolderIconsInMain: false,
    viewerHeaderStyle: "DEFAULT",
  },
  STRICT: {
    cardLayout: "COMPACT",
    showFolderTree: false,
    hideFolderIconsInMain: true,
    viewerHeaderStyle: "DEFAULT",
  },
  MODERN: {
    cardLayout: "COMPACT",
    showFolderTree: false,
    hideFolderIconsInMain: true,
    viewerHeaderStyle: "SPLIT",
  },
  NOTION: {
    cardLayout: "GRID",
    showFolderTree: false,
    hideFolderIconsInMain: false,
    viewerHeaderStyle: "NOTION",
  },
};

const PRESET_ORDER: DataroomLayoutCardId[] = [
  "STANDARD",
  "STRICT",
  "MODERN",
  "NOTION",
];

/**
 * Given the current layout settings, return the matching named preset, or
 * "CUSTOM" when the combination doesn't correspond to any named preset.
 */
export function inferDataroomViewerLayoutPreset(
  settings: LayoutSettings,
): DataroomViewerLayoutPreset {
  for (const id of PRESET_ORDER) {
    const preset = PRESET_SETTINGS[id];
    if (
      preset.cardLayout === settings.cardLayout &&
      preset.showFolderTree === settings.showFolderTree &&
      preset.hideFolderIconsInMain === settings.hideFolderIconsInMain &&
      preset.viewerHeaderStyle === settings.viewerHeaderStyle
    ) {
      return id;
    }
  }
  return "CUSTOM";
}
