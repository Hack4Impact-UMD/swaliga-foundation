function createNewSurvey(title, description) {
  const survey = FormApp.create(title);
  survey.setDescription(description);
  return {
    id: survey.getId(),
    title,
    description,
    responderUri: survey.getPublishedUrl(),
    linkedSheetId: survey.getDestinationId(),
  };
}

function addExistingSurvey(surveyId) {}

function deleteSurvey(surveyId) {
  FormApp.openById(surveyId).deleteForm();
}

function deleteSurveys(surveyIds) {
  surveyIds.forEach((surveyId) => deleteSurvey(surveyId));
}
