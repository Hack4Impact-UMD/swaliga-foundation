import { PubSub } from "@google-cloud/pubsub";
import { getSurveyByID, updateSurvey } from "./firebase/database/surveys";
import { forms } from "./googleAuthorization";
import { GoogleFormResponse, Response, Survey } from "@/types/survey-types";
import { createResponse } from "./firebase/database/response";

export const pubSubClient = new PubSub();

export function listenForMessages()  {
  const subscription = pubSubClient.subscription("forms-sub");

  const messageHandler = (message: any) => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${JSON.stringify(message.attributes)}`);

    if (message.attributes.eventType === "RESPONSES") {
      // TODO: update userId input using currently logged in user
      newResponseHandler(message.attributes.formId);
    } else {
      updateSurvey(message.attributes.formId);
    }

    message.ack();
  };

  subscription.on("message", messageHandler);
  console.log('Listening for PubSub messages');
}

async function newResponseHandler(formId: string) {
  // Retrieve form responses or empty array
  const googleResponses = await forms.forms.responses.list({ formId });
  const googleResponseData =
    (googleResponses.data.responses as GoogleFormResponse[]) || [];

  // Get existing response IDs from firestore
  const form = await getSurveyByID(formId);
  const existingResponseIds = form?.responseIds;

  // Loop through each response
  for (const response of googleResponseData) {
    // Shouldn't be a runtime error hopefully(?)
    // But maybe could have some error checking this seems suspicious idk

    // Add response to firestore if it doesn't exist
    if (!existingResponseIds?.includes(response.responseId)) {
      const survey: Survey = await getSurveyByID(formId) as Survey;
      const formTitle = survey.info.title;
      const userId = (response.answers[survey.swaligaIdQuestionId] as any).textAnswers.answers[0].value;
      
      const updatedResponse: Response = { ...response, formId, userId, formTitle };
      await createResponse(updatedResponse);
      console.log(`Added response with ID: ${response.responseId}`);
    }
  }
}