import prisma from "@/lib/prisma";

// Stub for open-source build: imported by the remove-teammate flow but not
// shipped in the OSS tree.
//
// When a user loses access to a team, their "user"-subject API keys for that
// team must be revoked (the RestrictedToken schema documents exactly this:
// user keys are revoked when the owner loses team access, machine keys stay
// team-scoped). Delete the matching user-bound tokens.
export async function revokeUserBoundTeamTokens(
  userId: string,
  teamId: string,
): Promise<void> {
  await prisma.restrictedToken.deleteMany({
    where: {
      userId,
      teamId,
      subjectType: "user",
    },
  });
}
