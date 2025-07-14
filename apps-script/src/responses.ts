import { GoogleFormResponse, GoogleFormResponseID } from "@/types/apps-script-types";

function getRecentResponses_(surveyIds: string[], timeAfter: string) {
  const recentResponses: GoogleFormResponse[] = [];
  surveyIds.forEach((surveyId) => {
    const survey = FormApp.openById(surveyId);
    const idQuestionItem = getIdQuestionItem_(survey.getItems());
    const responses = survey.getResponses(new Date(timeAfter));
    recentResponses.push(
      ...responses.map((response) => {
        return idQuestionItem
          ? {
            surveyId,
            responseId: response.getId(),
            submittedAt: response.getTimestamp().toISOString(),
            studentId: response.getResponseForItem(idQuestionItem).getResponse() as string,
            bruh: "<bruh>"
          } as GoogleFormResponseID
          : {
            surveyId,
            responseId: response.getId(),
            submittedAt: response.getTimestamp().toISOString(),
            studentEmail: response.getRespondentEmail(),

          };
      })
    );
  });
  return recentResponses;
}
globalThis.getRecentResponses_ = getRecentResponses_;

export { };