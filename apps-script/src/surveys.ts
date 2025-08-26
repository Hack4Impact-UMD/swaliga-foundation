import { SurveyID } from "@/types/survey-types";

function createNewSurvey(title: string, description: string): SurveyID {
  const survey = FormApp.create(title)
    .setDescription(description)
    .setDestination(
      FormApp.DestinationType.SPREADSHEET,
      SpreadsheetApp.create(`${title} - Responses`).getId()
    );
  addIdQuestion_(survey);
  installTrigger_(survey);

  return {
    id: survey.getId(),
    name: title,
    description,
    responderUri: survey.getPublishedUrl(),
    linkedSheetId: survey.getDestinationId(),
    idQuestionEntryNumber: getIdQuestionEntryNumber_(survey),
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

  const onFormSubmitTrigger = ScriptApp.getProjectTriggers().filter(trigger => trigger.getEventType() === ScriptApp.EventType.ON_FORM_SUBMIT && trigger.getTriggerSourceId() === surveyId)[0];
  if (!onFormSubmitTrigger) {
    installTrigger_(survey);
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
      idQuestionEntryNumber: getIdQuestionEntryNumber_(survey),
    },
    responses: survey.getResponses().map((response) => mapResponseToGoogleFormResponse_(response, surveyId, idQuestionItem)),
  };
}
globalThis.addExistingSurvey = addExistingSurvey;

function installTrigger_(survey: GoogleAppsScript.Forms.Form) {
  ScriptApp.newTrigger("onFormSubmit_").forForm(survey).onFormSubmit().create();
}
globalThis.installTrigger_ = installTrigger_;

function uninstallTrigger_(survey: GoogleAppsScript.Forms.Form) {
  const triggers = ScriptApp.getProjectTriggers().filter(trigger => trigger.getTriggerSourceId() === survey.getId());
  triggers.forEach(trigger => ScriptApp.deleteTrigger(trigger));
}
globalThis.uninstallTrigger_ = uninstallTrigger_;

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
  DriveApp.getFileById(surveyId).setTrashed(true);
}
globalThis.deleteSurvey = deleteSurvey;

function deleteSurveys(surveyIds: string[]) {
  surveyIds.forEach((surveyId) => deleteSurvey(surveyId));
}
globalThis.deleteSurveys = deleteSurveys;

export { };