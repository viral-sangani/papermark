// Stub for open-source build: enterprise request-lists feature not included.
"use client";

export interface RequestListSheetProps {
  linkId: string;
  dataroomId: string;
  viewId: string;
  viewerId?: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Side sheet listing the dataroom's outstanding requests for a viewer.
 *
 * The enterprise request-lists feature is not included in the open-source
 * build. The consumer only renders this behind a `requestListEnabled` guard
 * (which is always false here), so we render `null` and keep `onOpenChange`
 * inert. The props interface matches the real component so the consumer
 * compiles unchanged.
 */
export function RequestListSheet(_props: RequestListSheetProps) {
  return null;
}
