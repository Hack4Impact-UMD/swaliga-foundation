import { GoogleFormResponse, GoogleFormResponseStudentEmail, GoogleFormResponseStudentId, GoogleFormResponseUnidentified } from "@/types/apps-script-types";

function mapResponseToGoogleFormResponse_(response: GoogleAppsScript.Forms.FormResponse, surveyId: string, idQuestionItem?: GoogleAppsScript.Forms.Item): GoogleFormResponse {
  let idQuestionResponse;
  if (idQuestionItem && (idQuestionResponse = response.getResponseForItem(idQuestionItem))) {
    return {
      surveyId,
      responseId: response.getId(),
      submittedAt: response.getTimestamp().toISOString(),
      studentId: idQuestionResponse.getResponse() as string,
      studentEmail: response.getRespondentEmail(),
    } satisfies GoogleFormResponseStudentId
  }
  return response.getRespondentEmail() ? {
    surveyId,
    responseId: response.getId(),
    submittedAt: response.getTimestamp().toISOString(),
    studentEmail: response.getRespondentEmail(),
  } satisfies GoogleFormResponseStudentEmail : {
    surveyId,
    responseId: response.getId(),
    submittedAt: response.getTimestamp().toISOString(),
    studentEmail: ""
  } satisfies GoogleFormResponseUnidentified
}
globalThis.mapResponseToGoogleFormResponse_ = mapResponseToGoogleFormResponse_;

function onFormSubmit_(e: GoogleAppsScript.Events.FormsOnFormSubmit) {
  
}
globalThis.onFormSubmit_ = onFormSubmit_;

export { };