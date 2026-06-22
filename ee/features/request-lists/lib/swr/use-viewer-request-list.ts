// Stub for open-source build: enterprise request-lists feature not included.
"use client";

export interface UseViewerRequestListParams {
  linkId?: string;
  dataroomId?: string;
  viewerId?: string;
  isPreview?: boolean;
}

export interface UseViewerRequestListReturn {
  /** Whether the dataroom exposes a request list to the current viewer. */
  enabled: boolean;
  /** Request-list items for the current viewer (always empty in OSS build). */
  items: never[];
  /** Whether the (no-op) detection request is in flight. */
  isLoading: boolean;
  /** Detection/load error, if any. */
  error: undefined;
  /** SWR-style revalidate; no-op in OSS build. */
  mutate: () => Promise<void>;
}

/**
 * Detects whether a request list is available for the current viewer.
 *
 * In the open-source build this enterprise feature is not included, so the
 * hook always reports `enabled: false` with inert defaults. The shape mirrors
 * the real hook so consumers can destructure without changes.
 */
export function useViewerRequestList(
  _params: UseViewerRequestListParams,
): UseViewerRequestListReturn {
  return {
    enabled: false,
    items: [],
    isLoading: false,
    error: undefined,
    mutate: async () => {},
  };
}
