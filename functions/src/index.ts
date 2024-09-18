import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { onSchedule } from "firebase-functions/v2/scheduler";

const URL_PREFIX = "https://swaliga-foundation.web.app";

// handles form events
exports.handleFormWatch = onMessagePublished("projects/swaliga-foundation/topics/forms", async (event) => {
  const { eventType, formId } = event.data.message.attributes;
  await fetch(`${URL_PREFIX}/api/watches/handler`, {
    method: "POST",
    body: JSON.stringify({ eventType, formId }),
    headers: {
      "Content-Type": "application/json",
    }
  })
});

// "0 0 * * 0,3,5" - every Sunday, Wednesday, and Friday at midnight, renew all watches of currently active forms
exports.setWatchRenewal = onSchedule("0 0 * * 0,4", async (_) => {
  await fetch(`${URL_PREFIX}/api/watches/renewAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
})