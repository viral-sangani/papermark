// Stub for open-source build: enterprise branding UI not included.

"use client";

import {
  DataroomLayoutCardId,
  DataroomViewerLayoutPreset,
} from "@/ee/features/branding/lib/dataroom-viewer-layout";
import { cn } from "@/lib/utils";

export interface DataroomLayoutPresetCardsProps {
  /** Currently selected preset; "CUSTOM" when no named preset matches. */
  selectedPreset: DataroomViewerLayoutPreset;
  /** Called with the chosen named preset when a card is clicked. */
  onSelect: (preset: DataroomLayoutCardId) => void;
}

const PRESETS: { id: DataroomLayoutCardId; label: string; hint: string }[] = [
  { id: "STANDARD", label: "Standard", hint: "List with navigation tree" },
  { id: "STRICT", label: "Strict", hint: "Compact, no folder tree" },
  { id: "MODERN", label: "Modern", hint: "Compact with split header" },
  { id: "NOTION", label: "Notion", hint: "Grid with Notion-style header" },
];

/**
 * Open-source stub for the enterprise layout preset cards. Renders a minimal,
 * clickable list of the named presets and reports selection via `onSelect`, so
 * the page's preset logic keeps working.
 */
export function DataroomLayoutPresetCards({
  selectedPreset,
  onSelect,
}: DataroomLayoutPresetCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {PRESETS.map((preset) => {
        const isSelected = selectedPreset === preset.id;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            className={cn(
              "flex flex-col items-start rounded-md border px-3 py-2 text-left transition-colors",
              isSelected
                ? "border-gray-900 bg-gray-50"
                : "border-gray-200 hover:border-gray-400",
            )}
            aria-pressed={isSelected}
          >
            <span className="text-sm font-medium text-foreground">
              {preset.label}
            </span>
            <span className="text-xs text-muted-foreground">{preset.hint}</span>
          </button>
        );
      })}
    </div>
  );
}
