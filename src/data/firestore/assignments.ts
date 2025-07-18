import { Assignment, AssignmentID } from "@/types/survey-types";
import { db } from "../../config/firebaseConfig";
import { getDoc, doc, updateDoc, deleteDoc, Transaction, WriteBatch } from "firebase/firestore";
import { Collection } from "./utils";
import { v4 as uuid } from "uuid";

export async function getAssignmentById(surveyId: string, assignmentId: string, transaction?: Transaction): Promise<AssignmentID> {
  const assignmentRef = doc(db, Collection.SURVEYS, surveyId, Collection.ASSIGNMENTS, assignmentId);
  let assignmentDoc;
  try {
    assignmentDoc = await (transaction ? transaction.get(assignmentRef) : getDoc(assignmentRef));
  } catch (error) {
    throw new Error("Failed to get assignment");
  }
  if (!assignmentDoc.exists()) {
    throw new Error("Assignment not found");
  }
  return {
    id: assignmentDoc.id,
    surveyId,
    ...assignmentDoc.data(),
  } as AssignmentID;
}

export async function createAssignment(surveyId: string, assignment: Assignment, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const assignmentId = uuid();
    const assignmentRef = doc(db, Collection.SURVEYS, surveyId, Collection.ASSIGNMENTS, assignmentId);
    // @ts-ignore
    await (instance ? instance.set(assignmentRef, assignment) : setDoc(assignmentRef, assignment));
  } catch (error) {
    throw new Error("Failed to create assignment");
  }
}

export async function updateAssignment(surveyId: string, assignmentId: string, updates: Partial<Assignment>, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const assignmentRef = doc(db, Collection.SURVEYS, surveyId, Collection.ASSIGNMENTS, assignmentId);
    // @ts-ignore
    await (instance ? instance.update(assignmentRef, updates) : updateDoc(assignmentRef, updates));
  } catch (error) {
    throw new Error("Failed to update assignment");
  }
}

export async function deleteAssignment(surveyId: string, assignmentId: string, instance?: Transaction | WriteBatch): Promise<void> {
  try {
    const assignmentRef = doc(db, Collection.SURVEYS, surveyId, Collection.ASSIGNMENTS, assignmentId);
    // @ts-ignore
    await (instance ? instance.delete(assignmentRef) : deleteDoc(assignmentRef));
  } catch (error) {
    throw new Error("Failed to delete assignment");
  }
}