// Stub for open-source build: enterprise branding UI not included.

"use client";

import { ReactNode, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

export interface CollapsibleBrandingSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

/**
 * Open-source stub: a minimal collapsible section that renders its children
 * under a clickable title. Functionally equivalent to the enterprise version
 * for the purpose of grouping branding settings.
 */
export function CollapsibleBrandingSection({
  title,
  defaultOpen = false,
  children,
}: CollapsibleBrandingSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="w-full">
      <CollapsibleTrigger
        type="button"
        className="flex w-full items-center justify-between rounded-md py-2 text-left text-sm font-medium text-foreground"
      >
        <span>{title}</span>
        <ChevronDownIcon
          className={cn(
            "h-4 w-4 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3">{children}</CollapsibleContent>
    </Collapsible>
  );
}
