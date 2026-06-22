import { cn } from "@/lib/utils";

/**
 * A non-interactive overlay rendered on top of a document/viewer when the link
 * has confidential view enabled. It sits above the content (pointer-events-none
 * so it never blocks scrolling) and shows a subtle "Confidential" marker to
 * discourage casual screenshots and sharing.
 */
export function ConfidentialViewOverlay({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 z-30 flex items-start justify-end p-4 select-none",
        className,
      )}
    >
      <span className="rounded-md bg-black/60 px-2 py-1 text-xs font-medium uppercase tracking-wide text-white/90">
        Confidential
      </span>
    </div>
  );
}

export default ConfidentialViewOverlay;
