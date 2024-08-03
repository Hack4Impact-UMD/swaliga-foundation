import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { onSchedule } from "firebase-functions/v2/scheduler";

const URL_PREFIX = 'https://swaliga-foundation.web.app'

exports.handleFormWatch = onMessagePublished("projects/swaliga-foundation/topics/forms", async (event) => {
  const { eventType, formId } = event.data.message.attributes;
  console.log('formId', formId, 'eventType', eventType);
  if (eventType === "RESPONSES") {
    const res = await fetch(`${URL_PREFIX}/api/responses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        formId
      })
    })
    console.log(res);
  } else {
    console.log(await fetch(`${URL_PREFIX}/api/surveys/${formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    }));
  }
});

// "0 0 * * 0,4" - every Sunday & Thursday at midnight
exports.setWatchRenewal = onSchedule("0 0 * * 0,4", async (_) => {
  await fetch(`${URL_PREFIX}/api/watches/renewAll`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
})