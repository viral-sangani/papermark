// Stub for open-source build: enterprise branding UI not included.

export interface BrandingSocialPreviewReadonlyProps {
  title?: string | null;
  description?: string | null;
  /** Open Graph image URL. */
  image?: string | null;
  /** Favicon URL. */
  favicon?: string | null;
}

/**
 * Open-source stub for the read-only social (Open Graph) preview card.
 *
 * Renders a minimal, non-interactive representation of the link preview so the
 * surrounding tab still has content. The pixel-perfect enterprise preview is
 * not included.
 */
export function BrandingSocialPreviewReadonly({
  title,
  description,
  image,
  favicon,
}: BrandingSocialPreviewReadonlyProps) {
  return (
    <div className="w-full max-w-xl overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="flex aspect-[1200/630] w-full items-center justify-center bg-gray-100">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title || "Link preview"}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-xs text-muted-foreground">No preview image</span>
        )}
      </div>
      <div className="flex items-start gap-2 p-3">
        {favicon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={favicon}
            alt=""
            className="mt-0.5 h-4 w-4 rounded-sm"
            aria-hidden="true"
          />
        ) : null}
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">
            {title || "Untitled"}
          </p>
          {description ? (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
