export interface Survey {
  id: string;
  name: string;
  responderUri: string;
  linkedSheetId?: string;
}

export interface SurveyAssignment {
  id: string;
  surveyId: string;
  assignedAt: string; // ISO-8601
}

export interface SurveyResponse extends SurveyAssignment {
  responseId: string;
  submittedAt: string; // ISO-8601
}