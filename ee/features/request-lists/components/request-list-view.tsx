// Stub for open-source build: enterprise request-lists feature not included.
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export interface RequestListViewProps {
  dataroomId: string;
}

/**
 * Admin view for managing a dataroom's request list (the due-diligence
 * checklist of requests assigned to visitors or groups).
 *
 * The enterprise request-lists feature is not included in the open-source
 * build, so this renders an informational placeholder.
 */
export function RequestListView(_props: RequestListViewProps) {
  return (
    <Card className="bg-transparent">
      <CardHeader>
        <CardTitle>Request List</CardTitle>
        <CardDescription>
          Track outstanding requests and assign them to data room visitors.
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
