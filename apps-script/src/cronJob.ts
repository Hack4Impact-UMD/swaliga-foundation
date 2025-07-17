function getRecentUpdates(surveyIds: string[], endTime: string, startTime?: string) {
  return {
    surveys: getUpdatedSurveyTitlesAndDescriptions_(surveyIds, startTime),
    responses: getRecentResponses_(surveyIds, endTime, startTime),
  };
}
globalThis.getRecentUpdates = getRecentUpdates;

export { };