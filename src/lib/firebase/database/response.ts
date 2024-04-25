import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { Response } from "@/types/survey-types";

// GET all responses
export async function getAllResponses() {
  try {
    const responsesSnapshot = await getDocs(collection(db, "responses"));
    const allResponses: Response[] = [];
    responsesSnapshot.forEach((doc) => {
      allResponses.push(doc.data() as Response);
    });
    return allResponses;
  } catch (error) {
    console.error("Error getting responses:", error);
    throw new Error("unable to get responses");
  }
}

export async function createResponse(response: Response) {
  try {
    await setDoc(doc(db, "responses", response.responseId), response);

    const userRef = doc(db, "users", response.userId);
    await updateDoc(userRef, {
      completedResponses: arrayUnion(response.responseId),
    });

    const surveyRef = doc(db, "surveys", response.formId);
    await updateDoc(surveyRef, {
      responseIds: arrayUnion(response.responseId),
    });
    console.log(
      `Response ${response.responseId} added to user ${response.userId} and survey ${response.formId}`
    );
  } catch (error) {
    console.error("Error creating response:", error);
    throw new Error("unable to create response");
  }
}
export async function getResponseByID(
  responseId: string
): Promise<Response | null> {
  try {
    const responseDoc = await getDoc(doc(db, "responses", responseId));
    if (responseDoc.exists()) {
      return responseDoc.data() as Response;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error getting response by ID:", error);
    throw new Error("unable to get response by id");
  }
}
