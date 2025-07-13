function createNewSurvey(title, description) {
  const survey = FormApp.create(title)
    .setDescription(description)
    .setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${title} - Responses`).getId()
    );
  setDefaultSurveySettings_(survey);
  addIdQuestion_(survey);
  return {
    id: survey.getId(),
    name: title,
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
  setDefaultSurveySettings_(survey);

  const items = survey.getItems();
  if (items.length === 0 || !getIdQuestionItem_(items)) {
    addIdQuestion_(survey);
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
      name: survey.getTitle(),
      description: survey.getDescription(),
      responderUri: survey.getPublishedUrl(),
      linkedSheetId: survey.getDestinationId(),
    },
    responses,
  };
}

function addIdQuestion_(survey) {
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
  survey.moveItem(idQuestion.getIndex(), 0);
  survey.moveItem(pageBreak.getIndex(), 1);
}

function setDefaultSurveySettings_(survey) {
  survey.setCollectEmail(true).setProgressBar(false);
}

function getUpdatedSurveyTitlesAndDescriptions_(surveyIds, timeAfter) {
  const surveys = [];
  surveyIds.forEach((surveyId) => {
    const file = DriveApp.getFileById(surveyId);
    if (timeAfter <= file.getLastUpdated().toISOString()) {
      const survey = FormApp.openById(surveyId);
      surveys.push({
        id: surveyId,
        name: survey.getTitle(),
        description: survey.getDescription(),
      });
    }
  });
  return surveys;
}

function getIdQuestionItem_(items) {
  return items.find((item) => item.getTitle() === "Swaliga ID");
}

function deleteSurvey(surveyId) {
  FormApp.openById(surveyId).deleteForm();
}

function deleteSurveys(surveyIds) {
  surveyIds.forEach((surveyId) => deleteSurvey(surveyId));
}