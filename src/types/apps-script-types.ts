import { SurveyResponse } from "./survey-types";

export type GoogleFormResponse = GoogleFormResponseID | GoogleFormResponseEmail;
export type GoogleFormResponseID = Omit<SurveyResponse, 'assignedAt'>;
export type GoogleFormResponseEmail = Omit<SurveyResponse, 'assignedAt' | 'studentId'> & { studentEmail: string };
export function isGoogleFormResponseID(response: GoogleFormResponse): response is GoogleFormResponseID { return 'studentId' in response; }
export function isGoogleFormResponseEmail(response: GoogleFormResponse): response is GoogleFormResponseEmail { return 'studentEmail' in response; }