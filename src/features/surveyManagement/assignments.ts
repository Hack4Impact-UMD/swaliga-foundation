import { db, functions } from "@/config/firebaseConfig";
import { Collection } from "@/data/firestore/utils";
import { AssignmentID } from "@/types/survey-types";
import { doc, writeBatch, WriteBatch } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

export async function assignSurveys(studentIds: string[], surveyIds: string[]) {
  try {
    await httpsCallable(functions, 'assignSurveys')({ studentIds, surveyIds });
  } catch (error) {
    throw new Error("Failed to assign surveys")
  }
}

export async function unassignSurveys(assignments: AssignmentID[]) {
  try {
    const batch: WriteBatch = writeBatch(db);
    assignments.forEach((assignment: AssignmentID) => batch.delete(doc(db, Collection.SURVEYS, assignment.surveyId, Collection.ASSIGNMENTS, assignment.id)));
    await batch.commit();
  } catch (error) {
    throw new Error("Failed to unassign surveys");
  }
}
