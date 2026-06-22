// Stub for open-source build: enterprise branding feature not included.
//
// Resolves the public-facing link preview metadata (Open Graph title /
// description / image / favicon) for a shared link, layering link-level
// overrides on top of dataroom-brand and team-brand link-preview settings.

/** Link-level meta overrides stored on the Link record. */
type LinkMetaInput = {
  enableCustomMetatag?: boolean | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  metaImage?: string | null;
  metaFavicon?: string | null;
};

/** Brand-level link-preview settings (team brand or dataroom brand). */
type BrandLinkPreviewInput = {
  customLinkPreviewEnabled?: boolean | null;
  linkPreviewTitle?: string | null;
  linkPreviewDescription?: string | null;
  linkPreviewImage?: string | null;
  linkPreviewFavicon?: string | null;
} | null;

type ResolvePublicLinkMetaArgs = {
  link: LinkMetaInput;
  teamBrand: BrandLinkPreviewInput;
  dataroomBrand?: BrandLinkPreviewInput;
  defaultTitle: string;
};

/** The resolved metadata consumed by the public view pages. */
export type ResolvedPublicLinkMeta = {
  enableCustomMetatag: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  metaImage: string | null;
  metaFavicon: string;
};

const DEFAULT_FAVICON = "/favicon.ico";

function firstNonEmpty(
  ...values: Array<string | null | undefined>
): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) return value;
  }
  return null;
}

/**
 * Resolve the public link metadata. Precedence (highest first):
 *  1. Link-level custom metatags (when `enableCustomMetatag`)
 *  2. Dataroom brand link-preview (when `customLinkPreviewEnabled`)
 *  3. Team brand link-preview (when `customLinkPreviewEnabled`)
 *  4. Sensible defaults (`defaultTitle`, default favicon)
 */
export function resolvePublicLinkMeta({
  link,
  teamBrand,
  dataroomBrand,
  defaultTitle,
}: ResolvePublicLinkMetaArgs): ResolvedPublicLinkMeta {
  const linkEnabled = !!link.enableCustomMetatag;
  const dataroomEnabled = !!dataroomBrand?.customLinkPreviewEnabled;
  const teamEnabled = !!teamBrand?.customLinkPreviewEnabled;

  const enableCustomMetatag = linkEnabled || dataroomEnabled || teamEnabled;

  const metaTitle =
    firstNonEmpty(
      linkEnabled ? link.metaTitle : null,
      dataroomEnabled ? dataroomBrand?.linkPreviewTitle : null,
      teamEnabled ? teamBrand?.linkPreviewTitle : null,
    ) ?? defaultTitle;

  const metaDescription = firstNonEmpty(
    linkEnabled ? link.metaDescription : null,
    dataroomEnabled ? dataroomBrand?.linkPreviewDescription : null,
    teamEnabled ? teamBrand?.linkPreviewDescription : null,
  );

  const metaImage = firstNonEmpty(
    linkEnabled ? link.metaImage : null,
    dataroomEnabled ? dataroomBrand?.linkPreviewImage : null,
    teamEnabled ? teamBrand?.linkPreviewImage : null,
  );

  const metaFavicon =
    firstNonEmpty(
      linkEnabled ? link.metaFavicon : null,
      dataroomEnabled ? dataroomBrand?.linkPreviewFavicon : null,
      teamEnabled ? teamBrand?.linkPreviewFavicon : null,
    ) ?? DEFAULT_FAVICON;

  return {
    enableCustomMetatag,
    metaTitle,
    metaDescription,
    metaImage,
    metaFavicon,
  };
}
