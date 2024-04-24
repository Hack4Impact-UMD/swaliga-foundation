import { PubSub } from "@google-cloud/pubsub";
import { newResponseHandler } from "@/lib/googleForms";
import { updateSurvey } from "./firebase/database/surveys";

export const pubSubClient = new PubSub();

export function listenForMessages()  {
  const subscription = pubSubClient.subscription("forms-sub");

  const messageHandler = (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

    if (message.attributes.eventType === "RESPONSES") {
      // TODO: update userId input using currently logged in user
      newResponseHandler("1111111111", message.attributes.formId);
    } else {
      updateSurvey(message.attributes.formId);
    }

    message.ack();
  };

  subscription.on("message", messageHandler);
  console.log('Listening for PubSub messages');
}