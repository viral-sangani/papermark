import { z } from "zod";

import prisma from "@/lib/prisma";

// Restricted API tokens are bound to a (user|machine) subject. Zod schema +
// parser used by the tokens API to validate/normalize the subjectType field.
export const RestrictedTokenSubjectTypeSchema = z.enum(["user", "machine"]);

export type RestrictedTokenSubjectType = z.infer<
  typeof RestrictedTokenSubjectTypeSchema
>;

// Coerce a stored/raw value to a valid subject type, defaulting to "user".
export function parseRestrictedTokenSubjectType(
  value: unknown,
): RestrictedTokenSubjectType {
  const parsed = RestrictedTokenSubjectTypeSchema.safeParse(value);
  return parsed.success ? parsed.data : "user";
}

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
