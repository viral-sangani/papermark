/**
 * Maximum number of teams a datarooms-premium admin may provision.
 *
 * Datarooms-premium admins can self-provision teams (mirroring the
 * datarooms-unlimited behaviour) but are capped at this number.
 */
export const PREMIUM_TEAM_LIMIT = 1;

export type PremiumTeamEligibility = {
  /** Whether the user is eligible to provision a premium team at all. */
  eligible: boolean;
  /** Whether the user is an admin of a datarooms-premium team. */
  isPremiumAdmin: boolean;
  /**
   * Whether the user can create another premium team right now
   * (i.e. eligible AND under `PREMIUM_TEAM_LIMIT`).
   */
  canCreate: boolean;
};

/**
 * Resolves a user's eligibility to provision a `datarooms-premium` team.
 *
 * This is an enterprise (EE) capability. In the open-source build there is no
 * premium provisioning, so the user is never a premium admin and can never
 * create a premium team. Returning the non-premium defaults makes the consumer
 * fall back to the standard (free) plan path.
 */
export async function getPremiumTeamEligibility(
  userId: string,
): Promise<PremiumTeamEligibility> {
  return {
    eligible: false,
    isPremiumAdmin: false,
    canCreate: false,
  };
}
