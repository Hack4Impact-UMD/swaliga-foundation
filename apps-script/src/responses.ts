import { GoogleFormResponse, GoogleFormResponseStudentEmail, GoogleFormResponseStudentId, GoogleFormResponseUnidentified } from "@/types/apps-script-types";

function mapResponseToGoogleFormResponse(response: GoogleAppsScript.Forms.FormResponse, surveyId: string, idQuestionItem?: GoogleAppsScript.Forms.Item): GoogleFormResponse {
  if (idQuestionItem) {
    return {
      surveyId,
      responseId: response.getId(),
      submittedAt: response.getTimestamp().toISOString(),
      studentId: response.getResponseForItem(idQuestionItem).getResponse() as string,
    } as GoogleFormResponseStudentId
  }
  return response.getRespondentEmail() ? {
    surveyId,
    responseId: response.getId(),
    submittedAt: response.getTimestamp().toISOString(),
    studentEmail: response.getRespondentEmail(),
  } as GoogleFormResponseStudentEmail : {
    surveyId,
    responseId: response.getId(),
    submittedAt: response.getTimestamp().toISOString(),
  } as GoogleFormResponseUnidentified
}
globalThis.mapResponseToGoogleFormResponse = mapResponseToGoogleFormResponse;

function getRecentResponses_(surveyIds: string[], timeAfter: string) {
  const recentResponses: GoogleFormResponse[] = [];
  surveyIds.forEach((surveyId) => {
    const survey = FormApp.openById(surveyId);
    const idQuestionItem = getIdQuestionItem_(survey.getItems());
    const responses = survey.getResponses(new Date(timeAfter));
    recentResponses.push(...responses.map((response) => mapResponseToGoogleFormResponse(response, surveyId, idQuestionItem)));
  });
  return recentResponses;
}
globalThis.getRecentResponses_ = getRecentResponses_;

export { };