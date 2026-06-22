import { tenant } from "@teamhanko/passkeys-next-auth-provider";

// Hanko powers passkey/WebAuthn login. It is optional for self-hosting: when the
// keys are not configured we export `null` instead of throwing at import time, so
// the rest of NextAuth (email magic-link, OAuth, SAML) keeps working. Callers that
// actually use passkeys must guard against `hanko` being null.
const hankoConfigured = Boolean(
  process.env.HANKO_API_KEY && process.env.NEXT_PUBLIC_HANKO_TENANT_ID,
);

const hanko = hankoConfigured
  ? tenant({
      apiKey: process.env.HANKO_API_KEY!,
      tenantId: process.env.NEXT_PUBLIC_HANKO_TENANT_ID!,
    })
  : null;

export default hanko;
