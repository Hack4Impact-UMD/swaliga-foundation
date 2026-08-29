import z from "zod";
import { IDSchema } from "./utils";

export const SurveySchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  responderUri: z.url(),
  linkedSheetId: z.string().min(1).optional(),
  idQuestionEntryNumber: z.number(),
  isActive: z.boolean()
})
export type Survey = z.infer<typeof SurveySchema>;

export const SurveyIDSchema = z.intersection(SurveySchema, IDSchema);
export type SurveyID = z.infer<typeof SurveyIDSchema>;

export const PendingAssignmentSchema = z.object({
  studentId: z.string(),
  assignedAt: z.iso.datetime(),
  responseId: z.null()
});
export type PendingAssignment = z.infer<typeof PendingAssignmentSchema>;

export const PendingAssignmentIDSchema = z.intersection(PendingAssignmentSchema, z.intersection(IDSchema, z.object({ surveyId: z.string().min(1) })));
export type PendingAssignmentID = z.infer<typeof PendingAssignmentIDSchema>;

export const SurveyResponseUnidentifiedSchema = z.strictObject({
  responseId: z.string().min(1),
  submittedAt: z.iso.datetime()
});
export type SurveyResponseUnidentified = z.infer<typeof SurveyResponseUnidentifiedSchema>;

export const SurveyResponseUnidentifiedIDSchema = SurveyResponseUnidentifiedSchema.extend(IDSchema.shape).extend({
  surveyId: z.string().min(1)
});
export type SurveyResponseUnidentifiedID = z.infer<typeof SurveyResponseUnidentifiedIDSchema>;

export const SurveyResponseStudentIdSchema = SurveyResponseUnidentifiedSchema.safeExtend({
  studentId: z.coerce.number().min(1000000).transform((val) => val.toString()),
  assignedAt: z.iso.datetime().optional()
});
export type SurveyResponseStudentId = z.infer<typeof SurveyResponseStudentIdSchema>;

export const SurveyResponseStudentIdIDSchema = SurveyResponseStudentIdSchema.extend(IDSchema.shape).extend({
  surveyId: z.string().min(1)
});
export type SurveyResponseStudentIdID = z.infer<typeof SurveyResponseStudentIdIDSchema>;

export const SurveyResponseStudentEmailSchema = SurveyResponseUnidentifiedSchema.extend({
  studentEmail: z.email()
});
export type SurveyResponseStudentEmail = z.infer<typeof SurveyResponseStudentEmailSchema>;

export const SurveyResponseStudentEmailIDSchema = SurveyResponseStudentEmailSchema.extend(IDSchema.shape).extend({
  surveyId: z.string().min(1)
});
export type SurveyResponseStudentEmailID = z.infer<typeof SurveyResponseStudentEmailIDSchema>;

export const SurveyResponseSchema = z.union([SurveyResponseUnidentifiedSchema, SurveyResponseStudentIdSchema, SurveyResponseStudentEmailSchema]);
export type SurveyResponse = z.infer<typeof SurveyResponseSchema>;

export const SurveyResponseIDSchema = z.union([SurveyResponseUnidentifiedIDSchema, SurveyResponseStudentIdIDSchema, SurveyResponseStudentEmailIDSchema]);
export type SurveyResponseID = z.infer<typeof SurveyResponseIDSchema>;

export const AssignmentSchema = z.union([PendingAssignmentSchema, SurveyResponseSchema]);
export type Assignment = z.infer<typeof AssignmentSchema>;

export const AssignmentIDSchema = z.union([PendingAssignmentIDSchema, SurveyResponseIDSchema]);
export type AssignmentID = z.infer<typeof AssignmentIDSchema>;

export function isPendingAssignmentID(assignment: AssignmentID): assignment is PendingAssignmentID { return assignment.responseId === null; }
export function isSurveyResponseID(assignment: AssignmentID): assignment is SurveyResponseID { return assignment.responseId !== null; }

export function isSurveyResponseUnidentifiedID(assignment: AssignmentID | SurveyResponseID): assignment is SurveyResponseUnidentifiedID { return !('studentId' in assignment) && !('studentEmail' in assignment); }
export function isSurveyResponseStudentIdID(assignment: AssignmentID | SurveyResponseID): assignment is SurveyResponseStudentIdID { return 'studentId' in assignment && 'responseId' in assignment; }
export function isSurveyResponseStudentEmailID(assignment: AssignmentID | SurveyResponseID): assignment is SurveyResponseStudentEmailID { return 'studentEmail' in assignment; }