import { ID } from "./utils";

export interface Survey {
  name: string;
  description: string;
  responderUri: string;
  linkedSheetId: string;
}
export interface SurveyID extends Survey, ID { }

export type Assignment = PendingAssignment | SurveyResponse;
export type AssignmentID = PendingAssignmentID | SurveyResponseID;

export interface PendingAssignment {
  studentId?: string; // missing value indicates a response from a form before the form was added to Firestore & either no way to identify the student or the student is not registered
  assignedAt?: string; // ISO-8601, missing value indicates a response from a form before the form was added to Firestore
}
export interface PendingAssignmentID extends PendingAssignment, ID { surveyId: string; }

export interface SurveyResponse extends PendingAssignment {
  responseId: string;
  submittedAt: string; // ISO-8601
}
export interface SurveyResponseID extends SurveyResponse, ID { surveyId: string; }

export function isPendingAssignmentID(assignment: AssignmentID): assignment is PendingAssignmentID { return !('responseId' in assignment); }
export function isSurveyResponseID(assignment: AssignmentID): assignment is SurveyResponseID { return 'responseId' in assignment; }