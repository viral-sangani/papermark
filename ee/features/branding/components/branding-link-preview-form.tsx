// Stub for open-source build: enterprise branding UI not included.

"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export interface BrandingLinkPreviewFormProps {
  enabled: boolean;
  onEnabledChange: (value: boolean) => void;
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  imageUrl: string | null;
  onImageChange: (value: string) => void;
  faviconUrl: string | null;
  onFaviconChange: (value: string) => void;
  /** Hint describing how this preview inherits / overrides other settings. */
  inheritanceHint?: string;
}

/**
 * Open-source stub for the enterprise custom-link-preview (Open Graph) form.
 *
 * Provides minimal, working controls wired to the consumer's value handlers so
 * the parent's state stays consistent. The richer enterprise editor (image
 * upload, live OG preview) is not included.
 */
export function BrandingLinkPreviewForm({
  enabled,
  onEnabledChange,
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  imageUrl,
  onImageChange,
  faviconUrl,
  onFaviconChange,
  inheritanceHint,
}: BrandingLinkPreviewFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Label htmlFor="link-preview-enabled">Custom Link Preview</Label>
          {inheritanceHint ? (
            <p className="mt-1 text-xs text-muted-foreground">
              {inheritanceHint}
            </p>
          ) : null}
        </div>
        <Switch
          id="link-preview-enabled"
          checked={enabled}
          onCheckedChange={onEnabledChange}
        />
      </div>

      {enabled ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="link-preview-title">Title</Label>
            <Input
              id="link-preview-title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="link-preview-description">Description</Label>
            <Textarea
              id="link-preview-description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="link-preview-image">Image URL</Label>
            <Input
              id="link-preview-image"
              value={imageUrl ?? ""}
              onChange={(e) => onImageChange(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="link-preview-favicon">Favicon URL</Label>
            <Input
              id="link-preview-favicon"
              value={faviconUrl ?? ""}
              onChange={(e) => onFaviconChange(e.target.value)}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
