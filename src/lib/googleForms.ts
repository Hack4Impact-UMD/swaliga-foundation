import { collection, doc, where, query, getDocs, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { forms } from "@/lib/googleAuthorization";
import { Response, Survey } from "@/types/survey-types";
import { User } from "@/types/user-types";


// Retrieve list of existing form responseIDs from firestore
async function getExistingResponseIds(collectionName: string, formId: string): Promise<string[]> {
    const firestoreResponses = await getDocs(query(collection(db, collectionName), where("formId", "==", formId)));
    return firestoreResponses.docs.map((doc) => doc.id);
}

// Called when a given form has a new response. Should be triggered by a watch.
export async function updateOnResponse(collectionName: string, formId: string) {
    // Retrieve form responses or empty array
    const googleResponses = await forms.forms.responses.list({ formId });
    const googleResponseData = googleResponses.data.responses || [];
    
    // Get existing response IDs from firestore
    const existingResponseIds = await getExistingResponseIds(collectionName, formId);

    // Loop through each response 
    for (const response of googleResponseData) {
        // Shouldn't be a runtime error hopefully(?) 
        // But maybe could have some error checking this seems suspicious idk
        const responseId = response.responseId as string;

        // Add response to firestore if it doesn't exist
        if (!existingResponseIds.includes(responseId)) {
            const docRef = doc(collection(db, collectionName));
            await setDoc(docRef, { formId, responseId, ...response });
            console.log(`Added response with ID: ${responseId}`);
        } 
    }
}

// Assign a survey to a student
export async function assignSurvey(userId: string, surveyId: string): Promise<void> {
    // Get the user's document from the users collection
    const userRef = doc(db, "users", userId);

    // Add the surveyId to the user's assignedSurveys array
    await updateDoc(userRef, {
        assignedSurveys: arrayUnion(surveyId)
    });

    console.log(`Survey ${surveyId} assigned to User ${userId}`);
}

// Unassign a survey from a student
export async function removeSurvey(userId: string, surveyId: string): Promise<void> {
    // Get the user's document from the users collection
    const userRef = doc(db, "users", userId);

    // Remove the surveyId from the user's assignedSurveys array
    await updateDoc(userRef, {
        assignedSurveys: arrayRemove(surveyId)
    });

    console.log(`Survey ${surveyId} removed from User ${userId}`);
}

// Adds a response to 1) a user and 2) a survey.
export async function addResponseToUser(userId: string, response: Response): Promise<void> {
    // Get the user's document from the users collection
    const userRef = doc(db, "users", userId);
  
    // Add the responseId to the user's completedResponses field
    await updateDoc(userRef, {
      completedResponses: arrayUnion(response.responseId)
    });
  
    // Get the survey's document from the surveys collection
    const surveyRef = doc(db, "surveys", response.formId);
  
    // Add the response object to the survey's responses
    await setDoc(surveyRef, { responses: arrayUnion(response) }, { merge: true });
  
    console.log(`Response ${response.responseId} added to user ${userId} and survey ${response.formId}`);
  }