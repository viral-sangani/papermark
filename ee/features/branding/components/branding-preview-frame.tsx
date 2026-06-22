// Stub for open-source build: enterprise branding UI not included.

export interface BrandingPreviewFrameProps {
  /** Identifier for the preview being rendered (e.g. "document-view"). */
  name: string;
  /** Base path of the live preview route used by the enterprise edition. */
  basePath: string;
  /** Query params forwarded to the live preview iframe. */
  params?: Record<string, string>;
}

/**
 * Open-source stub for the live branding preview iframe.
 *
 * The enterprise edition renders an interactive iframe of the real viewer at
 * `basePath` with `params`. In the open-source build we render a simple,
 * non-crashing placeholder that fills its container.
 */
export function BrandingPreviewFrame({ name }: BrandingPreviewFrameProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-100 text-center">
      <div className="px-6">
        <p className="text-sm font-medium text-foreground">
          Live preview unavailable
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          The {name.replace(/-/g, " ")} preview is not included in the
          open-source build.
        </p>
      </div>
    </div>
  );
}
