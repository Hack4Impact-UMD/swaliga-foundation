import z from "zod";
import { SurveyResponseStudentIdID, SurveyResponseStudentEmailID, SurveyResponseUnidentifiedID, SurveyResponseUnidentifiedIDSchema, SurveyResponseStudentIdIDSchema, SurveyResponseStudentEmailIDSchema } from "./survey-types";

export const GoogleFormResponseUnidentifiedSchema = SurveyResponseUnidentifiedIDSchema.omit({ id: true }).extend({ studentEmail: z.literal("") });
export type GoogleFormResponseUnidentified = z.infer<typeof GoogleFormResponseUnidentifiedSchema>;

export const GoogleFormResponseStudentIdSchema = SurveyResponseStudentIdIDSchema.omit({ id: true, assignedAt: true }).extend({ studentEmail: z.email() });
export type GoogleFormResponseStudentId = z.infer<typeof GoogleFormResponseStudentIdSchema>;

export const GoogleFormResponseStudentEmailSchema = SurveyResponseStudentEmailIDSchema.omit({ id: true });
export type GoogleFormResponseStudentEmail = z.infer<typeof GoogleFormResponseStudentEmailSchema>;

export const GoogleFormResponseSchema = z.union([GoogleFormResponseUnidentifiedSchema, GoogleFormResponseStudentIdSchema, GoogleFormResponseStudentEmailSchema]);
export type GoogleFormResponse = z.infer<typeof GoogleFormResponseSchema>;

export function isGoogleFormResponseUnidentified(response: GoogleFormResponse): response is GoogleFormResponseUnidentified { return response.studentEmail === ""; }
export function isGoogleFormResponseStudentId(response: GoogleFormResponse): response is GoogleFormResponseStudentId { return 'studentId' in response; }
export function isGoogleFormResponseStudentEmail(response: GoogleFormResponse): response is GoogleFormResponseStudentEmail { return response.studentEmail !== "" && !('studentId' in response); }