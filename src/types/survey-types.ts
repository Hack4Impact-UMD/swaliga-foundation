import { ID } from "./utils";

export interface Survey {
  name: string;
  responderUri: string;
  linkedSheetId?: string;
}
export interface SurveyID extends Survey, ID { }

export interface SurveyAssignment {
  surveyId: string;
  assignedAt: string; // ISO-8601
}
export interface SurveyAssignmentID extends SurveyAssignment, ID { studentId: string; }

export interface SurveyResponse extends SurveyAssignment {
  responseId: string;
  submittedAt: string; // ISO-8601
}
export interface SurveyResponseID extends SurveyResponse, ID { studentId: string; }