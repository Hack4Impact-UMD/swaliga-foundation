import { SurveyID } from '@/types/survey-types';
import { GoogleFormResponse } from '@/types/apps-script-types';

declare global {
  // cronJob.js
  var getRecentUpdates: (surveyIds: string[], endTime: string, startTime?: string) => {
    surveys: Pick<SurveyID, 'id' | 'name' | 'description'>[];
    responses: GoogleFormResponse[];
  }

  // responses.ts
  var getRecentResponses_: (surveyIds: string[], endTime: string, startTime?: string) => GoogleFormResponse[];
  var mapResponseToGoogleFormResponse_: (response: GoogleAppsScript.Forms.FormResponse, surveyId: string, idQuestionItem?: GoogleAppsScript.Forms.Item) => GoogleFormResponse;
  var onFormSubmit_: (e: GoogleAppsScript.Events.FormsOnFormSubmit) => void;

  //surveys.ts
  var createNewSurvey: (title: string, description: string) => SurveyID;
  var addExistingSurvey: (surveyId: string, endTime?: string) => {
    survey: SurveyID;
    responses: GoogleFormResponse[];
  }
  var installTrigger_: (survey: GoogleAppsScript.Forms.Form) => void;
  var uninstallTrigger_: (survey: GoogleAppsScript.Forms.Form) => void;
  var addIdQuestion_: (survey: GoogleAppsScript.Forms.Form) => void;
  var getIdQuestionItem_: (items: GoogleAppsScript.Forms.Item[]) => GoogleAppsScript.Forms.Item | undefined;
  var getIdQuestionEntryNumber_: (survey: GoogleAppsScript.Forms.Form) => string;
  var getUpdatedSurveyTitlesAndDescriptions_: (surveyIds: string[], startTime?: string) => Pick<SurveyID, 'id' | 'name' | 'description'>[];
  var deleteSurvey: (surveyId: string) => void;
  var deleteSurveys: (surveyIds: string[]) => void;
}

export { };