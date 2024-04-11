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

// TODO: Change assignSurvey parameters to take in lists of strings
//   - Will be in body of request parameter
// Both POSTs
// Assign a survey to a student

// Assign one survey to a student

export async function assignSurveys(userIds: string[], surveyIds: string[]): Promise<void> {
    // Assign a list of surveys to a list of students
    for (const userId of userIds) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            assignedSurveys: arrayUnion(...surveyIds)
        });

        console.log(`Surveys ${surveyIds} assigned to User ${userId}`);
        // If user already added don't do nothing/remove..
        // TODO Make this both ways...get this done by tomorrow.
    }

    // Assign a list of students to a list of surveys
    for (const surveyId of surveyIds) {
        const surveyRef = doc(db, "surveys", surveyId);
        await updateDoc(surveyRef, {
            assignedUsers: arrayUnion(...userIds)
        });

        console.log(`Users ${userIds} assigned to Survey ${surveyId}`);
    }
}

export async function removeSurveys(userIds: string[], surveyIds: string[]): Promise<void> {
    // Unassign a list of surveys from a list of students.
    for (const userId of userIds) {
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            assignedSurveys: arrayRemove(...surveyIds)
        });
        
        console.log(`Surveys ${surveyIds} removed from User ${userId}`);
    }

    // Unassign a list of students from a list of surveys
    for (const surveyId of surveyIds) {
        const surveyRef = doc(db, "surveys", surveyId);
        await updateDoc(surveyRef, {
            assignedUsers: arrayRemove(...userIds)
        });

        console.log(`Users ${userIds} removed from Survey ${surveyId}`);
    }
}

// TODO: Call this on watch endpoint
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