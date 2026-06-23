import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { isSlackConfigured } from "@/lib/integrations/slack/env";
import { getSlackInstallationUrl } from "@/lib/integrations/slack/install";
import prisma from "@/lib/prisma";
import { CustomUser } from "@/lib/types";
import { getSearchParams } from "@/lib/utils/get-search-params";

const oAuthAuthorizeSchema = z.object({
  teamId: z.string().cuid(),
});

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // No Slack app configured on this deployment — return a clear, actionable
    // message instead of a generic 500. The settings page shows this in a toast.
    if (!isSlackConfigured()) {
      return NextResponse.json(
        {
          error:
            "Slack integration is not configured on this deployment. An admin must set the SLACK_* environment variables.",
        },
        { status: 501 },
      );
    }

    const { teamId } = oAuthAuthorizeSchema.parse(getSearchParams(req.url));
    const userId = (session.user as CustomUser).id;

    const userTeam = await prisma.userTeam.findUnique({
      where: {
        userId_teamId: {
          userId,
          teamId,
        },
      },
    });

    if (!userTeam) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const oauthUrl = await getSlackInstallationUrl(teamId);

    return NextResponse.json({
      oauthUrl,
    });
  } catch (error) {
    console.error("Slack OAuth authorization error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
