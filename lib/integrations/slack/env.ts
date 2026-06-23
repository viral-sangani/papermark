import { z } from "zod";

export const envSchema = z.object({
  SLACK_APP_INSTALL_URL: z.string(),
  SLACK_CLIENT_ID: z.string(),
  SLACK_CLIENT_SECRET: z.string(),
  SLACK_INTEGRATION_ID: z.string(),
});

type SlackEnv = z.infer<typeof envSchema>;

let env: SlackEnv | undefined;

export const getSlackEnv = () => {
  if (env) {
    return env;
  }

  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    throw new Error(
      "Slack app environment variables are not configured properly.",
    );
  }

  env = parsed.data;

  return env;
};

/**
 * Non-throwing variant of getSlackEnv: returns the parsed env, or `null` when
 * the SLACK_* variables are not configured. Self-hosted deployments that don't
 * set up a Slack app should treat the integration as simply unavailable rather
 * than surfacing a 500 / "Internal server error". Routes can use this to return
 * a clean "not configured" state.
 */
export const getSlackEnvSafe = (): SlackEnv | null => {
  try {
    return getSlackEnv();
  } catch {
    return null;
  }
};

/** True when a Slack app is configured (all SLACK_* env vars present). */
export const isSlackConfigured = (): boolean => getSlackEnvSafe() !== null;
