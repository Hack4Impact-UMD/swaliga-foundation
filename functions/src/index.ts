import { onMessagePublished } from "firebase-functions/v2/pubsub";
import { onDocumentCreated } from "firebase-functions/v2/firestore";

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

exports.setWatchRenewal = onDocumentCreated("surveys/{surveyId}", async (event) => {
  console.log(event);
})