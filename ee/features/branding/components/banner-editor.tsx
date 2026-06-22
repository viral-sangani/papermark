// Stub for open-source build: enterprise branding UI not included.

import { ReactNode } from "react";

export interface BannerEditorProps {
  banner: string | null;
  setBanner: (value: string | null) => void;
  setBannerBlobUrl: (value: string | null) => void;
  /** Helper text describing accepted file size / dimensions. */
  sizeHint?: string;
  /** Default banner image used when none has been uploaded. */
  defaultBannerImage?: string;
  /** Called when a banner URL is applied (paste flow). */
  onUrlApplied?: () => void;
  /** The consumer-provided drop zone / file input markup. */
  dropZone?: ReactNode;
}

/**
 * Open-source stub for the enterprise banner editor.
 *
 * The full editor (URL paste, video/YouTube support, cropping) ships only in
 * the enterprise edition. Here we simply render the consumer-provided
 * `dropZone`, so the surrounding upload flow keeps working, plus the size hint.
 */
export function BannerEditor({
  sizeHint,
  dropZone,
}: BannerEditorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Banner</span>
        {sizeHint ? (
          <span className="text-xs font-normal text-muted-foreground">
            {sizeHint}
          </span>
        ) : null}
      </div>
      {dropZone}
    </div>
  );
}
