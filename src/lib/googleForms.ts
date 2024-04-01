import { collection, doc, where, query, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase/firebaseConfig";
import { forms } from "@/lib/googleAuthorization";

// Retrieve list of existing form responseIDs from firestore
async function getExistingResponseIds(collectionName: string, formId: string): Promise<string[]> {
    const firestoreResponses = await getDocs(query(collection(db, collectionName), where("formId", "==", formId)));
    return firestoreResponses.docs.map((doc) => doc.id);
}

// Called when a given form has a new response.
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