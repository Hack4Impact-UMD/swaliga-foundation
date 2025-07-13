function getRecentResponses_(surveyIds, timeAfter) {
  const recentResponses = [];
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
              studentId: parseInt(
                response.getResponseForItem(idQuestionItem).getResponse()
              ),
            }
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
