function getRecentUpdates(surveyIds: string[], timeAfter: string) {
  return {
    surveys: getUpdatedSurveyTitlesAndDescriptions_(surveyIds, timeAfter),
    responses: getRecentResponses_(surveyIds, timeAfter),
  };
}
globalThis.getRecentUpdates = getRecentUpdates;

export { };