// OAuth / API token scopes.
//
// Stub for open-source build: this module is imported by the token UI and the
// token API but was not shipped in the OSS tree. The scope strings below match
// the dot-notation the codebase already references (e.g. "documents.read",
// "apis.all") so token creation/validation works.
//
// PRESET_SCOPES are the coarse presets; GRANULAR_SCOPES are the per-resource
// read/write scopes. ALLOWED_SCOPES (consumers build it as [...PRESET, ...GRANULAR])
// is used to validate that requested scopes are known.

export const PRESET_SCOPES = ["apis.all", "apis.read"] as const;

export const GRANULAR_SCOPES = [
  "documents.read",
  "documents.write",
  "links.read",
  "links.write",
  "datarooms.read",
  "datarooms.write",
  "analytics.read",
  "visitors.read",
  "webhooks.write",
  "domains.write",
  "reader.read",
] as const;

export type PresetScope = (typeof PRESET_SCOPES)[number];
export type GranularScope = (typeof GRANULAR_SCOPES)[number];
export type Scope = PresetScope | GranularScope;

export const ALL_SCOPES = [...PRESET_SCOPES, ...GRANULAR_SCOPES] as const;
