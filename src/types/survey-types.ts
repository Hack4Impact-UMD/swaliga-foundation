import { ID } from "./utils";

export interface Survey {
  name: string;
  description?: string;
  responderUri: string;
  linkedSheetId?: string;
}
export interface SurveyID extends Survey, ID { }

export type Assignment = PendingAssignment | SurveyResponse;
export type AssignmentID = PendingAssignmentID | SurveyResponseID;

export interface PendingAssignment {
  surveyId: string;
  assignedAt: string; // ISO-8601
}
export interface PendingAssignmentID extends PendingAssignment, ID { studentId: string; }

export interface SurveyResponse extends PendingAssignment {
  responseId: string;
  submittedAt: string; // ISO-8601
}
export interface SurveyResponseID extends SurveyResponse, ID { studentId: string; }