// Stub for open-source build: enterprise branding UI not included.

"use client";

import { Label } from "@/components/ui/label";
import {
  SUPPORTED_LOCALES,
  type SupportedLocaleCode,
} from "@/lib/i18n/locales";

export interface VisitorLanguageCardProps {
  defaultLanguage: SupportedLocaleCode;
  onDefaultLanguageChange: (value: SupportedLocaleCode) => void;
  /** Whether the current plan can use the visitor-language feature. */
  hasAccess?: boolean;
}

/**
 * Open-source stub for the enterprise visitor-language card. Renders a minimal
 * native <select> wired to the consumer's change handler so the dataroom's
 * default-language state stays consistent. Disabled when the plan lacks access.
 */
export function VisitorLanguageCard({
  defaultLanguage,
  onDefaultLanguageChange,
  hasAccess = true,
}: VisitorLanguageCardProps) {
  return (
    <div className="space-y-3 rounded-lg border border-gray-200 p-4">
      <div className="space-y-1">
        <Label htmlFor="visitor-language">Default visitor language</Label>
        <p className="text-xs text-muted-foreground">
          The language the viewer renders in for this data room.
        </p>
      </div>
      <select
        id="visitor-language"
        value={defaultLanguage}
        disabled={!hasAccess}
        onChange={(e) =>
          onDefaultLanguageChange(e.target.value as SupportedLocaleCode)
        }
        className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {SUPPORTED_LOCALES.map((locale) => (
          <option key={locale.code} value={locale.code}>
            {locale.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
