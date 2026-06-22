/**
 * Determines whether a user is allowed to provision a `datarooms-unlimited`
 * team on creation.
 *
 * This is an enterprise (EE) capability. In the open-source build there is no
 * mechanism to grant unlimited teams, so this always resolves to `false` and
 * new teams fall back to the standard (free) plan path.
 */
export async function canCreateUnlimitedTeam(userId: string): Promise<boolean> {
  return false;
}
