import { SurveyID } from "@/types/survey-types";

function createNewSurvey(title: string, description: string): SurveyID {
  const survey = FormApp.create(title)
    .setDescription(description)
    .setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${title} - Responses`).getId()
    );
  addIdQuestion_(survey);
  return {
    id: survey.getId(),
    name: title,
    description,
    responderUri: survey.getPublishedUrl(),
    linkedSheetId: survey.getDestinationId(),
  };
}
globalThis.createNewSurvey = createNewSurvey;

function addExistingSurvey(surveyId: string, endTime?: string) {
  const survey = FormApp.openById(surveyId);
  try {
    survey.getDestinationId();
  } catch (error) {
    survey.setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${survey.getTitle()} - Responses`).getId()
    );
  }

  const items = survey.getItems();
  let idQuestionItem = undefined;
  if (items.length === 0 || !(idQuestionItem = getIdQuestionItem_(items))) {
    addIdQuestion_(survey);
  }

  return {
    survey: {
      id: surveyId,
      name: survey.getTitle(),
      description: survey.getDescription(),
      responderUri: survey.getPublishedUrl(),
      linkedSheetId: survey.getDestinationId(),
    } as SurveyID,
    responses: (endTime ? survey.getResponses().filter(response => response.getTimestamp().toISOString() < endTime) : survey.getResponses()).map((response) => mapResponseToGoogleFormResponse(response, surveyId, idQuestionItem)),
  };
}
globalThis.addExistingSurvey = addExistingSurvey;

function addIdQuestion_(survey: GoogleAppsScript.Forms.Form) {
  const idQuestion = survey
    .addTextItem()
    .setTitle("Swaliga ID")
    .setHelpText(
      "This is the ID number displayed on your profile page on the Swaliga Foundation survey portal. If you don't have an account, please create one at http://localhost:3000."
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
globalThis.addIdQuestion_ = addIdQuestion_;

function getUpdatedSurveyTitlesAndDescriptions_(surveyIds: string[], startTime?: string) {
  const surveys: Pick<SurveyID, 'id' | 'name' | 'description'>[] = [];
  surveyIds.forEach((surveyId) => {
    const file = DriveApp.getFileById(surveyId);
    if (!startTime || startTime <= file.getLastUpdated().toISOString()) {
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
globalThis.getUpdatedSurveyTitlesAndDescriptions_ = getUpdatedSurveyTitlesAndDescriptions_;

function getIdQuestionItem_(items: GoogleAppsScript.Forms.Item[]) {
  return items.find((item) => item.getTitle() === "Swaliga ID");
}
globalThis.getIdQuestionItem_ = getIdQuestionItem_;

// function deleteSurvey(surveyId: string) {
// FormApp.openById(surveyId);
// }
//
// function deleteSurveys(surveyIds) {
// surveyIds.forEach((surveyId) => deleteSurvey(surveyId));
// }

export { };