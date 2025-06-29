function getRecentResponses_(surveyIds, timeAfter) {
  const recentResponses = [];
  surveyIds.forEach((surveyId) => {
    const idQuestionItem = getIdQuestionItem_(FormApp.openById(surveyId));
    const responses = FormApp.openById(surveyId).getResponses(
      new Date(timeAfter)
    );
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
