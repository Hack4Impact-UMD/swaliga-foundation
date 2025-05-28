import { db } from "../config/firebaseConfig";
import {
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  arrayRemove,
} from "firebase/firestore";
import { Response } from "@/types/survey-types";

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
    console.error("unable to get response");
    throw new Error("unable to get response");
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