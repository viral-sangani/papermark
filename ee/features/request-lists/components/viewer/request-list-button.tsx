// Stub for open-source build: enterprise request-lists feature not included.
"use client";

export interface RequestListButtonProps {
  className?: string;
}

/**
 * Toolbar trigger that toggles the viewer request-list sheet.
 *
 * The enterprise request-lists feature is not included in the open-source
 * build, and `useViewerRequestList` always reports `enabled: false`, so this
 * button is only ever rendered behind a disabled guard. We render `null` to
 * avoid showing a non-functional control.
 */
export function RequestListButton(_props: RequestListButtonProps) {
  return null;
}
