// Stub for open-source build: enterprise dataroom-trial scheduled emails are
// not included. These are real Trigger.dev tasks so `.trigger(payload, opts)`
// works and returns a handle with an `id`; when Trigger.dev is not configured
// the trigger call is simply a no-op queue insert (the consumer only reads
// `handle.id`). The actual email-sending body is intentionally minimal.
import { task } from "@trigger.dev/sdk";

type TrialInfoPayload = {
  to: string;
  useCase?: string | null;
  name?: string | null;
};

type TrialReminderPayload = {
  to: string;
  name?: string | null;
  teamId: string;
};

export const sendDataroomTrialInfoEmailTask = task({
  id: "send-dataroom-trial-info-email",
  run: async (_payload: TrialInfoPayload) => {
    // No-op in open-source build.
    return { sent: false };
  },
});

export const sendDataroomTrial24hReminderEmailTask = task({
  id: "send-dataroom-trial-24h-reminder-email",
  run: async (_payload: TrialReminderPayload) => {
    // No-op in open-source build.
    return { sent: false };
  },
});

export const sendDataroomTrialExpiredEmailTask = task({
  id: "send-dataroom-trial-expired-email",
  run: async (_payload: TrialReminderPayload) => {
    // No-op in open-source build.
    return { sent: false };
  },
});
