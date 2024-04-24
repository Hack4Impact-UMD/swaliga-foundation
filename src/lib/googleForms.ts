import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { forms } from "@/lib/googleAuthorization";
import { GoogleFormResponse, Response } from "@/types/survey-types";
import { getSurveyByID } from "./firebase/database/surveys";
import { createResponse } from "./firebase/database/response";

// Called when a given form has a new response. Should be triggered by a watch.
export async function newResponseHandler(userId: string, formId: string) {
    // Retrieve form responses or empty array
    const googleResponses = await forms.forms.responses.list({ formId });
    const googleResponseData = googleResponses.data.responses as GoogleFormResponse[] || [];
    
    // Get existing response IDs from firestore
    const form = await getSurveyByID(formId)
    const existingResponseIds = form?.responseIds;

    // Loop through each response 
    for (const response of googleResponseData) {
        // Shouldn't be a runtime error hopefully(?) 
        // But maybe could have some error checking this seems suspicious idk
        const updatedResponse: Response = { ...response, formId, userId };
        const responseId = response.responseId;
        
        // Add response to firestore if it doesn't exist
        if (!existingResponseIds?.includes(responseId)) {
            await createResponse(updatedResponse);
            await addResponseToUser(updatedResponse);
            console.log(`Added response with ID: ${responseId}`);
        } 
    }
}

// TODO: Call this on watch endpoint
// Adds a response to 1) a user and 2) a survey.
export async function addResponseToUser(response: Response): Promise<void> {
    // Get the user's document from the users collection
    const userRef = doc(db, "users", response.userId);
    // Add the responseId to the user's completedResponses field
    await updateDoc(userRef, {
      completedResponses: arrayUnion(response.responseId)
    });
    // Get the survey's document from the surveys collection
    const surveyRef = doc(db, "surveys", response.formId);
    // Add the response object to the survey's responses
    await updateDoc(surveyRef, { responseIds: arrayUnion(response.responseId) });
    console.log(`Response ${response.responseId} added to user ${response.userId} and survey ${response.formId}`);
  }