import { SurveyID } from '@/types/survey-types';
import { GoogleFormResponse } from '@/types/apps-script-types';

declare global {
  // cronJob.js
  var getRecentUpdates: (surveyIds: string[], timeAfter: string) => {
    surveys: Pick<SurveyID, 'id' | 'name' | 'description'>[];
    responses: GoogleFormResponse[];
  }

  // responses.ts
  var getRecentResponses_: (surveyIds: string[], timeAfter: string) => GoogleFormResponse[];
  var mapResponseToGoogleFormResponse: (response: GoogleAppsScript.Forms.FormResponse, surveyId: string, idQuestionItem?: GoogleAppsScript.Forms.Item) => GoogleFormResponse;

  //surveys.ts
  var createNewSurvey: (title: string, description: string) => SurveyID;
  var addExistingSurvey: (surveyId: string) => {
    survey: SurveyID;
    responses: GoogleFormResponse[];
  }
  var addIdQuestion_: (survey: GoogleAppsScript.Forms.Form) => void;
  var getUpdatedSurveyTitlesAndDescriptions_: (surveyIds: string[], timeAfter: string) => Pick<SurveyID, 'id' | 'name' | 'description'>[];
  var getIdQuestionItem_: (items: GoogleAppsScript.Forms.Item[]) => GoogleAppsScript.Forms.Item | undefined;
}

export { };