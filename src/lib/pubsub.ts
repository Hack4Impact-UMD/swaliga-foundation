import { PubSub } from "@google-cloud/pubsub";
import { updateOnResponse } from "@/lib/googleForms";

export const pubSubClient = new PubSub();

export function listenForMessages() {
  const subscription = pubSubClient.subscription("forms-sub");

  const messageHandler = (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

    // Determine what type of message this is
    console.log("Further message info:");
    if (
      message.attributes.eventType === "RESPONSES" &&
      message.attributes.watchId === "some-watch" &&
      message.attributes.formId ===
      "1_lKj7OZZ7PAxiyP4BaCyYk8o0Oa3KSWogxYFyIFzNTI"
    ) {
      // Acknowledge watch trigger and update firestore database accordingly
      console.log(
        `${message.attributes.watchId} triggered on form response submission.`
      );

      updateOnResponse('gavin-form-testing', message.attributes.formId);
    } else {
      // Not much to do here...
      console.log("Unknown pubsub message");
    }

    message.ack();
  };

  subscription.on("message", messageHandler);
}