import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  deleteDoc,
  arrayRemove,
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

    // adds response to the user that completed the response
    const userRef = doc(db, "users", response.userId);
    await updateDoc(userRef, {
      completedResponses: arrayUnion(response.responseId),
      assignedSurveys: arrayRemove(response.formId)
    });

    // adds response to the survey that it is a response to
    const surveyRef = doc(db, "surveys", response.formId);
    await updateDoc(surveyRef, {
      responseIds: arrayUnion(response.responseId),
      assignedUsers: arrayRemove(response.userId),
    });
  } catch (error) {
    console.error("Error creating response:", error);
    console.log('error', error);
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

export async function deleteResponseByID(responseId: string) {
  try {
    const response = await getResponseByID(responseId);
    if (!response) {
      throw Error("response with given id not found");
    }
    await updateDoc(doc(db, "surveys", response.formId), {
      responseIds: arrayRemove(responseId),
    })
    await deleteDoc(doc(db, "responses", responseId));
  } catch (err) {
    throw Error("unable to delete response");
  }
}