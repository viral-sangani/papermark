// Stub for open-source build: enterprise request-lists feature not included.

/**
 * Custom DOM event name used to toggle the viewer request-list sheet.
 *
 * The viewer body toolbar dispatches this event via `window.dispatchEvent`,
 * and the dataroom nav listens for it via `window.addEventListener` so the
 * sheet's open state stays owned by the nav without prop-drilling a handler.
 */
export const VIEWER_TOGGLE_REQUEST_LIST_EVENT = "viewer-toggle-request-list";
