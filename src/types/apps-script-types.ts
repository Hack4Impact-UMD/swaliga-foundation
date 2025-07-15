import { SurveyResponseStudentIdID, SurveyResponseStudentEmailID, SurveyResponseUnidentifiedID } from "./survey-types";

export type GoogleFormResponse = GoogleFormResponseUnidentified | GoogleFormResponseStudentId | GoogleFormResponseStudentEmail;
export type GoogleFormResponseUnidentified = Omit<SurveyResponseUnidentifiedID, 'id'>;
export type GoogleFormResponseStudentId = Omit<SurveyResponseStudentIdID, 'id' | 'assignedAt'>;
export type GoogleFormResponseStudentEmail = Omit<SurveyResponseStudentEmailID, 'id'>;
export function isGoogleFormResponseUnidentified(response: GoogleFormResponse): response is GoogleFormResponseUnidentified { return !('studentId' in response) && !('studentEmail' in response); }
export function isGoogleFormResponseStudentId(response: GoogleFormResponse): response is GoogleFormResponseStudentId { return 'studentId' in response; }
export function isGoogleFormResponseStudentEmail(response: GoogleFormResponse): response is GoogleFormResponseStudentEmail { return 'studentEmail' in response; }