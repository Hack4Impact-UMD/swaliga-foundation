function createNewSurvey(title, description) {
  const survey = FormApp.create(title)
    .setDescription(description)
    .setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${title} - Responses`).getId()
    );
  setDefaultSurveySettings(survey);
  addIdQuestion(survey);
  return {
    id: survey.getId(),
    title,
    description,
    responderUri: survey.getPublishedUrl(),
    linkedSheetId: survey.getDestinationId(),
  };
}

function addExistingSurvey(surveyId) {
  const survey = FormApp.openById(surveyId);
  try {
    survey.getDestinationId();
  } catch (error) {
    survey.setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${survey.getTitle()} - Responses`).getId()
    );
  }
  setDefaultSurveySettings(survey);

  const items = survey.getItems();
  if (items.length === 0 || items[0].getTitle() !== "Swaliga ID") {
    addIdQuestion(survey);
  }

  const responses = survey.getResponses().map((response) => {
    return {
      surveyId,
      responseId: response.getId(),
      submittedAt: response.getTimestamp().toISOString(),
      studentEmail: response.getRespondentEmail(),
    };
  });
  return {
    survey: {
      id: surveyId,
      title: survey.getTitle(),
      description: survey.getDescription(),
      responderUri: survey.getPublishedUrl(),
      linkedSheetId: survey.getDestinationId(),
    },
    responses,
  };
}

function addIdQuestion(survey) {
  const idQuestion = survey
    .addTextItem()
    .setTitle("Swaliga ID")
    .setHelpText(
      "This is the ID number displayed on your profile page on the Swaliga Foundation survey portal."
    )
    .setRequired(true)
    .setValidation(
      FormApp.createTextValidation()
        .requireTextMatchesPattern("^\\d{7}$")
        .setHelpText("Please enter a valid Swaliga ID number (7 digits).")
        .build()
    );
  const pageBreak = survey.addPageBreakItem();
  survey.moveItem(idQuestion, 0);
  survey.moveItem(pageBreak, 1);
}

function setDefaultSurveySettings(survey) {
  survey.setCollectEmail(true).setProgressBar(false);
}

function deleteSurvey(surveyId) {
  FormApp.openById(surveyId).deleteForm();
}

function deleteSurveys(surveyIds) {
  surveyIds.forEach((surveyId) => deleteSurvey(surveyId));
}
