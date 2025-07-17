import { ID } from "./utils";

export interface Survey {
  name: string;
  description: string;
  responderUri: string;
  linkedSheetId: string;
}
export interface SurveyID extends Survey, ID { }

export type Assignment = PendingAssignment | SurveyResponseUnidentified | SurveyResponseStudentId | SurveyResponseStudentEmail;
export type AssignmentID = PendingAssignmentID | SurveyResponseUnidentifiedID | SurveyResponseStudentIdID | SurveyResponseStudentEmailID;

export interface PendingAssignment {
  studentId: string;
  assignedAt: string; // ISO-8601
  responseId: null;
}
export interface PendingAssignmentID extends PendingAssignment, ID { surveyId: string; }

export interface SurveyResponseUnidentified {
  responseId: string;
  submittedAt: string; // ISO-8601
}
export interface SurveyResponseUnidentifiedID extends SurveyResponseUnidentified, ID { surveyId: string; }
export interface SurveyResponseStudentId extends SurveyResponseUnidentified { studentId: string; assignedAt?: string; /* ISO-8601 */ }
export interface SurveyResponseStudentIdID extends SurveyResponseStudentId, ID { surveyId: string; }
export interface SurveyResponseStudentEmail extends SurveyResponseUnidentified { studentEmail: string; }
export interface SurveyResponseStudentEmailID extends SurveyResponseStudentEmail, ID { surveyId: string; }

export function isPendingAssignmentID(assignment: AssignmentID): assignment is PendingAssignmentID { return !('responseId' in assignment); }
export function isSurveyResponseUnidentifiedID(assignment: AssignmentID): assignment is SurveyResponseUnidentifiedID { return !('studentId' in assignment) && !('studentEmail' in assignment); }
export function isSurveyResponseStudentIdID(assignment: AssignmentID): assignment is SurveyResponseStudentIdID { return 'studentId' in assignment && 'responseId' in assignment; }
export function isSurveyResponseStudentEmailID(assignment: AssignmentID): assignment is SurveyResponseStudentEmailID { return 'studentEmail' in assignment; }