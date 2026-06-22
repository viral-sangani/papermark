// Stub for open-source build: enterprise request-lists feature not included.
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface RequestListSettingsCardProps {
  dataroomId: string;
  teamId: string;
  requestListEnabled?: boolean;
}

/**
 * Dataroom settings card for enabling/configuring the request list.
 *
 * The enterprise request-lists feature is not included in the open-source
 * build, so this renders an informational placeholder instead of the real
 * settings controls.
 */
export function RequestListSettingsCard(_props: RequestListSettingsCardProps) {
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Request List</CardTitle>
        <CardDescription>
          Create a due-diligence checklist of requests and track completion.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Request lists are not available in the open-source build.
        </p>
      </CardContent>
    </Card>
  );
}
