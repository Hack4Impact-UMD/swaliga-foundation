import { PubSub } from "@google-cloud/pubsub";

export const pubSubClient = new PubSub();

export function listenForMessages() {
  const subscription = pubSubClient.subscription('forms-sub');

  const messageHandler = (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

    message.ack();
  };

  subscription.on('message', messageHandler);
}