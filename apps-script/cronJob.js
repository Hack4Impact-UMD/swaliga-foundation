function getRecentUpdates(surveyIds, timeAfter) {
  return {
    surveys: getUpdatedSurveyTitlesAndDescriptions_(surveyIds, timeAfter),
    responses: getRecentResponses_(surveyIds, timeAfter),
  };
}
