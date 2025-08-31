import { SurveyID } from "@/types/survey-types";

const MAX_TRIGGERS_PER_USER = 20;

function createNewSurvey(title: string, description: string): SurveyID {
  const survey = FormApp.create(title)
    .setDescription(description)
    .setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${title} - Responses`).getId()
    );
  addIdQuestion_(survey);
  survey.setCustomClosedFormMessage('This survey is no longer accepting responses. If you believe this is an error, please ask an administrator to open the survey on the Swaliga Survey portal.');
  survey.setAcceptingResponses(false);

  return {
    id: survey.getId(),
    name: title,
    description,
    responderUri: survey.getPublishedUrl(),
    linkedSheetId: survey.getDestinationId(),
    idQuestionEntryNumber: getIdQuestionEntryNumber_(survey),
    isActive: false
  };
}
globalThis.createNewSurvey = createNewSurvey;

function addExistingSurvey(surveyId: string) {
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
  survey.setAcceptingResponses(true);
  survey.setCustomClosedFormMessage('This survey is no longer accepting responses. If you believe this is an error, please ask an administrator to open the survey on the Swaliga Survey portal.');
  survey.setAcceptingResponses(false);

  return {
    survey: {
      id: surveyId,
      name: survey.getTitle(),
      description: survey.getDescription(),
      responderUri: survey.getPublishedUrl(),
      linkedSheetId: survey.getDestinationId(),
      idQuestionEntryNumber: getIdQuestionEntryNumber_(survey),
      isActive: false
    },
    responses: survey.getResponses().map((response) => mapResponseToGoogleFormResponse_(response, surveyId, idQuestionItem)),
  };
}
globalThis.addExistingSurvey = addExistingSurvey;

function activateSurvey(surveyId: string) {
  const survey = FormApp.openById(surveyId);
  const triggers = ScriptApp.getProjectTriggers();
  if (triggers.length === MAX_TRIGGERS_PER_USER) {
    throw new Error("Maximum number of triggers reached.");
  } else if (!triggers.some(trigger => trigger.getTriggerSourceId() === surveyId)) {
    ScriptApp.newTrigger("onFormSubmit_").forForm(survey).onFormSubmit().create();
  }
  survey.setAcceptingResponses(true);
}
globalThis.activateSurvey = activateSurvey;

function deactivateSurvey(surveyId: string) {
  const triggers = ScriptApp.getProjectTriggers().filter(trigger => trigger.getTriggerSourceId() === surveyId);
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
  FormApp.openById(surveyId).setAcceptingResponses(false);
}
globalThis.deactivateSurvey = deactivateSurvey;

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

function getIdQuestionItem_(items: GoogleAppsScript.Forms.Item[]) {
  return items.find((item) => item.getTitle() === "Swaliga ID");
}
globalThis.getIdQuestionItem_ = getIdQuestionItem_;

function getIdQuestionEntryNumber_(survey: GoogleAppsScript.Forms.Form): string {
  const idQuestionItem = getIdQuestionItem_(survey.getItems());
  const response = survey.createResponse();
  response.withItemResponse(idQuestionItem!.asTextItem().createResponse("0000000"));
  const link = response.toPrefilledUrl();
  const entryNumber = link.split('?')[1].split('&').find(param => param.startsWith('entry.'))!.split('=')[0].split('.')[1];
  return entryNumber;
}
globalThis.getIdQuestionEntryNumber_ = getIdQuestionEntryNumber_;

function getUpdatedSurveyTitlesAndDescriptions(surveyIds: string[], startTime: string) {
  const surveys: Pick<SurveyID, 'id' | 'name' | 'description'>[] = [];
  surveyIds.forEach((surveyId) => {
    const file = DriveApp.getFileById(surveyId);
    if (new Date(startTime).toString() !== 'Invalid Date' && startTime <= file.getLastUpdated().toISOString()) {
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
globalThis.getUpdatedSurveyTitlesAndDescriptions = getUpdatedSurveyTitlesAndDescriptions;

function deleteSurvey(surveyId: string) {
  const survey = FormApp.openById(surveyId);
  deactivateSurvey(surveyId);
  DriveApp.getFileById(survey.getPublishedUrl()).setTrashed(true);
  DriveApp.getFileById(surveyId).setTrashed(true);
}
globalThis.deleteSurvey = deleteSurvey;

function deleteSurveys(surveyIds: string[]) {
  surveyIds.forEach((surveyId) => deleteSurvey(surveyId));
}
globalThis.deleteSurveys = deleteSurveys;

export { };