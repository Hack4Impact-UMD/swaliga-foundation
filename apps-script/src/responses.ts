import { GoogleFormResponse, GoogleFormResponseStudentEmail, GoogleFormResponseStudentId, GoogleFormResponseUnidentified } from "@/types/apps-script-types";

function mapResponseToGoogleFormResponse(response: GoogleAppsScript.Forms.FormResponse, surveyId: string, idQuestionItem?: GoogleAppsScript.Forms.Item): GoogleFormResponse {
  let idQuestionResponse;
  if (idQuestionItem && (idQuestionResponse = response.getResponseForItem(idQuestionItem))) {
    return {
      surveyId,
      responseId: response.getId(),
      submittedAt: response.getTimestamp().toISOString(),
      studentId: idQuestionResponse.getResponse() as string,
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

function getRecentResponses_(surveyIds: string[], endTime: string, startTime?: string) {
  const recentResponses: GoogleFormResponse[] = [];
  surveyIds.forEach((surveyId) => {
    const survey = FormApp.openById(surveyId);
    const idQuestionItem = getIdQuestionItem_(survey.getItems());
    const responses = (startTime ? survey.getResponses(new Date(startTime)) : survey.getResponses()).filter(response => response.getTimestamp().toISOString() < endTime);
    recentResponses.push(...responses.map((response) => mapResponseToGoogleFormResponse(response, surveyId, idQuestionItem)));
  });
  return recentResponses;
}
globalThis.getRecentResponses_ = getRecentResponses_;

export { };