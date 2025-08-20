import { SurveyResponseStudentIdID, SurveyResponseStudentEmailID, SurveyResponseUnidentifiedID } from "./survey-types";

export type GoogleFormResponse = GoogleFormResponseUnidentified | GoogleFormResponseStudentId | GoogleFormResponseStudentEmail;
export type GoogleFormResponseUnidentified = Omit<SurveyResponseUnidentifiedID, 'id'> & { studentEmail: "" };
export type GoogleFormResponseStudentId = Omit<SurveyResponseStudentIdID, 'id' | 'assignedAt'> & { studentEmail: string };
export type GoogleFormResponseStudentEmail = Omit<SurveyResponseStudentEmailID, 'id'>;
export function isGoogleFormResponseUnidentified(response: GoogleFormResponse): response is GoogleFormResponseUnidentified { return response.studentEmail === ""; }
export function isGoogleFormResponseStudentId(response: GoogleFormResponse): response is GoogleFormResponseStudentId { return 'studentId' in response; }
export function isGoogleFormResponseStudentEmail(response: GoogleFormResponse): response is GoogleFormResponseStudentEmail { return response.studentEmail !== "" && !('studentId' in response); }